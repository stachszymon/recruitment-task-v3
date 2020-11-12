import App from "./App";
import MovieController from "./controllers/MovieController";

const app = new App(3000);

app.initializeControllers([MovieController]);

app.run();

module.exports = app.getExpress(); //Required for tests