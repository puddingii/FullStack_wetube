const { default: fetch } = require("node-fetch");

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls")

let controlsTimeout = null;
let controlsMouseStop = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = () => { //HTML Media Element에 있음.
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
};

const handleMute = () => {
    if(video.muted) { // muted는 getter와 setter역할을 동시에 함
        video.muted = false;
    } else {
        video.muted = true;
    }
    volumeRange.value =video.muted ? 0 : volumeValue;
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
};

const handleVolumeChange = (event) => {
    const { target: { value } } = event;
    if(video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
};

const formatTime = (seconds) => 
    new Date(seconds * 1000).toISOString().substr(11, 8);


const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const { 
        target: {value} 
    } = event;
    video.currentTime = value;
};

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen) {
        document.exitFullscreen();
        fullScreenBtn.innerText = "Enter Full Screen";
        
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen";
    }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
    if(controlsTimeout) { // 나가고 다시 들어갈때 사라지는 것을 취소해야하기 때문에 설정.
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMouseStop) { // 마우스가 멈춰있을때
        clearTimeout(controlsMouseStop);
        controlsMouseStop = null;
    }
    videoControls.classList.add("showing");
    controlsMouseStop = setTimeout(hideControls, 3000); // 3초 뒤에 showing을 없애주지만 만약 계속 마우스를 움직인다면 초가 계속 갱신됨.
};

const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls ,3000); // 마우스가 화면 밖으로 가면 3초 후에 사라지도록 설정
};

const handleEnded = () => { //data-id에 아이디값을 줘서 dataset의 안에 있는 data-뒷부분인 id를 변수로 하고 값을 가져옴.
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, {
        method: "post"
    });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("ended", handleEnded)
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);

// 스페이스바 누르면 멈추도록 해야함