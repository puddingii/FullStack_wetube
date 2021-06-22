import express from "express";
import { getJoin, getLogin, handleLogout, postJoin, postLogin } from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, postJoin);

globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);

globalRouter.get(routes.home, home);   
globalRouter.get(routes.search, search); //globalRouter.get("/search", (req, res)=>res.send("search"));

globalRouter.get('/logout', handleLogout);

export default globalRouter;