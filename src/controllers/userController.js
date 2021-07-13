import fetch from "node-fetch";
import bcrypt from "bcrypt";
import User from "../models/User";
import Video from "../models/Video";
import { async } from "regenerator-runtime"; //프론트엔드에서 async를 사용하려면 regenerator Runtime을 사용해야함.

export const getJoin = (req, res) => {
    res.render("join", {pageTitle:"Join"});
};

export const postJoin = async (req,res) => {
    const {name, nickName, email, password, password2, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match."
        });
    }

    const exists = await User.exists({ $or: [ { nickName }, { email } ] });  //email이나 nickName둘중 하나라도 있으면 exists는 True
    if (exists) {
        return res.status(400).render("join", {  //상태 코드 400을 가지고 render를 하게됨.
            pageTitle,
            errorMessage: "This nickName/email is already taken."
        });
    }
    try {
        await User.create({
            nickName,
            email,
            name,
            password,
            location,
        });
        return res.redirect("/login");
    } catch(error) {
        return res.status(400).render("join", { 
            pageTitle, 
            errorMessage: "DB Error"
        });
    }
};

export const getLogin = (req, res) => res.render("login", {pageTitle:"Login"});
export const postLogin = async (req, res) => {
    const { nickName, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne( { nickName, socialOnly: false });
    if(!user) {    //check if account exists
        return res.status(400).render("login", { 
            pageTitle, 
            errorMessage: "An account with this nickName does not exist."
        });
    }
    //check if password correct
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) {
        return res.status(400).render("login", { 
            pageTitle, 
            errorMessage: "Wrong password"
        });
    }
    req.session.loggedIn = true;    //세션에 정보추가
    req.session.user = user;
    
    return res.redirect("/");
};

export const handleLogout = (req, res) => {
    req.session.user = null;
    req.session.loggedIn = false;
    req.flash("info", "Bye Bye");
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup:false,
        scope:"read:user user:email"
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code   // 확인을 누르면 github에서 code를 줌.
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await(    //해당 code를 가지고 access token을 가져옴.
        await fetch(finalUrl, {
            method:"POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();
    if ("access_token" in tokenRequest) {  // 가져온 access token을 가지고 github api를 이용해 user정보를 가져옴 
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await ( 
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj) {
            // 알람 추가해야함
            return res.redirect("/login");
        }
        let user = await User.findOne( { email: emailObj.email });
        if(!user) { //이메일 있는경우 해당 이메일로 로그인
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name? userData.name : "Unknown",
                socialOnly: true,
                nickName: userData.login,
                email: emailObj.email,
                password: "",
                location: userData.location
            });
        } 
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else { //access token이 없을 경우
        return res.redirect("/login");
    }
};

export const userDetail = async(req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");
    if(!user){

        return res.status(404).render("404", { pageTitle: "User not found" });
    }
    return res.render("userDetail", {
        pageTitle:`${user.name}'s Profile`, 
        user,
    });
};

export const getEdit = (req, res) => {
    res.render("editProfile", { pageTitle:"Edit Profile" });
};

export const postEdit = async(req, res) => {
    const { 
        session: {
            user: { _id, avatarUrl },
        },
        body: { name, email, nickName, location },
        file
    } = req;
    const current = await User.findById(_id);
    const nickChk = await User.findOne({ nickName });
    const emailChk = await User.findOne({ email });
    const isHeroku = process.env.NODE_ENV === "production";

    if(current.name !== nickChk.name && nickChk._id !== _id) {
        return res.render("editProfile", { pageTitle:"Edit Profile", message: "Nickname is duplicated."});
    } else if(current.email !== nickChk.email && emailChk._id !== _id) {
        return res.render("editProfile", { pageTitle:"Edit Profile", message: "Email is duplicated."});
    }
    const updatedUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? (isHeroku ? file.location : file.path ) : avatarUrl,
        name, email, nickName, location
    }, { new: true }); //업데이트 된 내용을 반환하기 위한 new
    
    req.session.user = updatedUser;  //db.만 업데이트하고 session은 업데이트된 상태가 아니므로 해줘야함.
    return res.render("editProfile", { pageTitle:"Edit Profile", message: "Success"});
};

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true) {
        req.flash("error", "Can't change password");
        return res.redirect("/");
    }
    return res.render("changePassword", { pageTitle:"Change Password" })
};

export const postChangePassword = async(req, res) => {
    const { 
        session: {
            user: { _id },
        },
        body: { oldPassword, newPassword, newPassword1 },
    } = req;
    const user = User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password); //새로 해싱되지 않는 비번과 기존의 해싱된 비번을 비교해줌.

    if(!ok) {
        return res.status(400).render("changePassword", { 
            pageTitle:"Change Password", 
            message:"The current password is incorrect" 
        });
    }
    if(newPassword !== newPassword1) {
        return res.status(400).render("changePassword", { 
            pageTitle:"Change Password", 
            message:"The password does not match the confirmation" 
        });
    }
    
    user.password = newPassword;
    await user.save();
    req.flash("info", "Password updated");
    return res.redirect("/users/logout")
};