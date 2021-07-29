import fetch from "node-fetch";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const editBtn = document.querySelectorAll("#editComment");
const deleteBtn = document.querySelectorAll("#deleteComment");
const videoComments = document.querySelector(".video__comments ul");
const commentNumber = document.querySelector(".video__comment-number");
const herokuBtn = document.getElementById("herokuBtn");

const handleDelete = async(event) => {
    const li = event.target.parentElement.parentElement;
    const commentId = li.dataset.id;
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: "delete",
    });
    if(response.status === 200) {
        videoComments.removeChild(li);
        commentNumber.innerText = `${parseInt(commentNumber.innerText, 10) - 1}`
    }
};

const handleEditSubmit = async (event) => {
    const li = event.target.parentElement.parentElement;
    const textarea = li.querySelector("textarea");
    const text = textarea.value;
    const span = document.createElement("span");
    const editEmoji = li.querySelector("#editComment");
    const commentId = li.dataset.id;
    span.id = "textValue";
    span.innerText = text;
    const response = await fetch(`/api/comments/${commentId}/update`, {
        method: "post",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ text })
    });
    // 아직 마무리못함.
    if( response.status === 200) {
        li.replaceChild(span, textarea);
        editEmoji.innerText = "📄";
        editEmoji.addEventListener("click", handleEdit);
        editEmoji.removeEventListener("click", handleEditSubmit);
    }
};

const handleEdit = (event) => {
    const textarea = document.createElement("textarea");
    const li = event.target.parentElement.parentElement;
    const text = li.querySelector("#textValue");
    const editEmoji = li.querySelector("#editComment");
    textarea.cols = "30";
    textarea.rows = "2";
    textarea.placeholder = "Comment";
    textarea.wrap = "hard";
    textarea.innerText = text.innerText;
    li.replaceChild(textarea, text);
    editEmoji.innerText = "✔️";
    editEmoji.removeEventListener("click", handleEdit);
    editEmoji.addEventListener("click", handleEditSubmit);
};

const addComment = (text, id, user) => {
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    
    const div = document.createElement("div");
    div.className = "commentOwnerInfo";

    const a = document.createElement("a");
    a.href=`/users/${user._id}`;

    const img = document.createElement("img");
    img.className = "rounded-circle";
    if(!herokuBtn) {
        img.src = `/${user.avatarUrl}`;
    } else {
        img.src = user.avatarUrl;
    }
    img.width = "32";
    img.height = "32";

    const span = document.createElement("span");
    span.innerText = text;
    span.id = "textValue";
    const span1 = document.createElement("span");
    span1.innerText = "📄";
    span1.id = "editComment";
    span1.addEventListener("click", handleEdit);
    const span2 = document.createElement("span");
    span2.innerText = "❌";
    span2.id = "deleteComment";
    span2.addEventListener("click", handleDelete);
    const nick = document.createElement("span");
    nick.innerText = user.nickName;
    const hr = document.createElement("hr");
    const br = document.createElement("br");
    a.appendChild(img);
    a.appendChild(nick);
    div.appendChild(a);
    div.appendChild(span1);   
    div.appendChild(span2);    
    newComment.appendChild(div);
    newComment.appendChild(br);
    newComment.appendChild(span);
    newComment.appendChild(hr);

    videoComments.prepend(newComment);  //append는 뒤에 달고 prepend는 앞에
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if(text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method:"post",
        headers: {  //실제로 json형식인 string으로 받지만 결국 string임으로 express.json()이 인식을 못함. 그것을 해결하기 위해 이런식으로 content-type을 지정해줌. 즉 간단히 말하면 backend에 json을 보내준다고 알려줘야함.
            "Content-type": "application/json"
        },
        body: JSON.stringify({ text })
    });
    textarea.value = "";
    
    if(response.status === 201) {
        const { newCommentId, user } = await response.json(); //response를 json형식으로 받기위해 적음. 받는 이유가 response의 json을 추출하기 위함임. json에는 컨트롤러에서 보내준 id값이 들어가 있음
        addComment(text, newCommentId, user);
        commentNumber.innerText = `${parseInt(commentNumber.innerText, 10) + 1}`
    }
    
};

if(form) {
    form.addEventListener("submit", handleSubmit);
}
if(deleteBtn) {
    deleteBtn.forEach((btn) => {
        btn.addEventListener("click", handleDelete);
    });
}
if(editBtn) {
    editBtn.forEach((btn) => {
        btn.addEventListener("click", handleEdit);
    });
}

