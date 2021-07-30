import express from "express";
import { getEdit, finishGithubLogin, handleLogout, postEdit, startGithubLogin, userDetail, getChangePassword, postChangePassword, postSocialDuplicated, getSocialDuplicated } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, uploadAvatar } from "../middlewares";
import routes from "../routes";

const userRouter = express.Router();

userRouter.route("/editProfile").all(protectorMiddleware).get(getEdit).post(uploadAvatar.single("avatar"), postEdit); //uploadFiles라는 middleware부터 실행한 후 postEdit 실행 uploadFiles.single은 template의 input에서 오는 avatar파일을 파일을 업로드하고 upload폴더에 저장함
userRouter.get('/logout', protectorMiddleware, handleLogout);
userRouter.route(routes.changePassword).get(getChangePassword).post(postChangePassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/socialDuplicated").all(publicOnlyMiddleware).get(getSocialDuplicated).post(postSocialDuplicated);
userRouter.get(routes.userDetail(), userDetail);


export default userRouter;