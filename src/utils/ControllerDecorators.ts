import { Console } from "console";
import debug from "debug";

debug.enable('*')

const c = debug("@CtrD"),
    g = debug("@GetD");


export type RouteDefinition = {
    path: string
    method: "get" | "post" | "delete" | "options" | "put"
    handler: Function | string | symbol
}

function checkForRoutesArray(target: Object): void {
    if (!Reflect.has(target, "routes")) {
        const routesArray: Array<RouteDefinition> = []
        Reflect.set(target, "routes", routesArray)
    }
}

export function Get(path: string): MethodDecorator {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ): void {

        checkForRoutesArray(target);

        const routes: Array<RouteDefinition> = Reflect.get(target, "routes");

        routes.push({
            method: "get",
            path,
            handler: key
        })

        Reflect.set(target, "routes", routes);

        g(target);

    }
}

export function Controller(path: string): ClassDecorator {
    return function (target: Function) {
        Reflect.set(target, "prefix", path)

        c(target)
        c(target.prototype)
        c(Reflect.ownKeys(target))

        Reflect.set(target, "routes", target.prototype.routes)

        checkForRoutesArray(target);

        // if (!Reflect.has(target, "routes")) {
        //     const routesArray: Array<RouteDefinition> = []
        //     Reflect.set(target, "routes", routesArray)
        // }
    }
}