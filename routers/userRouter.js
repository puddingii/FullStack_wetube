import express from "express";
import { changePassword, editProfile, finishGithubLogin, postEdit, startGithubLogin, userDetail } from "../controllers/userController";
import { uploadAvatar } from "../middlewares";
import routes from "../routes";

const userRouter = express.Router();

userRouter.route(routes.editProfile).get(editProfile).post(uploadAvatar.single("avatar"), postEdit); //uploadFiles라는 middleware부터 실행한 후 postEdit 실행 uploadFiles.single은 template의 input에서 오는 avatar파일을 파일을 업로드하고 upload폴더에 저장함
userRouter.get(routes.changePassword, changePassword);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get(routes.userDetail(), userDetail);


export default userRouter;