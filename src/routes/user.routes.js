import { Router } from "express";
import { loginUser, userRegister , logoutUser } from "../controllers/User.controller.js";
import { JWTVerification } from "../middleware/Auth.middleware.js";

const appRouter = Router();

appRouter.route("/register").post(userRegister);
appRouter.route("/login").post(loginUser);
appRouter.route("/logout").post(JWTVerification, logoutUser);

export { appRouter };
