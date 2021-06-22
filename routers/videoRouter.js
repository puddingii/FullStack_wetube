import express from "express";
import routers from "../routes";
import { deleteVideo, getEditVideo, getUpload, postEditVideo, postUpload, videoDetail } from "../controllers/videoController";
import { uploadVideo } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route(routers.upload).get(getUpload).post(uploadVideo.single("videoFile"), postUpload);

videoRouter.get(routers.videoDetail(), videoDetail);

videoRouter.route(routers.editVideo()).get(getEditVideo).post(postEditVideo);  //  /:id(\\d+) 은 숫자인 값만 가져온다는 뜻

videoRouter.get(routers.deleteVideo(), deleteVideo);

export default videoRouter;