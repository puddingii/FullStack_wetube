import multer from "multer";
import routes from "./routes";

const multerVideo = multer({dest: "uploads/videos/"});

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = 'WeTube';
    res.locals.routes = routes;
    res.locals.user = {
        isAuthenticated: true,
        id: 1
    };
    next();  //가운데에 있으닌까 enxt를 선언해줘야함.
}

export const uploadVideo = multerVideo.single("videoFile");