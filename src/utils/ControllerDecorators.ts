export type RouteDefinition = {
    path: string
    method: "get" | "post" | "delete" | "options" | "put"
    handler: string | symbol
}

function checkForRoutesArray(target: Object): void {
    if (!Reflect.has(target, "routes")) {
        const routesArray: Array<RouteDefinition> = []
        Reflect.set(target, "routes", routesArray)
    }
}

function methodDecorator(method: "get" | "post" | "delete" | "options" | "put", path: string) {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ): void {
        checkForRoutesArray(target);

        const routes: Array<RouteDefinition> = Reflect.get(target, "routes");

        routes.push({
            method: method,
            path,
            handler: key
        })

        Reflect.set(target, "routes", routes);
    }
}

export function Get(path: string): MethodDecorator {
    return methodDecorator('get', path)
}

export function Post(path: string): MethodDecorator {
    return methodDecorator('post', path)
}

export function Put(path: string): MethodDecorator {
    return methodDecorator('put', path)
}

export function Delete(path: string): MethodDecorator {
    return methodDecorator('delete', path)
}

export function Controller(path: string): ClassDecorator {
    return function (target: Function) {
        Reflect.set(target, "prefix", path)
        Reflect.set(target, "routes", target.prototype.routes)

        checkForRoutesArray(target);

        // if (!Reflect.has(target, "routes")) {
        //     const routesArray: Array<RouteDefinition> = []
        //     Reflect.set(target, "routes", routesArray)
        // }
    }
}