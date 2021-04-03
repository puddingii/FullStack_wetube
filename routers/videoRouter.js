import express from "express";
import { deleteVideo, editVideo, upload, videoDetail, videos } from "../controllers/videoController";
import routers from "../routes";

const videoRouter = express.Router();

videoRouter.get(routers.upload, upload);
videoRouter.get(routers.videoDetail, videoDetail);
videoRouter.get(routers.editVideo, editVideo);
videoRouter.get(routers.deleteVideo, deleteVideo);

export default videoRouter;