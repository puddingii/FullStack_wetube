import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"  // objectId가 model의 User에서 온다고 알려주는것과 같음.
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Video"
    }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;