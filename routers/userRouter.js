import express from "express";
import { changePassword, editProfile, userDetail, logout } from "../controllers/userController";
import routes from "../routes";

const userRouter = express.Router();

userRouter.get(routes.editProfile, editProfile);
userRouter.get(routes.changePassword, changePassword);
userRouter.get(routes.userDetail(), userDetail);
userRouter.get(routes.logout, logout);

export default userRouter;