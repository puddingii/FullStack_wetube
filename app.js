import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

const app = express();

app.set("view engine","pug");
// app.set("views" , process.cwd() + "/src/views") 라 설정하면 default값이 src안의 views로 바뀜
app.use(cookieParser());  //cookie에 유저정보를 저장함. session을 다루기위함..
app.use(express.json());  //이제는 express가 bodyParser 모듈을 내장하기 때문에 express로 대신 작성가능하다.
app.use(express.urlencoded({extended: true}));  //body로부터 정보를 얻을수있음. 파일이 어떤건지에 대한 정보를 줘야함.json html등등
app.use(morgan("dev")); //누가 접속했는지?

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false, //세션이 새로 만들어지고 수정된 적이 없을때 저장하는거.(req.session.user = user 부분이 세션을 초기화하는거임) 즉 로그인할때만 쿠키 생성
    saveUninitialized: false,   //세션이 저장되기 전에 uninitialized상태로 만드는 것.
    store:MongoStore.create({ mongoUrl: process.env.MONGO_URL}),  //세션들을 mongodb에 저장, 만약 이게 없다면 세션이 서버의 메모리에 저장
}));

app.use(localsMiddleware);  //전역변수 느낌
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter); // /user로 접속하면 /user의 router전체를 사용하겠다는 의미.
app.use(routes.videos, videoRouter);  // 이것의 경우 /videos/etc.. 가 됨.

export default app;