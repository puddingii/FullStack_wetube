import mongoose from "mongoose";
import { localsMiddleware } from "../middlewares";

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: "Text is required"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // video: {  //comment에 비디오 정보를 저장.
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Video"
    // }
});

const model = mongoose.model("Comment",CommentSchema);
export default model;