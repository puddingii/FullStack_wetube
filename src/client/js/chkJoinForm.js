import fetch from "node-fetch";

const nick = document.getElementById("nickName");
const email = document.getElementById("email");
const nickChk = document.getElementById("nickChk");
const emailChk = document.getElementById("emailChk");
const verifyPassChk = document.getElementById("verifyPassChk");
const verifyPass1 = document.getElementById("verifyPass1");
const verifyPass2 = document.getElementById("verifyPass2");
const sendEmailBtn = document.getElementById("btnEmail");
const emailCode = document.getElementById("emailCode");
const verifyCodeBtn = document.getElementById("verifyCode");
const finalSubmit = document.getElementById("finalSubmit");

let generateCode;

const chkAll = () => {
    if(nickChk.innerText !== "✔" || emailChk.innerText !== "✔" || verifyCodeBtn.innerText !== "✔" || verifyPassChk.innerText !== "✔") {
        finalSubmit.disabled = true;
    } else {
        finalSubmit.disabled = false;
    }
};

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
            finalSubmit.disabled = true;
        } else {
            nickChk.innerText = "✔";
            nick.style = "color: black;"
            chkAll();
        }
    }
};

const chkEmail = async () => {
    const text = email.value;
    if(text === "") {
        emailChk.innerText = "✘";
        finalSubmit.disabled = true;
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
            finalSubmit.disabled = true;
        } else {
            emailChk.innerText = "✔";
            email.style = "color: black;";
            chkAll();
        }
    }
};

const isCorrectPass = () => {
    const pass1 = verifyPass1.value;
    if (pass1.includes(" ")) {
        alert("No Spacebar");
        verifyPass1.value = "";
    }
};

const chkPassword = () => {
    const pass1 = verifyPass1.value;
    const pass2 = verifyPass2.value;
    
    if (pass1 !== pass2 || pass2 === "") {
        verifyPassChk.innerText = "✘";
        finalSubmit.disabled = true;
    } else {
        verifyPassChk.innerText = "✔";
        chkAll();
    }
};

const emailSend = async() => {
    const toEmail = email.value;
    if(emailChk.innerText === "✔") {
        const randomCode = Math.floor(Math.random()*900000)+100000;
        generateCode = randomCode;
        const response = await fetch("/api/users/sendEmail", {
            method: "post",
            headers: {  
                "Content-type": "application/json"
            },
            body: JSON.stringify({ toEmail, randomCode })
        });
        if(response === 400) {
            alert("Error");  //alert는 나중에 다른 알람시스템으로 변경.
        } else {
            alert("Success");
        }
    } else {
        alert("Check your email.");
    }
};

const emailCodeChk = () => {
    const code = emailCode.value;
    if(code === String(generateCode)) {
        email.readOnly = true;  // disabled를 사용하면 form을 제출할때 읽지 못함.
        emailCode.readOnly = true;
        verifyCodeBtn.classList.add("disabled");
        verifyCodeBtn.removeEventListener("click", emailCodeChk);
        verifyCodeBtn.innerText = "✔";
        sendEmailBtn.classList.add("disabled");
        sendEmailBtn.removeEventListener("click", emailSend);
        chkAll();
    } else {
        alert("Check your code.");
    }
    
};

nick.addEventListener("blur", chkNick);
email.addEventListener("blur", chkEmail);
verifyPass1.addEventListener("blur", isCorrectPass);
verifyPass2.addEventListener("blur", chkPassword);
sendEmailBtn.addEventListener("click", emailSend);
verifyCodeBtn.addEventListener("click", emailCodeChk);
