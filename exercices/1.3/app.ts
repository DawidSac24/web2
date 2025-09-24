import express from "express";

import usersRouter from "./routes/users";
import pizzaRouter from "./routes/pizzas";
import movieRouter from "./routes/movies";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let getReqCounter = 0;

app.use((_req, _res, next) => {
    if (_req.method == 'GET') {
        getReqCounter++;
    }
    console.log("GET counter : " + getReqCounter);
    next();
});

app.use("/users", usersRouter);
app.use("/pizzas", pizzaRouter);
app.use("/movies", movieRouter);

export default app;
