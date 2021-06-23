const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
}

const handleStop = () => {
    startBtn.innerText = "Download Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop();
};

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream)
    recorder.ondataavailable = (event) => { // 녹화가 멈추면 발생하는 이벤트임.
        videoFile = URL.createObjectURL(event.data);
        video.srcObject = null;  // 캠으로 보여주는게 아닌 찍은걸 보여주기 위해 null로 바꿔줌. 아래의 src참조
        video.src = videoFile;
        video.play();
    };
    recorder.start();

};

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({  // navigator의 mediaDevices api를 호출
        audio: false, 
        video: { width:300, height:300 } 
    });
    video.srcObject = stream;
    video.play();
};

init();

startBtn.addEventListener("click", handleStart);