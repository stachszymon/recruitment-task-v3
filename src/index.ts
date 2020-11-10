import App from "./App";
import MovieController from "./controllers/MovieController";
import db from "./utils/db";

const app = new App(3000);

app.initializeControllers([MovieController]);

app.run();

module.exports = app.getExpress(); //Required for tests

setTimeout(() => {
    db.delete('movies', { id: 146 })
}, 1000)