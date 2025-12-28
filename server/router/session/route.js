import { Router } from "express";
import { createNewSession, getSessionsByTaskId } from "./controllers.js";

const sessionPublicRouter = Router();
const sessionPrivateRouter = Router();

sessionPrivateRouter.post("/session", createNewSession);
sessionPrivateRouter.get("/sessions", getSessionsByTaskId);

export { sessionPublicRouter, sessionPrivateRouter };
