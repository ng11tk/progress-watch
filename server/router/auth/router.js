import { Router } from "express";
import { login, signup, verify, logout } from "./controllers.js";

const authPublicRouter = Router();
const authPrivateRouter = Router();

// Define authentication routes here
authPublicRouter.post("/login", login);
authPublicRouter.post("/signup", signup);
authPublicRouter.get("/verify", verify);
authPublicRouter.post("/logout", logout);

export { authPublicRouter, authPrivateRouter };
