import * as Signs from "@litert/signatures";
import * as C from "./Common";
import * as E from "./Errors";

export interface IDKIMSignOptions {

    headers: string[];

    body: string;

    canonicalization: "simple" | "relaxed" | "simple/simple" | "relaxed/simple" | "simple/relaxed" | "relaxed/relaxed";
}

export interface IDKIMHelper {

    sign(info: IDKIMSignOptions): string;
}

export interface IDKIMOptions {

    pubKey: string;

    privKey: Signs.IAsymmetricKey;

    selector: string;
}

export class DKIMHelper {

    private signer: Signs.ISigner<"base64">;

    public constructor(
        private _options: IDKIMOptions
    ) {

        this.signer = Signs.RSA.createSigner(
            "sha256",
            "",
            this._options.privKey,
            Signs.ERSAPadding.PKCS1_V1_5,
            "base64"
        );
    }

    private _validateCanonicalization(
        canonicalization: IDKIMSignOptions["canonicalization"]
    ): IDKIMSignOptions["canonicalization"] {

        const p = canonicalization.split("/");

        if (p.filter((v) => ["simple", "relaxed"].includes(v)).length !== p.length) {

            throw new E.E_DKIM_INVALID_CANO();
        }

        switch (p.length) {
        case 1: return p + "/simple" as any;
        case 2: return canonicalization;
        default:
            throw new E.E_DKIM_INVALID_CANO();
        }
    }

    public _canonicalizeBody(body: string, algo: "relaxed" | "simple"): string {

        if (algo === "simple") {

            /**
             * simple algo:
             *
             * 1. Remove all empty lines at the end of body.
             * 2. Make sure the body ending with a CRLF.
             */
            return body.replace(/(\r?\n)+$/, "") + C.CRLF;
        }
        else {

            if (!body) {

                return "";
            }

            /**
             * relaxed algo:
             *
             * 1. Replace all tab/space into space.
             * 2. Remove all space/CR/LF at the end of lines.
             * 3. Make sure all lines end with CRLF.
             * 4. Remove all empty lines at the end of body.
             * 5. Make sure the body ending with a CRLF.
             */
            return body.replace(/[ \t]+/g, " ")
            .split("\n")
            .map((l) => l.replace(/[ \r]+$/, ""))
            .join(C.CRLF)
            .replace(/(\r\n)+$/, "") + C.CRLF;
        }
    }

    public _canonicalizeHeaderLine(item: string, algo: "relaxed" | "simple"): string {

        if (algo === "simple") {

            return item;
        }

        let [k, ...v] = item.split(":");

        return k.toLowerCase().trim().replace(/[ \t]+/g, " ") + ":" + v.join(":").replace(
            /\r?\n/g, ""
        ).replace(
            /[ \t]+/g, " "
        ).replace(
            /[ \t]+$/, ""
        ).replace(
            /^[ \t]+/, ""
        );
    }
}
