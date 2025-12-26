import { Router } from "express";
import { todosController } from "./todos.controller";

const router = Router();

router.post("/", todosController.postTodos);

router.get("/", todosController.getAllTodos);

router.get("/:id", todosController.getTodosById);

router.put("/:id", todosController.updateTodos);

router.delete("/:id", todosController.deleteTodos);

export const todosRoutes = router;
