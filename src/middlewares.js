import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import routes from "./routes";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    }
});

const isHeroku = process.env.NODE_ENV === "production";

const s3ImageUploader = multerS3({
    s3,
    bucket: "puddingii-youtube/images",
    acl: "public-read" //access control list를 전달하기 위해 선언, acl은 기본적으로 object에 대한 권한임.
});

const s3VideoUploader = multerS3({
    s3,
    bucket: "puddingii-youtube/videos",
    acl: "public-read" 
});

export const localsMiddleware = (req, res, next) => {
    res.locals.routes = routes;
    res.locals.siteName = 'WeTube';  //locals는 pug에서 그냥 가져다 쓸수있게해줌
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};
    res.locals.isHeroku = isHeroku;
    res.locals.port = process.env.PORT;
    next();  //가운데에 있으닌까 next를 선언해줘야함.
};

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        next();
    } else{
        req.flash("error", "Log in first");
        return res.redirect("/login");
    }
};

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Not authorized");
        return res.redirect("/")
    }
};

export const uploadAvatar = multer({ 
    dest: "uploads/avatars/", 
    limits: {
        fileSize: 3000000, //3MB
    },
    storage: isHeroku ? s3ImageUploader : undefined
});

export const uploadVideo = multer({ 
    dest: "uploads/videos/",
    limits: {
        fileSize: 10000000,  //10MB
    },
    storage: isHeroku ? s3VideoUploader : undefined
});