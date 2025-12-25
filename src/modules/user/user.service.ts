import { pool } from "../../config/db";

interface user {
  name?: string;
  email?: string;
  age?: number;
  phone?: string;
  address?: string;
  updated_at: Date;
}

const createUser = async (
  name: string,
  email: string,
  age: number,
  address: string,
  phone: string,
) => {
  const result = await pool.query(
    `
            INSERT INTO users(name,email,age,address,phone) VALUES($1,$2,$3,$4,$5) RETURNING *
            `,
    [name, email, age, address, phone],
  );

  return result;
};

const getAllUsers = async () => {
  const result = await pool.query(`
      SELECT * FROM users
      `);

  return result;
};

const getUserById = async (id: string | undefined) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id=$1
      `,
    [id],
  );

  return result;
};

const editUser = async (
  name: string,
  email: string,
  id: string | undefined,
) => {
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

  return result;
};

const dynamicChangeUser = async (id: string | undefined, editData: user) => {
  const keys = Object.keys(editData);
  if (keys.length === 0) {
    throw new Error("No data provided to update.");
  }

  const setKeysIndex = keys
    .map((key, index) => `${key}=$${index + 1}`)
    .join(", ");

  const values = Object.values(editData);

  const result = await pool.query(
    `
    UPDATE users 
    SET ${setKeysIndex}
    WHERE id=$${keys.length + 1}
    RETURNING *
    `,
    [...values, id],
  );

  return result;
};

const deleteUser = async (id: string | undefined) => {
  const result = await pool.query(
    `
      DELETE FROM users WHERE id=$1
        `,
    [id],
  );

  return result;
};

export const userServices = {
  createUser,
  getAllUsers,
  getUserById,
  editUser,
  dynamicChangeUser,
  deleteUser,
};
