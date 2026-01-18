import { Router } from "express";
import { createDailyNotes, getAllDailyNotes } from "./controllers.js";

const learningPrivateRouter = Router();
const learningPublicRouter = Router();

learningPrivateRouter.post("/daily-notes", createDailyNotes);
learningPrivateRouter.get("/daily-notes", getAllDailyNotes);

export { learningPrivateRouter, learningPublicRouter };
