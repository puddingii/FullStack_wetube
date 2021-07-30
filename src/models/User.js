import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true}, // 핵심 unique
    nickName: {type: String, required: true, unique: true}, // 부가적 unique
    avatarUrl: {type:String, default: ""},
    socialOnly: {type: Boolean, default: false},
    password: {type:String},
    name: {type:String, required: true},
    location: {type:String, default: ""},
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref:"Comment"
    }]
});

userSchema.pre('save', async function() {  //this 는 create될 User를 가르킴
    if(this.isModified("password")) { //password가 바뀌면 true값을 리턴함
        this.password = await bcrypt.hash(this.password, 5);
    }
    
});

const User = mongoose.model("User", userSchema);
export default User;