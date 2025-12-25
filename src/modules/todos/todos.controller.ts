import { Request, Response } from "express";
import { todoServices } from "./todos.service";

const postTodos = async (req: Request, res: Response) => {
  const { title, description, user_id } = req.body;

  try {
    const result = await todoServices.postToDos(title, description, user_id);

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
};

const getAllTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getAllTodos();
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
};

const getTodosById = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.getTodosById(req.params.id);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
};

const updateTodos = async (req: Request, res: Response) => {
  const { title, completed } = req.body;

  try {
    const result = await todoServices.updateTodos(
      title,
      completed,
      req.params.id,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

const deleteTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.deleteTodos(req.params.id);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};

export const todosController = {
  postTodos,
  getAllTodos,
  getTodosById,
  updateTodos,
  deleteTodos,
};
