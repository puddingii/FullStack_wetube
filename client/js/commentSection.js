import fetch from "node-fetch";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll("#deleteComment");
const videoComments = document.querySelector(".video__comments ul");
const commentNumber = document.querySelector(".video__comment-number");

const addComment = (text, id) => {
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = `  ${text}`;
    const span2 = document.createElement("span");
    span2.innerText = "❌";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
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
        const { newCommentId } = await response.json(); //response를 json형식으로 받기위해 적음. 받는 이유가 response의 json을 추출하기 위함임. json에는 컨트롤러에서 보내준 id값이 들어가 있음
        addComment(text, newCommentId);
        commentNumber.innerText = `${parseInt(commentNumber.innerText, 10) + 1} comments`
    }
    
};

const handleDelete = async(event) => {
    const li = event.target.parentElement;
    const commentId = li.dataset.id;
    console.log(li, commentId);
    const response = await fetch(`/api/comments/${commentId}/delete`, {
        method: "delete",
    });
    if(response.status === 200) {
        videoComments.removeChild(li);
        commentNumber.innerText = `${parseInt(commentNumber.innerText, 10) - 1} comments`
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