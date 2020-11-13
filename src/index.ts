import App from "./App";
import MovieController from "./controllers/MovieController";

const app = new App(3030);

app.initializeControllers([MovieController]);

app.run();

export default app.getExpress(); //Required for tests