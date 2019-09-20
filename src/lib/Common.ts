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

    "name": string;

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
}

export type TDKIMSigner = (
    headers: Record<string, string>,
    body: string,
    selector: string,
    domain: string,
    privateKey: string | Buffer
) => [string, string];

export interface IDomainOptions {

    domain: string;

    dkim?: {

        selector: string;

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

    dkimSigner?: TDKIMSigner;
}

export const CRLF = "\r\n";
