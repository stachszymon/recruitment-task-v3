import App from "./App";
import MovieController from "./controllers/MovieController";

const app = new App(3030);

app.initializeControllers([MovieController]);

app.run();

const express = app.getExpress();

express._router.stack.forEach(function (r) {
    if (r.route && r.route.path) {
        console.log(r.route.path)
    }
})

export default express; //Required for tests