import fetch from "node-fetch";
import bcrypt from "bcrypt";
import User from "../models/User";

export const getJoin = (req, res) => {
    res.render("join", {pageTitle:"Join"});
};

export const postJoin = async (req,res) => {
    const {name, username, email, password, password2, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: "Password confirmation does not match."
        });
    }
    
    const exists = await User.exists({ $or: [ { username }, { email } ] });  //email이나 username둘중 하나라도 있으면 exists는 True
    if (exists) {
        return res.status(400).render("join", {  //상태 코드 400을 가지고 render를 하게됨.
            pageTitle,
            errorMessage: "This username/email is already taken."
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location
        });
        return res.redirect("/login");
    } catch(error) {
        return res.status(400).render("join", { 
            pageTitle, 
            errorMessage: error._message
        });
    }
};

export const getLogin = (req, res) => res.render("login", {pageTitle:"Login"});
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne( { username });
    if(!user) {    //check if account exists
        return res.status(400).render("login", { 
            pageTitle, 
            errorMessage: "An account with this username does not exist."
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
    req.session.loggedIn = false; 
    req.session.user = "";
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup:false,
        scope:"read:user user:email"
    }
    const params = new URLSearchParams(config).toString()
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
        console.log(userData);
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
            return res.redirect("/login");
        }
        const existingUser = await User.findOne( { email: emailObj.email });
        if(existingUser) {
            req.session.loggedIn = true;
            req.session.user = existingUser;
            return res.redirect("/");
        } else { // 없을 경우 계정생성

        }
    } else { //access token이 없을 경우
        return res.redirect("/login");
    }
};

export const userDetail = (req, res) => res.render("userDetail", {pageTitle:"User Detail"});
export const editProfile = (req, res) => res.render("editProfile", {pageTitle:"Edit Profile"});
export const postEdit = (req, res) => {};
export const changePassword = (req, res) => res.render("changePassword", {pageTitle:"Change Password"});