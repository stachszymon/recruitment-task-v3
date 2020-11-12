export default class ValidationError extends Error {
    public messages: string[];

    constructor(data: string[]) {
        super(data.join(", "));
        this.name = "ValidationError"
        this.messages = data;
    }
}