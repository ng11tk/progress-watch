import { Router } from "express";
import {
  createNewSession,
  getSessionsByTaskId,
  getAllSessions,
  updateSession,
} from "./controllers.js";

const sessionPublicRouter = Router();
const sessionPrivateRouter = Router();

sessionPrivateRouter.post("/session", createNewSession);
sessionPrivateRouter.get("/sessions", getAllSessions);
sessionPrivateRouter.get("/sessions/task", getSessionsByTaskId);
sessionPrivateRouter.patch("/session", updateSession);

export { sessionPublicRouter, sessionPrivateRouter };
