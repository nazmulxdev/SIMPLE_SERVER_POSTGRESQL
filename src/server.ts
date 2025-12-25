import express, { Request, Response } from "express";

import config from "./config";
import dbInit from "./config/db";
import logger from "./middleware/logger";
import { userRoute } from "./modules/user/user.routes";
import { todosRouter } from "./modules/todos/todos.routes";

const app = express();

const port = config.port || 5000;

// body parser

// to read json type data
app.use(express.json());

// to read form data
app.use(express.urlencoded());

// INITIALIZING DB

dbInit();

// routes

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello , Next level developers.");
});

// users crud

// post method

app.use("/users", userRoute);

//  routes for todos table

app.use("/todos", todosRouter);

// not found route

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
    path: req.path,
  });
});
app.listen(port, () => {
  console.log("server is running on the port :", port);
});
