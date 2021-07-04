const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_JS = "./src/client/js/";

module.exports = {
    entry: {
        main: BASE_JS + "main.js",
        videoPlayer: BASE_JS + "videoPlayer.js",
        recorder: BASE_JS + "recorder.js",
        commentSection: BASE_JS + "commentSection.js"
    },  //input같은 느낌

    plugins: [new MiniCssExtractPlugin({
        filename: "css/styles.css",
    })],
    output: {  // 나오는 결과 위치
        filename:"js/[name].js",
        path: path.resolve(__dirname, "assets"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,  
                use: {  
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", {targets: "defaults"}]],
                    }
                }
            },
            {
                test: /\.scss$/, //모든 scss파일을 css로 가공
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],  //scss(css로바꿔줌)->css->styles(css code를 브라우저에 적용) 역순으로 실행이됨. minicss는 js랑 css코드를 분리시켜줌
            },
        ]
    },
};