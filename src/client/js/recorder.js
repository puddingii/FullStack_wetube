import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumbnail: "thumbnail.jpg"
};

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}

const handleDownload = async () => {
    startBtn.removeEventListener("click", handleDownload);
    startBtn.innerText = "Transcoding...";
    startBtn.disabled = true;

    const ffmpeg = createFFmpeg({ log: true }); //뭔일이 일어나는지 콘솔에서 확인가능.
    await ffmpeg.load();  // 사용자가 sw를 사용할 것이기 때문에 사용함. 즉 js가 아닌 다른 코드를 사용하기 위함.

    ffmpeg.FS("writeFile", files.input , await fetchFile(videoFile));  //가상컴퓨터에 파일 생성(FS는 파일시스템 약자)
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);  //ffmpeg의 명령어를 실행하는 역할을 함. webm파일을 가지고 mp4로 만드는 역할을 함. 60프레임
    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumbnail); // frames:v를 사용해 스크린샷 한 장을 찍음. ss는 이동하는 역할.
    
    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumbnail);
    const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });
    const mp4Url = URL.createObjectURL(mp4Blob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4")
    downloadFile(thumbUrl, "MyThumbnail.mp4")

    ffmpeg.FS("unlink", files.input);
    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumbnail);

    URL.revokeObjectURL(videoFile);
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);

    startBtn.disabled = false;
    startBtn.disabled = "Record Again";
    startBtn.addEventListener("click", handleDownload);
};

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

    recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
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