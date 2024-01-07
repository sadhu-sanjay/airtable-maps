export class JSONObjectSeparator {
    private brace_count!: number;
    private inString!: boolean;
    private escaped!: boolean;
    private buffer!: string;
    private onObjectCallback: (jsonObject: string) => void;

    constructor(onObjectCallback: (jsonObject: string) => void) {

        this.onObjectCallback = onObjectCallback;
        this.reset();
    }

    public reset() {

        this.brace_count = 0;
        this.inString = false;
        this.escaped = false;
        this.buffer = "";
    }

    public receive(S: string) {
        let pos = 0;

        for (let i = 0; i < S.length; i++) {
            const c = S[i];

            if (this.inString) {
                if (this.escaped) {
                    this.escaped = false;
                } else {
                    if (c == "\\") {
                        this.escaped = true;
                    } else if (c == "\"") {
                        this.inString = false;
                    }
                }
            } else {
                if (c == "{") {
                    this.brace_count++;
                } else if (c == "}") {
                    this.brace_count--;
                    if (this.brace_count === 0) {
                        this.buffer += S.substring(pos, i + 1);
                        this.onObjectCallback(this.buffer);
                        this.buffer = "";
                        pos = i + 1;
                    }
                } else if (c == "\"") {
                    this.inString = true;
                }
            }
        }

        this.buffer += S.substring(pos);
    }
}

