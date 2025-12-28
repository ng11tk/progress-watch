import { Router } from "express";
import { deleteUser, userByEmail } from "./controllers.js";

const userPublicRouter = Router();
const userPrivateRouter = Router();

// Define user routes here
userPrivateRouter.post("/user", userByEmail);
userPrivateRouter.delete("/user", deleteUser);

export { userPublicRouter, userPrivateRouter };
