import { CRLF, IHeaderBuilder } from "./Common";

class HeaderBuilder implements IHeaderBuilder {

    private _content: string = "";

    private _indent: string;

    private _lineContentLen: number;

    public constructor(
        name: string,
        private _maxLineLength: number = 80,
        private _indentLength: number = 4
    ) {

        this._content += name + ": ";

        this._indent = " ".repeat(this._indentLength);

        this._lineContentLen = this._maxLineLength - CRLF.length - this._indentLength;
    }

    public append(p: string): this {

        this._content += p;

        return this;
    }

    private _softCut(p: string, maxLen: number): [string, string] {

        let s = p.slice(0, maxLen);

        let c = s.match(/[ \t]/g) as string[];

        if (c) {

            s = s.slice(0, s.lastIndexOf(c[c.length - 1]));
        }
        else {

            c = s.match(/[:;]/g) as string[];

            if (c) {

                s = s.slice(0, s.lastIndexOf(c[c.length - 1]) + 1);
            }
        }

        return [s, p.slice(s.length).trim()];
    }

    public toString(): string {

        const lines: string[] = [];

        let content = this._content;

        if (this._content.length > this._lineContentLen + this._indentLength) {

            let ln: string;

            [ln, content] = this._softCut(content, this._lineContentLen + this._indentLength);

            lines.push(ln);
        }

        while (content.length > this._lineContentLen) {

            let ln: string;

            [ln, content] = this._softCut(content, this._lineContentLen);

            lines.push(this._indent + ln);
        }

        if (content) {

            lines.push(this._indent + content);
        }

        return lines.join(CRLF);
    }
}

export function createHeaderBuilder(

    name: string,
    maxLineLength?: number,
    indentLength?: number
): IHeaderBuilder {

    return new HeaderBuilder(name, maxLineLength, indentLength);
}
