import express, { Application, NextFunction, Response, Request } from "express";
import { RouteDefinition } from "./utils/ControllerDecorators";
import bodyParser from 'body-parser';

export default class App {
    private express: Application;
    private readonly port: number;

    constructor(port: number = 3000) {
        this.express = express();
        this.port = port;
    }

    public run(): App {
        this.express.use(bodyParser.json())

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

            const newRoutes = express.Router();

            routes.forEach(route => {
                newRoutes[route.method](route.path, this.methodHandler(instance[route.handler]));
            })

            router.use(prefix, newRoutes)
        })

        this.getExpress().use(bodyParser.json());
        this.getExpress().use(router);
    }

    private methodHandler(method: Function) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                return await method(req, res, next);
            } catch (err) {
                return res.status(500).json({ error: true, message: err.toString() })
            }
        }
    }
}