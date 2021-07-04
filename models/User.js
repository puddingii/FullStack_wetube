import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    nickName: {type: String, required: true, unique: true},
    avatarUrl: {type:String, default: ""},
    socialOnly: {type: Boolean, default: false},
    password: {type:String},
    name: {type:String, required: true},
    location: String,
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }]
});

userSchema.pre('save', async function() {  //this 는 create될 User를 가르킴
    if(this.isModified("password")) { //password가 바뀌면 true값을 리턴함
        this.password = await bcrypt.hash(this.password, 5);
    }
    
});

const User = mongoose.model("User", userSchema);
export default User;