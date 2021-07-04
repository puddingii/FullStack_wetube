import express from "express";
import { registerView, createComment, deleteComment } from "../controllers/videoController";

const apiRouter = express.Router();

apiRouter.post("/videos/:id/view", registerView);
apiRouter.post("/videos/:id/comment", createComment);
apiRouter.delete("/comments/:id/delete", deleteComment);

export default apiRouter;