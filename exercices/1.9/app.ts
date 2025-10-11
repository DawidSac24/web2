import express from "express";

import usersRouter from "./routes/users";
import pizzaRouter from "./routes/pizzas";
import textRouter from "./routes/texts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", usersRouter);
app.use("/pizzas", pizzaRouter);
app.use("/texts", textRouter);

export default app;
