import { Router } from "express";
import {
  createNewSession,
  getSessionsByTaskId,
  getAllSessions,
} from "./controllers.js";

const sessionPublicRouter = Router();
const sessionPrivateRouter = Router();

sessionPrivateRouter.post("/session", createNewSession);
sessionPrivateRouter.get("/sessions", getAllSessions);
sessionPrivateRouter.get("/sessions/task", getSessionsByTaskId);

export { sessionPublicRouter, sessionPrivateRouter };
