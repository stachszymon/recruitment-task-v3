import App from "./App";
import MovieController from "./controllers/MovieController";
import { readData } from "./utils/dbReader";

const app = new App(3000);

app.express.get("/", MovieController.getAll)

app.run();

(async function () {
    await readData();
})()


module.exports = app.express; //Required for tests