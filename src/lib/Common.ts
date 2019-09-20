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

export interface IPerson {

    /**
     * The display name of the person.
     */
    "name": string;

    /**
     * The mailbox address of the person.
     */
    "address": string;
}

export enum EFormat {

    TEXT,
    HTML
}

export interface IMailOptions {

    /**
     * The sender.
     */
    "from": IPerson;

    /**
     * The recipients.
     */
    "to": IPerson[];

    /**
     * The additional recipients.
     */
    "cc"?: IPerson[];

    /**
     * Reply to the address.
     */
    "replyTo"?: IPerson;

    /**
     * The letter subject.
     */
    "subject": string;

    /**
     * the letter body.
     */
    "body": string;

    /**
     * The format of a letter.
     */
    "format": EFormat;

    /**
     * The unique message id of a letter.
     *
     * __IT WILL AUTO APPEND THE DOMAIN AT THE END.__
     */
    "uuid"?: string;

    /**
     * Set to `false` to disable the DKIM when the domain enabled DKIM.
     *
     * If domain doesn't enable DKIM, this option will be ignored.
     *
     * @default true
     */
    "dkim"?: boolean;
}

export interface IServerSender {

    /**
     * Send a letter.
     *
     * @param info The details of the letter.
     */
    send(info: IMailOptions): Promise<void>;

    /**
     * Close all connections.
     */
    close(): void;

    /**
     * Add a new domain. If the domain already exists, the previous will be overwritten.
     *
     * @param domain The domain info.
     */
    addDomain(domain: string | IDomainOptions): this;

    /**
     * Remove a existing domain.
     *
     * @param domain The domain.
     */
    removeDomain(domain: string): this;

    /**
     * Check if a domain exists.
     *
     * @param domain The domain.
     */
    existDomain(domain: string): boolean;
}

export type TDKIMSigner = (
    headers: Record<string, string>,
    body: string,
    selector: string,
    domain: string,
    privateKey: string | Buffer
) => [string, string];

export interface IDomainOptions {

    /**
     * The domain. If not lowercase, it will be transform into lowercase.
     */
    domain: string;

    /**
     * The DKIM settings. If omittedc, the DKIM will not be used for this domain.
     */
    dkim?: {

        /**
         * The SELECTOR used for DKIM signature.
         */
        selector: string;

        /**
         * The private RSA key used for DKIM signature.
         */
        privateKey: string | Buffer;
    };
}

export interface ISenderOptions {

    /**
     * The valid domains for sending letter.
     */
    domains: Array<string | IDomainOptions>;

    /**
     * How long will the DNS query result be cached, in milliseconds.
     *
     * @default 600000 ms
     */
    dnsCache?: number;

    /**
     * The DKIM signer fnction for the sender.
     *
     * If omitted, DKIM will not work.
     */
    dkimSigner?: TDKIMSigner;
}

export const CRLF = "\r\n";
