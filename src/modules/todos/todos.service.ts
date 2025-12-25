import { pool } from "../../config/db";

const postToDos = async (
  title: string,
  description: string,
  user_id: string | undefined,
) => {
  const result = await pool.query(
    `
          INSERT INTO toDos(title,description,user_id) VALUES ($1,$2,$3) RETURNING *
          `,
    [title, description, user_id],
  );

  return result;
};

const getAllTodos = async () => {
  const result = await pool.query(`
      SELECT * FROM toDos
      `);

  return result;
};

const getTodosById = async (id: string | undefined) => {
  const result = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
  return result;
};

const updateTodos = async (
  title: string,
  completed: boolean,
  id: string | undefined,
) => {
  const result = await pool.query(
    "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
    [title, completed, id],
  );

  return result;
};

const deleteTodos = async (id: string | undefined) => {
  const result = await pool.query("DELETE FROM todos WHERE id=$1 RETURNING *", [
    id,
  ]);

  return result;
};

export const todoServices = {
  postToDos,
  getAllTodos,
  getTodosById,
  updateTodos,
  deleteTodos,
};
