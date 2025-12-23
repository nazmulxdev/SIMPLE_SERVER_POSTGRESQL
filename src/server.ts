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

// users crud

// post method
app.post("/user", async (req: Request, res: Response) => {
  const { name, email, age, address, phone } = req.body;
  try {
    const result = await pool.query(
      `
        INSERT INTO users(name,email,age,address,phone) VALUES($1,$2,$3,$4,$5) RETURNING *
        `,
      [name, email, age, address, phone],
    );

    console.log(result.rows[0]);

    res.status(200).json({
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

// get method
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
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

// get single data using params

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User get successfully.",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// put method of users

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, address, phone } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE users 
      SET  
      name=$1, 
      email=$2 
      WHERE id=$3 RETURNING *
      `,
      [name, email, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data update failed.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Data updated successfully.",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete query

app.delete("/users/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `
      DELETE FROM users WHERE id=$1
        `,
      [id],
    );

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully.",
        data: null,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log("server is running on the port :", port);
});
