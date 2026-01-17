import { Router } from "express";
import { taskPrivateRouter } from "./task/index.js";
import { sessionPrivateRouter } from "./session/index.js";
import { learningPrivateRouter } from "./learning/index.js";
import { userPrivateRouter } from "./user/index.js";
import { authPublicRouter } from "./auth/index.js";
import protectedRoute from "../middleware/protectedRoute.js";

const serverPublicRouter = Router();
const serverPrivateRouter = Router();

// Apply authentication middleware to all private routes
serverPrivateRouter.use(protectedRoute);

serverPrivateRouter.use("/api", taskPrivateRouter);
serverPrivateRouter.use("/api", sessionPrivateRouter);
serverPrivateRouter.use("/api", learningPrivateRouter);
serverPrivateRouter.use("/api", userPrivateRouter);
serverPublicRouter.use("/auth", authPublicRouter);

export { serverPublicRouter, serverPrivateRouter };
