import routes from "../routes";  //default export할 때는 {}를 사용하지않음
import Video from "../models/Video";

export const home = async(req, res) => {
    try {
        const videos = await Video.find({}).sort({_id: -1});
        res.render("home", {pageTitle:"Home", videos});
    } catch(error) {
        console.log(error);
        res.render("home", {pageTitle:"Home", videos:[]});
    }
    
};
export const search = async(req, res) => {
    const {query: {term: searchingBy}} = req;  //const searchingBy = req.query.term;
    let videos = [];
    try {
        videos = await Video.find({title: { $regex : searchingBy, $options: "i" }})   //regular expression  i : 대소문자구분x
    } catch(err) {
        console.log(err);
    }
    res.render("search", {pageTitle:"Search", searchingBy, videos});
};


export const getUpload = (req, res) => res.render("upload", {pageTitle:"Upload"});
export const postUpload = async(req, res) => {
    const {
        body: { title, description, hashtags },
        file: { path }
    } = req;
    try {
        const newVideo = await Video.create({  //이방식은 video에서 설정해둔 타입과 다른타입이면 오류를 발생시킴. 즉 try catch사용해야함
            fileUrl: path,
            title,
            description,
            hashtags: hashtags.split(".").map(word => `#${word}`)
        });
        return res.redirect(routes.videoDetail(newVideo.id));
    } catch(error) {
        return res.render("upload", { 
            pageTitle: "Upload", 
            errorMessage: error._message
        })
    }
    
    /*const newVideo = new Video({
        fileUrl: path,
        title,
        description,
        meta: {
            views: 0,
            rating: 0,
        },
        createdAt: Date.now(),
        hashtags: hashtags.split(".").map(word => `#${word}`)
    });
    await newVideo.save();*/
    // To Do: Upload and save video
};


export const videoDetail = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", {pageTitle:"Video not found."});
    } 
    return res.render("videoDetail", { pageTitle:video.title, video });
};


//get
export const getEditVideo = async(req, res) => {
    const {
        params: {id}
    } = req;
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", {pageTitle:"Video not found."});
    } 
    return res.render("editVideo", {pageTitle:`Edit ${video.title}`, video});
}
export const postEditVideo = async(req, res) => {
    const {
        params: {id},
        body: {title, description}
    } = req;
    try {
        await Video.findOneAndUpdate({ _id: id }, {title, description});
        res.redirect(routes.videoDetail(id));
    } catch(error) {
        res.redirect(routes.home);
    }
};


export const deleteVideo = async(req, res) => {
    const {
        params: {id}
    } = req;
    try {
        await Video.findOneAndRemove({ _id: id });   //findOneAndRemove : mongoose와 관련됨. 인자에 해당하는 데이터를 지움.
    } catch(err) {
        console.log(err);
    }
    res.redirect(routes.home);
}