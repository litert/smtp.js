/**
 * Copyright 2018 Angus.Fenying
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// tslint:disable: no-string-literal

import * as $DNS from "dns";
import * as $Net from "net";
import * as C from "./Common";
import * as E from "./Errors";
import { RawPromise } from "@litert/core";

class Connection {

    private _socket!: $Net.Socket;

    private _connectPromise!: Promise<void>;

    private _buffer!: string;

    private _waiters!: Array<RawPromise<any>>;

    public constructor(
        public readonly mxHost: string,
        public readonly hostname: string,
        private readonly _fromHost: string
    ) {}

    public close(): void {

        if (this._socket) {

            this._socket.end();
        }
    }

    public async connect(): Promise<void> {

        if (this._connectPromise) {

            return this._connectPromise;
        }

        if (this._socket) {

            return;
        }

        await (this._connectPromise = new Promise((resolve, reject) => {

            this._socket = $Net.connect({
                host: this.mxHost,
                port: 25
            })
            .on("connect", () => {

                delete this._connectPromise;

                this._buffer = "";

                this._waiters = [];

                this._socket.removeAllListeners("error");

                this._socket.on("error", (e) => {

                    delete this._socket;
                });

                resolve();

            })
            .on("error", (e) => {

                delete this._socket;
                delete this._connectPromise;
                reject(e);

            })
            .on("data", (data: Buffer) => this._writeBuffer(data.toString()))
            .on("close", () => {

                for (const ret of this._waiters) {

                    ret.reject(new E.E_CONN_LOST());
                }

                this._waiters = [];

                delete this._socket;
            });
        }));

        await this.send(`HELO ${this._fromHost}`);
    }

    private _writeBuffer(chunk: string): void {

        this._buffer += chunk;

        const responses = this._buffer.split(C.CRLF);

        this._buffer = responses.pop() as string;

        let msg: string;

        // tslint:disable-next-line: no-conditional-assignment
        while (msg = responses.shift() as string) {

            const code = parseInt(msg.substr(0, 3));

            let extCode = "";

            if (msg[5] === "." && msg[7] === ".") {

                extCode = msg.slice(4, 9);
                msg = msg.slice(9);
            }
            else {
                msg = msg.slice(4);
            }

            switch (code) {
                case 220: // Server accepted connection.

                    break;

                case 221: // Server closed.

                    this._socket.end();
                    delete this._socket;

                    break;

                case 250: {// Command OK.

                    const ret = this._waiters.shift() as RawPromise<any>;
                    ret.resolve(msg);

                    break;
                }
                case 354: {// Command OK.

                    const ret = this._waiters.shift() as RawPromise<any>;
                    ret.resolve(msg);

                    break;
                }
                case 420: { // Connection timeout.

                    while (1) {

                        const ret = this._waiters.shift() as RawPromise<any>;

                        if (ret) {

                            ret.reject(new E.E_CONN_TIMEOUT());
                        }
                        else {

                            break;
                        }
                    }

                    this._socket.end();
                    delete this._socket;
                    break;
                }
                default: {

                    const ret = this._waiters.shift() as RawPromise<any>;
                    const ERROR = E.ErrorHub.get(code);

                    ret.reject(new ERROR({
                        "metadata": {
                            "details": {
                                "code": extCode,
                                "message": msg
                            }
                        }
                    }));
                }
            }
        }
    }

    public send(command: string): Promise<string> {

        if (!this._socket) {

            throw new E.E_CONN_LOST();
        }

        let ret = new RawPromise<string>();

        this._socket.write(command + C.CRLF);

        this._waiters.push(ret);

        return ret.promise;
    }
}

interface IDNSRecord {

    exchange: string;

    expiringAt: number;
}

class ServerSender implements C.IServerSender {

    private _pool: Record<string, Connection> = {};

    private _dnsCache: Record<string, IDNSRecord> = {};

    private _domains: Record<string, C.IDomainOptions> = {};

    public constructor(
        domains: Array<C.IDomainOptions | string>,
        private _dnsTTL: number = 600000,
        private _dkimSigner?: C.TDKIMSigner
    ) {

        domains.forEach((v) => this.addDomain(v));
    }

    public addDomain(domain: string | C.IDomainOptions): this {

        if (typeof domain === "string") {

            domain = { domain };
        }

        this._domains[domain.domain.toLowerCase()] = {
            "domain": domain.domain.toLowerCase(),
            "dkim": domain.dkim
        };

        return this;
    }

    public removeDomain(domain: string): this {

        delete this._domains[domain.toLowerCase()];

        return this;
    }

    public existDomain(domain: string): boolean {

        return !!this._domains[domain.toLowerCase()];
    }

    public async send(info: C.IMailOptions): Promise<void> {

        const usedDomain = this._extractHostname(
            info.from.address = info.from.address.toLowerCase().trim()
        );

        if (!this._domains[usedDomain]) {

            throw new E.E_USER_NOT_FOUND();
        }

        info.to = info.to.map((v) => ({
            name: v.name,
            address: v.address.toLowerCase().trim()
        }));

        info.cc = (info.cc || []).map((v) => ({
            name: v.name,
            address: v.address.toLowerCase().trim()
        }));

        const recipients: Record<string, C.IPerson[]> = {};

        for (let p of Array.from(new Set([
            ...info.to,
            ...info.cc
        ]))) {

            let hostname = this._extractHostname(p.address);

            if (!recipients[hostname]) {

                recipients[hostname] = [];
            }

            recipients[hostname].push(p);
        }

        // const MAIL_DATA = [
        //     "MIME-Version: 1.0",
        //     `Date: ${new Date().toUTCString()}`,
        //     `From: ${this._wrapRecipient(info.from)}`,
        //     `Delivered-To: ${info.to.map((v) => this._wrapRecipient(v)).join(", ")}`,
        //     `To: ${info.to.map((v) => this._wrapRecipient(v)).join(", ")}`,
        //     ...((): string[] => {

        //         const ret: string[] = [];

        //         if (info.uuid) {

        //             ret.push(`Message-Id: <${info.uuid}@${usedDomain}>`);
        //         }

        //         if (info.cc.length) {

        //             ret.push(`Cc: ${info.cc.map((v) => this._wrapRecipient(v)).join(", ")}`);
        //         }

        //         if (info.replyTo) {

        //             ret.push(`Reply-To: ${this._wrapRecipient(info.replyTo)}`);
        //         }

        //         return ret;
        //     })(),
        //     `Subject: ${this._encodeUTF8(info.subject)}`,
        //     `Content-Type: ${this._getContentType(info.format)}; charset=UTF-8`,
        //     `Content-Transfer-Encoding: base64`,
        //     "",
        //     Buffer.from(info.body).toString("base64"),
        //     "."
        // ].join(C.CRLF);

        const MAIL_DATA: string[] = [];
        const MAIL_HEADERS: Record<string, string> = {};
        const MAIL_BODY = Buffer.from(info.body)
                        .toString("base64")
                        .replace(/(.{78})(?!$)/g, "$1" + C.CRLF);

        MAIL_HEADERS["MIME-Version"] = "1.0";
        MAIL_HEADERS["Date"] = new Date().toUTCString();
        MAIL_HEADERS["From"] = this._wrapPerson(info.from);
        MAIL_HEADERS["To"] = MAIL_HEADERS["Delivered-To"] = info.to.map(
            (v) => this._wrapPerson(v)
        ).join(", ");
        MAIL_HEADERS["From"] = this._wrapPerson(info.from);

        if (info.uuid) {

            MAIL_HEADERS["Message-Id"] = `<${info.uuid}@${usedDomain}>`;
        }

        if (info.cc.length) {

            MAIL_HEADERS["Cc"] = info.cc.map((v) => this._wrapPerson(v)).join(", ");
        }

        if (info.replyTo) {

            MAIL_HEADERS["Reply-To"] = this._wrapPerson(info.replyTo);
        }

        MAIL_HEADERS["Subject"] = this._encodeUTF8(info.subject);
        MAIL_HEADERS["Content-Type"] = `${this._getContentType(info.format)}; charset=UTF-8`;
        MAIL_HEADERS["Content-Transfer-Encoding"] = "base64";

        const domain = this._domains[usedDomain];

        /**
         * If domain enabled DKIM, use DKIM by default.
         */
        if (domain.dkim && info.dkim !== false) {

            if (!this._dkimSigner) {

                throw new E.E_DKIM_NOT_READY();
            }

            const [dkimField, dkimValue] = this._dkimSigner(
                MAIL_HEADERS,
                MAIL_BODY,
                domain.dkim.selector,
                usedDomain,
                domain.dkim.privateKey
            );

            MAIL_HEADERS[dkimField] = dkimValue;
        }

        for (const f in MAIL_HEADERS) {

            MAIL_DATA.push(`${f}: ${MAIL_HEADERS[f]}`);
        }

        MAIL_DATA.push("");
        MAIL_DATA.push(MAIL_BODY);
        MAIL_DATA.push(".");

        for (const hostname in recipients) {

            let conn = this._pool[hostname];

            if (!conn) {

                conn = new Connection(
                    await this._nsLookUp(hostname),
                    hostname,
                    usedDomain
                );
            }

            await conn.connect();

            await conn.send(`MAIL FROM: <${info.from.address}>`);

            for (let to of recipients[hostname]) {

                await conn.send(`RCPT TO: <${to.address}>`);
            }

            await conn.send(`DATA`);

            await conn.send(MAIL_DATA.join(C.CRLF));
        }
    }

    public close(): void {

        for (let k in this._pool) {

            this._pool[k].close();
        }

        this._pool = {};
    }

    private _extractHostname(addr: string): string {

        return addr.slice(addr.indexOf("@") + 1);
    }

    private _getContentType(type: C.EFormat): string {

        return type === C.EFormat.HTML ? "text/html" : "text/plain";
    }

    private _encodeUTF8(text: string): string {

        return `=?UTF-8?B?${Buffer.from(text).toString("base64")}?=`;
    }

    /**
     * Wrap the recipient/sender info into UTF-8 encoding if necessary.
     *
     * @param p The person info.
     */
    private _wrapPerson(p: C.IPerson) {

        if (/^[-\. \w]+$/.test(p.name)) {

            return `"${p.name}" <${p.address}>`;
        }

        return `${this._encodeUTF8(p.name)} <${p.address}>`;
    }

    /**
     * Find the MX record of determined hostname, with the highest priority.
     *
     * @param hostname The hostname to be looked up.
     */
    private _nsLookUp(hostname: string): Promise<string> {

        let d = this._dnsCache[hostname];

        if (d && d.expiringAt >= Date.now()) {

            return Promise.resolve(d.exchange);
        }

        return new Promise((resolve, reject) => {

            $DNS.resolveMx(hostname, (error, addresses) => {

                if (error) {

                    return reject(new E.E_DNS_ERROR({ metadata: { error } }));
                }

                const theOne = addresses.find(
                    (v) => v.priority === Math.max(...addresses.map((x) => x.priority))
                );

                if (!theOne) {

                    return reject(new E.E_DNS_ERROR());
                }

                if (this._dnsTTL > 0) {

                    this._dnsCache[hostname] = {
                        exchange: theOne.exchange,
                        expiringAt: Date.now() + this._dnsTTL
                    };
                }

                resolve(theOne.exchange);
            });
        });
    }
}

export function createServerSender(opts: C.ISenderOptions): C.IServerSender {

    return new ServerSender(
        opts.domains,
        opts.dnsCache,
        opts.dkimSigner
    );
}
