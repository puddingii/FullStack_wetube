import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { localsMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

const app = express();

app.use(helmet());  //node.js에 대한 보안관련
app.set("view engine","pug");
app.use(cookieParser());  //cookie에 유저정보를 저장함. session을 다루기위함..
app.use(bodyParser.json());  //이제는 express가 bodyParser 모듈을 내장하기 때문에 express로 대신 작성가능하다.
app.use(bodyParser.urlencoded({extended: true}));  //body로부터 정보를 얻을수있음. 파일이 어떤건지에 대한 정보를 줘야함.json html등등
app.use(morgan("dev")); //누가 접속했는지?

app.use(localsMiddleware);  //전역변수 느낌

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter); // /user로 접속하면 /user의 router전체를 사용하겠다는 의미.
app.use(routes.videos, videoRouter);  // 이것의 경우 /videos/etc.. 가 됨.

export default app;