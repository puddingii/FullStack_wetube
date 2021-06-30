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
});

userSchema.pre('save', async function() {  //this 는 create될 User를 가르킴
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;