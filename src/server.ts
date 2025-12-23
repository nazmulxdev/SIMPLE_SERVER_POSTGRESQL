import express, { Request, Response } from "express";

import { Pool } from "pg";

import "dotenv/config";

const app = express();

const port = process.env.PORT || 5000;

// body parser

// to read json type data
app.use(express.json());

// to read form data
app.use(express.urlencoded());

// DB connection pool
const pool = new Pool({
  connectionString: `${process.env.POSTGRESQL}`,
});

// creating table

const dbInit = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR (150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR (15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

  await pool.query(`
            CREATE TABLE IF NOT EXISTS toDos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE ,
            title VARCHAR (200) NOT NULL,
            description TEXT ,
            completed BOOLEAN DEFAULT false ,
            due_date DATE ,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()

            )
            `);
};

// INITIAL DB

dbInit();

// routes

app.get("/", (req: Request, res: Response) => {
  res.send("Hello , Next level developers.");
});

app.post("/user", (req: Request, res: Response) => {
  console.log("this is post route.");
  console.log(req.body);

  res.status(200).json({
    message: "data posted successfully.",
    success: true,
  });
});

app.listen(port, () => {
  console.log("server is running on the port :", port);
});
