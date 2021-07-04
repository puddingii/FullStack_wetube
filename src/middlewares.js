import multer from "multer";
import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
    res.locals.routes = routes;
    res.locals.siteName = 'WeTube';  //locals는 pug에서 그냥 가져다 쓸수있게해줌
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.loggedInUser = req.session.user || {};

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
    } 
});

export const uploadVideo = multer({ 
    dest: "uploads/videos/",
    limits: {
        fileSize: 100000000,  //100MB
    } 
});