// tslint:disable: max-line-length
import * as Core from "@litert/core";

export interface ISMTPErrorMetadata {

    details: {

        code: string;

        message: string;
    };

    [key: string]: any;
}

export const ErrorHub = Core.createErrorHub<ISMTPErrorMetadata>("@litert/smtp");

export const E_CONN_TIMEOUT = ErrorHub.define<ISMTPErrorMetadata>(
    420,
    "E_CONN_TIMEOUT",
    "Timeout connection problem: there have been issues during the message transfer.",
    {
        "details": {
            "code": "unknwon",
            "message": "This error message is produced only by GroupWise servers. Either your email has been blocked by the recipient's firewall, or there's a hardware problem. Check with your provider."
        }
    }
);

export const E_SERVICE_UNAVAILABLE = ErrorHub.define<ISMTPErrorMetadata>(
    421,
    "E_SERVICE_UNAVAILABLE",
    "The service is unavailable due to a connection problem: it may refer to an exceeded limit of simultaneous connections, or a more general temporary problem.",
    {
        "details": {
            "code": "unknwon",
            "message": "The server (yours or the recipient's) is not available at the moment, so the dispatch will be tried again later."
        }
    }
);

export const E_MAILBOX_FULL = ErrorHub.define<ISMTPErrorMetadata>(
    422,
    "E_MAILBOX_FULL",
    "The recipient's mailbox has exceeded its storage limit.",
    {
        "details": {
            "code": "unknwon",
            "message": "Best is to contact contact the user via another channel to alert him and ask to create some free room in his mailbox."
        }
    }
);

export const E_NO_ENOUGH_SPACE = ErrorHub.define<ISMTPErrorMetadata>(
    431,
    "E_NO_ENOUGH_SPACE",
    "Not enough space on the disk, or an 'out of memory' condition due to a file overload.",
    {
        "details": {
            "code": "unknwon",
            "message": "This error may depend on too many messages sent to a particular domain. You should try again sending smaller sets of emails instead of one big mail-out."
        }
    }
);

export const E_MS_EXCHANGE_STOPPED = ErrorHub.define<ISMTPErrorMetadata>(
    432,
    "E_MS_EXCHANGE_STOPPED",
    "Typical side-message: The recipient's Exchange Server incoming mail queue has been stopped.",
    {
        "details": {
            "code": "unknwon",
            "message": "It's a Microsoft Exchange Server's SMTP error code. You should contact it to get more information: generally it's due to a connection problem."
        }
    }
);

export const E_NO_RESPONSE = ErrorHub.define<ISMTPErrorMetadata>(
    441,
    "E_NO_RESPONSE",
    "The recipient's server is not responding.",
    {
        "details": {
            "code": "unknwon",
            "message": "There's an issue with the user's incoming server: yours will try again to contact it."
        }
    }
);

export const E_CONN_LOST = ErrorHub.define<ISMTPErrorMetadata>(
    442,
    "E_CONN_LOST",
    "The connection was dropped during the transmission.",
    {
        "details": {
            "code": "unknwon",
            "message": "A typical network connection problem, probably due to your router: check it immediately."
        }
    }
);

export const E_TOO_MANY_HOPS = ErrorHub.define<ISMTPErrorMetadata>(
    446,
    "E_TOO_MANY_HOPS",
    "The maximum hop count was exceeded for the message: an internal loop has occurred.",
    {
        "details": {
            "code": "unknwon",
            "message": "Ask your SMTP provider to verify what has happened."
        }
    }
);

export const E_REMOTE_SERVER_TIMEOUT = ErrorHub.define<ISMTPErrorMetadata>(
    447,
    "E_REMOTE_SERVER_TIMEOUT",
    "Your outgoing message timed out because of issues concerning the incoming server.",
    {
        "details": {
            "code": "unknwon",
            "message": "This happens generally when you exceeded your server's limit of number of recipients for a message. Try to send it again segmenting the list in different parts."
        }
    }
);

export const E_MS_ROUTER_ERROR = ErrorHub.define<ISMTPErrorMetadata>(
    449,
    "E_MS_ROUTER_ERROR",
    "A routing error.",
    {
        "details": {
            "code": "unknwon",
            "message": "Like error 432, it's related only to Microsoft Exchange. Use WinRoute."
        }
    }
);

export const E_NOT_ACCEPTED = ErrorHub.define<ISMTPErrorMetadata>(
    450,
    "E_NOT_ACCEPTED",
    "Requested action not taken . The user's mailbox is unavailable. The mailbox has been corrupted or placed on an offline server, or your email hasn't been accepted for IP problems or blacklisting.",
    {
        "details": {
            "code": "unknwon",
            "message": "The server will retry to mail the message again, after some time. Anyway, verify that is working on a reliable IP address."
        }
    }
);

export const E_REQUEST_ABORTED = ErrorHub.define<ISMTPErrorMetadata>(
    451,
    "E_REQUEST_ABORTED",
    "Requested action aborted . Local error in processing. Your ISP's server or the server that got a first relay from yours has encountered a connection problem.",
    {
        "details": {
            "code": "unknwon",
            "message": "It's normally a transient error due to a message overload, but it can refer also to a rejection due to a remote antispam filter. If it keeps repeating, ask your SMTP provider to check the situation. (If you're sending a large bulk email with a free one that can be a common issue)."
        }
    }
);

export const E_TOO_MANY_ADDR = ErrorHub.define<ISMTPErrorMetadata>(
    452,
    "E_TOO_MANY_RECIPIENTS",
    "Too many emails sent or too many recipients: more in general, a server storage limit exceeded.",
    {
        "details": {
            "code": "unknwon",
            "message": "Again, the typical cause is a message overload. Usually the next try will succeed: in case of problems on your server it will come with a side-message like 'Out of memory'."
        }
    }
);

export const E_SOURCE_SERVER_ERROR = ErrorHub.define<ISMTPErrorMetadata>(
    471,
    "E_SOURCE_SERVER_ERROR",
    "An error of your mail server, often due to an issue of the local anti-spam filter.",
    {
        "details": {
            "code": "unknwon",
            "message": "Contact your SMTP service provider to fix the situation."
        }
    }
);

export const E_SYNTAX_ERROR = ErrorHub.define<ISMTPErrorMetadata>(
    500,
    "E_SYNTAX_ERROR",
    "A syntax error: the server couldn't recognize the command.",
    {
        "details": {
            "code": "unknwon",
            "message": "It may be caused by a bad interaction of the server with your firewall or antivirus. Read carefully their instructions to solve it."
        }
    }
);

export const E_INVALID_PARAM = ErrorHub.define<ISMTPErrorMetadata>(
    501,
    "E_INVALID_PARAM",
    "Another syntax error, not in the command but in its parameters or arguments.",
    {
        "details": {
            "code": "unknwon",
            "message": "In the majority of the times it's due to an invalid email address, but it can also be associated with connection problems (and again, an issue concerning your antivirus settings)."
        }
    }
);

export const E_CMD_NOT_IMPL = ErrorHub.define<ISMTPErrorMetadata>(
    502,
    "E_CMD_NOT_IMPL",
    "The command is not implemented.",
    {
        "details": {
            "code": "unknwon",
            "message": "The command has not been activated yet on your own server. Contact your provider to know more about it."
        }
    }
);

export const E_BAD_CMD_SEQ = ErrorHub.define<ISMTPErrorMetadata>(
    503,
    "E_BAD_CMD_SEQ",
    "The server has encountered a bad sequence of commands, or it requires an authentication.",
    {
        "details": {
            "code": "unknwon",
            "message": "In case of 'bad sequence', the server has pulled off its commands in a wrong order, usually because of a broken connection. If an authentication is needed, you should enter your username and password."
        }
    }
);

export const E_PARAM_NOT_SUPPORT = ErrorHub.define<ISMTPErrorMetadata>(
    504,
    "E_PARAM_NOT_SUPPORT",
    "A command parameter is not implemented.",
    {
        "details": {
            "code": "unknwon",
            "message": "Like error 501, is a syntax problem; you should ask your provider."
        }
    }
);

export const E_ADDR_NOT_EXISTS = ErrorHub.define<ISMTPErrorMetadata>(
    511,
    "E_ADDR_NOT_EXISTS",
    "Bad email address.",
    {
        "details": {
            "code": "unknwon",
            "message": "One of the addresses in your TO, CC or BBC line doesn't exist. Check again your recipients' accounts and correct any possible misspelling."
        }
    },
    [510]
);

export const E_DNS_ERROR = ErrorHub.define<ISMTPErrorMetadata>(
    512,
    "E_DNS_ERROR",
    "A DNS error: the host server for the recipient's domain name cannot be found.",
    {
        "details": {
            "code": "unknwon",
            "message": "Check again all your recipients' addresses: there will likely be an error in a domain name (like mail@domain.coom instead of mail@domain.com)."
        }
    }
);

export const E_INVALID_ADDR = ErrorHub.define<ISMTPErrorMetadata>(
    513,
    "E_INVALID_ADDR",
    "Address type is incorrect: another problem concerning address misspelling. In few cases, however, it's related to an authentication issue.",
    {
        "details": {
            "code": "unknwon",
            "message": "Doublecheck your recipients' addresses and correct any mistake. If everything's ok and the error persists, then it's caused by a configuration issue (simply, the server needs an authentication)."
        }
    }
);

export const E_SIZE_OVERHEAD = ErrorHub.define<ISMTPErrorMetadata>(
    523,
    "E_SIZE_OVERHEAD",
    "The total size of your mailing exceeds the recipient server's limits.",
    {
        "details": {
            "code": "unknwon",
            "message": "Re-send your message splitting the list in smaller subsets."
        }
    }
);

export const E_AUTH = ErrorHub.define<ISMTPErrorMetadata>(
    530,
    "E_AUTH",
    "Normally, an authentication problem. But sometimes it's about the recipient's server blacklisting yours, or an invalid email address.",
    {
        "details": {
            "code": "unknwon",
            "message": "Configure your settings providing a username+password authentication. If the error persists, check all your recipients' addresses and if you've been blacklisted."
        }
    }
);

export const E_REJECTED = ErrorHub.define<ISMTPErrorMetadata>(
    541,
    "E_REJECTED",
    "The recipient address rejected your message: normally, it's an error caused by an anti-spam filter.",
    {
        "details": {
            "code": "unknwon",
            "message": "Your message has been detected and labeled as spam. You must ask the recipient to whitelist you."
        }
    }
);

export const E_ADDR_NOT_FOUND = ErrorHub.define<ISMTPErrorMetadata>(
    550,
    "E_ADDR_NOT_FOUND",
    "It usually defines a non-existent email address on the remote side.",
    {
        "details": {
            "code": "unknwon",
            "message": "Though it can be returned also by the recipient's firewall (or when the incoming server is down), the great majority of errors 550 simply tell that the recipient email address doesn't exist. You should contact the recipient otherwise and get the right address."
        }
    }
);

export const E_USER_NOT_FOUND = ErrorHub.define<ISMTPErrorMetadata>(
    551,
    "E_USER_NOT_FOUND",
    "User not local or invalid address . Relay denied. Meaning, if both your address and the recipient's are not locally hosted by the server, a relay can be interrupted.",
    {
        "details": {
            "code": "unknwon",
            "message": "It's a (not very clever) strategy to prevent spamming. You should contact your ISP and ask them to allow you as a certified sender."
        }
    }
);

export const E_OUT_OF_SPACE = ErrorHub.define<ISMTPErrorMetadata>(
    552,
    "E_OUT_OF_SPACE",
    "Requested mail actions aborted . Exceeded storage allocation: simply put, the recipient's mailbox has exceeded its limits.",
    {
        "details": {
            "code": "unknwon",
            "message": "Try to send a lighter message: that usually happens when you dispatch emails with big attachments, so check them first."
        }
    }
);

export const E_ADDR_INVALID = ErrorHub.define<ISMTPErrorMetadata>(
    553,
    "E_ADDR_INVALID",
    "Requested action not taken . Mailbox name invalid. That is, there's an incorrect email address into the recipients line.",
    {
        "details": {
            "code": "unknwon",
            "message": "Check all the addresses in the TO, CC and BCC field. There should be an error or a misspelling somewhere."
        }
    }
);

export const E_TRANS_FAILED = ErrorHub.define<ISMTPErrorMetadata>(
    554,
    "E_TRANS_FAILED",
    "This means that the transaction has failed. It's a permanent error and the server will not try to send the message again.",
    {
        "details": {
            "code": "unknwon",
            "message": "The incoming server thinks that your email is spam, or your IP has been blacklisted. Check carefully if you ended up in some spam lists."
        }
    }
);

export const E_DKIM_INVALID_CANO = ErrorHub.define<ISMTPErrorMetadata>(
    1001,
    "E_DKIM_INVALID_CANO",
    "The canonicalization for DKIM is invalid.",
    {
        "details": {
            "code": "unknwon",
            "message": "The canonicalization for DKIM is invalid."
        }
    }
);
