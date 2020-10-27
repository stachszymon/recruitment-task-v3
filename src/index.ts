import App from "./App";
import MovieController from "./controllers/MovieController";

const app = new App(3000);

app.express.get("/", MovieController.getAll)

app.run();

module.exports = app.express; //Required for tests