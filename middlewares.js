import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = 'WeTube';
    res.locals.routes = routes;
    res.locals.user = {
        isAuthenticated: true,
        id: 1
    };
    next();  //가운데에 있으닌까 enxt를 선언해줘야함.
}