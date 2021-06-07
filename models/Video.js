import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type:String,
        required: true,
        trim: true
    },
    description: {
        type:String,
        maxLength: 100
    },
    meta: {
        views: {
            type: Number,
            default:0,
            required: true
        },
        rating: {
            type: Number,
            default:0,
            required: true
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    comments: [{  //video에 comment아이디를 저장함.
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    hashtags: [{ type: String, trim: true }],
});

const model = mongoose.model("Video", VideoSchema);
export default model;