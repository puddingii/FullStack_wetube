import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL,   // "mongodb://127.0.0.1:27017/wetube"
    {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }
);

const db = mongoose.connection;

const handleOpen = () => console.log("Connected to DB");
const handleError = (err) => console.log(`Error on DB Connection:${err}`);

db.once("open", handleOpen);   // 딱 한번 발생.
db.on("error", handleError);   // 여러번 발생시킬 수 있음.