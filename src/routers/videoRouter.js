import express from "express";
import routers from "../routes";
import { deleteVideo, getEditVideo, getUpload, postEditVideo, postUpload, videoDetail } from "../controllers/videoController";
import { protectorMiddleware, uploadVideo } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route(routers.upload).all(protectorMiddleware).get(getUpload).post(uploadVideo.fields([
    { name: "videoFile" }, { name: "thumbFile" }
]), postUpload);
videoRouter.get(routers.videoDetail(), videoDetail);
videoRouter.route(routers.editVideo()).all(protectorMiddleware).get(getEditVideo).post(postEditVideo);  //  /:id(\\d+) 은 숫자인 값만 가져온다는 뜻
videoRouter.get(routers.deleteVideo(), protectorMiddleware, deleteVideo);


export default videoRouter;