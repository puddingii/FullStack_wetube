import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true
    },
    thumbUrl: {
        type: String,
        required: true
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"  // objectId가 model의 User에서 온다고 알려주는것과 같음.
    }
});

// VideoSchema.pre('save', async function() {  //this는 저장하고자 하는 문서를 가르킴, upload시 처리
//     this.hashtags = this.hashtags[0].split(",").map(word => (word.startsWith('#') ? word : `#${word}`));
// })

VideoSchema.static('formatHashtags', function(hashtags) {  //Video.formatHashtags를 사용할 수 있음.
    return hashtags.split(",").map(word => (word.startsWith("#") ? word : `#${word}`));
})

const model = mongoose.model("Video", VideoSchema);
export default model;