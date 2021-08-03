import express from "express";
import { emailChk, nickChk, sendEmail } from "../controllers/userController";
import { registerView, createComment, deleteComment, updateComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id/view", registerView);
apiRouter.post("/videos/:id/comment", createComment);
apiRouter.delete("/comments/:id/delete", deleteComment);
apiRouter.post("/comments/:id/update", updateComment);
apiRouter.post("/users/nickChk", nickChk);
apiRouter.post("/users/emailChk", emailChk);
apiRouter.post("/users/sendEmail", sendEmail);

export default apiRouter;