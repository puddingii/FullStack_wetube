import fetch from "node-fetch";

const nick = document.getElementById("nickName");
const email = document.getElementById("email");
const nickChk = document.getElementById("nickChk");
const emailChk = document.getElementById("emailChk");

const chkNick = async () => {
    const text = nick.value;
    if(text === "") {
        nickChk.innerText = "✘";
        return;
    }
    const response = await fetch("/api/users/nickChk", {
        method: "post",
        headers: {  
            "Content-type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    if(response.status === 201) {
        const { check } = await response.json();
        if(String(check) === "true") {
            nickChk.innerText = "✘";
            nick.style = "color: #d63031;"
        } else {
            nickChk.innerText = "✔";
            nick.style = "color: black;"
        }
    }
};

const chkEmail = async () => {
    const text = nick.value;
    if(text === "") {
        emailChk.innerText = "✘";
        return;
    }
    const response = await fetch("/api/users/emailChk", {
        method: "post",
        headers: {  
            "Content-type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    if(response.status === 201) {
        const { check } = await response.json();
        if(String(check) === "true") {
            emailChk.innerText = "✘";
            email.style = "color: #d63031;"
        } else {
            emailChk.innerText = "✔";
            email.style = "color: black;"
        }
    }
};

nick.addEventListener("blur", chkNick);
email.addEventListener("blur", chkEmail);