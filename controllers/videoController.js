import routes from "../routes";  //default export할 때는 {}를 사용하지않음
import Video from "../models/Video";

export const home = async(req, res) => {
    try {
        const videos = await Video.find({}).sort({_id: -1});
        return res.render("home", {pageTitle:"Home", videos});
    } catch(error) {
        console.log(error);
        return res.render("home", {pageTitle:"Home", videos:[]});
    }
    
};
export const search = async(req, res) => {
    const { term } = req.query;  //const searchingBy = req.query.term;
    let videos = [];
    console.log(req.query);
    if(term) { //이것은 mongo DB가 하는것임
        videos = await Video.find({title: { $regex : new RegExp(term, "i") }})   //regular expression  i : 대소문자구분x
    } 
    return res.render("search", {pageTitle:"Search", term, videos});
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
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect(routes.videoDetail(newVideo.id));
    } catch(error) {
        return res.status(400).render("upload", { 
            pageTitle: "Upload", 
            errorMessage: error._message
        });
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
        hashtags: hashtags.split(".").map(word => word.startsWith('#') ? word : `#${word}`)
    });
    await newVideo.save();*/
    // To Do: Upload and save video
};


export const videoDetail = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle:"Video not found."});
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
        return res.status(404).render("404", {pageTitle:"Video not found."});
    } 
    return res.render("editVideo", {pageTitle:`Edit ${video.title}`, video});
}
export const postEditVideo = async(req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if(!video) {
        return res.status(404).render("404", {pageTitle:"Video not found."});
    } 
    await Video.findOneAndUpdate( {_id: id} , {  //findOneAndUpdate같은 경우 middleware가 없음. 그리고 document에 접근할 수가 없음.
        title, 
        description, 
        hashtags: Video.formatHashtags(hashtags)
    });
    return res.redirect(routes.videoDetail(id));

};


export const deleteVideo = async(req, res) => {
    const {
        params: {id}
    } = req;
    try {  //findByIdAndDelete는 findOneAndDelete({_id:id}) 를 줄인거임
        await Video.findByIdAndDelete(id); 
    } catch(err) {
        console.log(err);
    }
    res.redirect(routes.home);
}