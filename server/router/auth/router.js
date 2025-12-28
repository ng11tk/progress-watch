import { Router } from "express";
import { login, signup } from "./controllers.js";

const authPublicRouter = Router();
const authPrivateRouter = Router();

// Define authentication routes here
authPublicRouter.post("/login", login);
authPublicRouter.post("/signup", signup);

export { authPublicRouter, authPrivateRouter };
