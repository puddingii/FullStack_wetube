const videoFile = document.getElementById("videoFile");
const thumbFile = document.getElementById("thumbFile");

const checkVideoSize = () => {
    const file = videoFile.files[0];  //10000000 = 10mb
    if( file.size > 10000000) {
        alert("Video size is too big.(<10MB)");
        videoFile.value = "";
    }
};

const checkImageSize = () => {
    const file = thumbFile.files[0];  //3000000 = 3mb
    if( file.size > 3000000) {
        alert("Image size is too big.(<3MB)");
        thumbFile.value = "";
    }
};

videoFile.addEventListener("change", checkVideoSize);
thumbFile.addEventListener("change", checkImageSize);