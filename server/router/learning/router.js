import { Router } from "express";
import { createDailyNotes } from "./controllers.js";

const learningPrivateRouter = Router();
const learningPublicRouter = Router();

learningPrivateRouter.post("/daily-notes", createDailyNotes);

export { learningPrivateRouter, learningPublicRouter };
