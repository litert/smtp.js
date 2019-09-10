
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

export interface ISenderOptions {

    /**
     * The valid domains for sending letter.
     */
    domains: string[];

    /**
     * How long will the DNS query result be cached, in milliseconds.
     *
     * @default 600000 ms
     */
    dnsCache?: number;
}

export const CRLF = "\r\n";
