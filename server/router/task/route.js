import { Router } from "express";
import { createNewTask, getAllTasks } from "./controllers.js";

const taskPublicRouter = Router();
const taskPrivateRouter = Router();

taskPrivateRouter.post("/task", createNewTask);
taskPrivateRouter.post("/tasks", getAllTasks);

export { taskPublicRouter, taskPrivateRouter };
