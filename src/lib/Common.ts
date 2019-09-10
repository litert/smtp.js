
export interface IPerson {

    "name": string;

    "address": string;
}

export enum EFormat {

    TEXT,
    HTML
}

export interface IMailOptions {

    "from": IPerson;

    "to": IPerson[];

    "cc": IPerson[];

    "replyTo"?: IPerson;

    "subject": string;

    "body": string;

    "format": EFormat;

    "uuid"?: string;
}

export interface IServerSender {

    send(info: IMailOptions): Promise<void>;
}

export const CRLF = "\r\n";
