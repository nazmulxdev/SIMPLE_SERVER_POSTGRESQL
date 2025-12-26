import express, { Request, Response } from "express";
import dbInit from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { todosRoutes } from "./modules/todos/todos.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();

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

app.use("/users", userRoutes);

//  routes for todos table

app.use("/todos", todosRoutes);

// auth routes

app.use("/auth", authRoutes);

// not found route

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
    path: req.path,
  });
});

export default app;
