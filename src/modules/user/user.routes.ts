import express from "express";

import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", userControllers.createUser);

router.get("/", auth("admin"), userControllers.getAllUsers);

router.get("/:id", userControllers.getUserById);

router.put("/:id", userControllers.editUser);

router.delete("/:id", userControllers.deleteUser);

export const userRoutes = router;
