import express from "express";
import { getJoin, getLogin, postJoin, postLogin } from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import { publicOnlyMiddleware } from "../middlewares";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.route(routes.join).all(publicOnlyMiddleware).get(getJoin).post(postJoin);
globalRouter.route(routes.login).all(publicOnlyMiddleware).get(getLogin).post(postLogin);

globalRouter.get(routes.home, home);   
globalRouter.get(routes.search, search); //globalRouter.get("/search", (req, res)=>res.send("search"));

export default globalRouter;