import express, { NextFunction, Request, Response } from "express";

import config from "./config";
import dbInit, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoute } from "./modules/user/user.routes";

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

// get single data using params

// put method of users

// Delete query

//  routes for todos table

app.post("/users/todos", async (req: Request, res: Response) => {
  const { title, description, user_id } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO toDos(title,description,user_id) VALUES ($1,$2,$3) RETURNING *
      `,
      [title, description, user_id],
    );

    console.log(result.rows[0]);

    res.status(201).json({
      success: true,
      message: "Data inserted successfully.",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM toDos
      `);
    res.status(200).json({
      success: true,
      message: "data get successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single todo
app.get("/todos/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// Update todo
app.put("/todos/:id", async (req, res) => {
  const { title, completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
      [title, completed, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id=$1 RETURNING *",
      [req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

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
