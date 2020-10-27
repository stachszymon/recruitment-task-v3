import express, { Application } from "express";

export default class App {
    public express: Application;
    private port: number;

    constructor(port: number = 3000) {
        this.express = express();
        this.port = port;
    }

    public run(): App {
        this.express.listen(this.port, () => {
            console.log(`Express app started on port: ${this.port}`)
        })
        return this;
    }
}