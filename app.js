import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {userRouter} from "./router";
//const express = require('express');  //express server
const app = express();

//const PORT = 4000;
//const handleListening = () => console.log(`Listening on: http://localhost:${PORT}`)
const handleHome = (req, res) => res.send('hello from home'); //request object, response object

const handleProfile = (req, res) => res.send("You are on my profile");  //arrow function

// const betweenHome = (req, res, next) => {  //next대신 res를 사용한다면 홈으로 가는걸 막을수도있음
//     console.log("Between");
//     next();
// }
// app.use(betweenHome);  //middleware  home으로 접속하기전에 betweenHome을 실행시켜줌.
app.use(cookieParser());  //cookie에 유저정보를 저장함. session을 다루기위함..
app.use(bodyParser.json());  //이제는 express가 bodyParser 모듈을 내장하기 때문에 express로 대신 작성가능하다.
app.use(bodyParser.urlencoded({extended: true}));  //body로부터 정보를 얻을수있음. 파일이 어떤건지에 대한 정보를 줘야함.json html등등
app.use(helmet());  //node.js에 대한 보안관련
app.use(morgan("dev")); //누가 접속했는지?

app.get("/", handleHome);  //main으로 접속했을때

app.get("/profile", handleProfile);

app.use("/user", userRouter); // /user로 접속하면 router전체를 사용하겠다는 의미.
//  /user/edit /user/password  이런식으로 라우팅됨.
//app.listen(PORT, handleListening);  //4000port로 서버를 열고. 콜백함수를 줌.

export default app;