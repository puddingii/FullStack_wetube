import express from "express";
import { deleteVideo, editVideo, getUpload, postUpload, videoDetail } from "../controllers/videoController";
import routers from "../routes";

const videoRouter = express.Router();

videoRouter.get(routers.upload, getUpload);
videoRouter.post(routers.upload, postUpload);
videoRouter.get(routers.videoDetail(), videoDetail);
videoRouter.get(routers.editVideo, editVideo);
videoRouter.get(routers.deleteVideo, deleteVideo);

export default videoRouter;