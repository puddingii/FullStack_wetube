import fetch from "node-fetch";

const nick = document.getElementById("nickName");
const email = document.getElementById("email");
const nickChk = document.getElementById("nickChk");
const emailChk = document.getElementById("emailChk");
const verifyPassChk = document.getElementById("verifyPassChk");
const verifyPass1 = document.getElementById("verifyPass1");
const verifyPass2 = document.getElementById("verifyPass2");

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
    const text = email.value;
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
            email.style = "color: black;";
        }
    }
};

const isCorrectPass = () => {
    const pass1 = verifyPass1.value;
    if (pass1.includes(" ")) {
        alert("No Spacebar");
        verifyPass1.value = "";
    }
}

const chkPassword = () => {
    const pass1 = verifyPass1.value;
    const pass2 = verifyPass2.value;

    if (pass1 !== pass2 || pass2 === "") {
        verifyPassChk.innerText = "✘";
    } else {
        verifyPassChk.innerText = "✔";
    }
}


nick.addEventListener("blur", chkNick);
email.addEventListener("blur", chkEmail);
verifyPass1.addEventListener("blur", isCorrectPass);
verifyPass2.addEventListener("blur", chkPassword);