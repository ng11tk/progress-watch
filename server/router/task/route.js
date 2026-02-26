import { Router } from "express";
import { createNewTask, getAllTasks, updateTask } from "./controllers.js";

const taskPublicRouter = Router();
const taskPrivateRouter = Router();

taskPrivateRouter.post("/task", createNewTask);
taskPrivateRouter.patch("/task", updateTask);
taskPrivateRouter.post("/tasks", getAllTasks);

export { taskPublicRouter, taskPrivateRouter };
