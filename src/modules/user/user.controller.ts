import { Request, Response } from "express";

import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, age, address, phone } = req.body;
  try {
    const result = await userServices.createUser(
      name,
      email,
      age,
      address,
      phone,
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
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUsers();
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

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userServices.getUserById(id);

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
};

const editUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  //   const { name, email, age, address, phone } = req.body;
  try {
    const result = await userServices.dynamicChangeUser(id, req.body);

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
};

const deleteUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const result = await userServices.deleteUser(id);

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
};

export const userControllers = {
  createUser,
  getAllUsers,
  getUserById,
  editUser,
  deleteUser,
};
