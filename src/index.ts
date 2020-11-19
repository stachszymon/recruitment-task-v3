import App from "./App";
import MovieController from "./controllers/MovieController";

const app = new App(3030);

app.initializeControllers([MovieController]);

app.run();

const express = app.getExpress();

export default express; //Required for tests