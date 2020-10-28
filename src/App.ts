import express, { Application } from "express";
import { RouteDefinition } from "./utils/ControllerDecorators";
import debug from "debug";
debug.enable('*')

const a = debug('app');

export default class App {
    private express: Application;
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

    public getExpress() {
        return this.express;
    }

    public initializeControllers(controllers: any[]): void {
        const router = express.Router();

        controllers.forEach(controller => {
            const instance = new controller(),
                prefix: string = Reflect.get(controller, "prefix"),
                routes: Array<RouteDefinition> = Reflect.get(controller, "routes");

            a(controller);

            const newRoutes = express.Router();

            a(routes?.length)

            routes.forEach(route => {
                const x = route.handler;
                console.log(route.method, route.path, x, "instance")
                // newRoutes[route.method](route.path, x);
            })

            router.use(prefix, newRoutes)
        })

        this.getExpress().use(router);
    }
}