import routes from "../routes";  //default export할 때는 {}를 사용하지않음
import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async(req, res) => {
    try {
        const videos = await Video.find({}).sort({_id: -1});
        return res.render("home", {pageTitle:"Home", videos});
    } catch(error) {
        return res.render("home", {pageTitle:"Home", videos:[]});
    }
};
export const search = async(req, res) => {
    const { term } = req.query;  //const searchingBy = req.query.term;
    let videos = [];
    try {
        if(term) { //이것은 mongo DB가 하는것임
            videos = await Video.find({title: { $regex : new RegExp(term, "i") }});  //regular expression  i : 대소문자구분x
        } 
        return res.render("search", {pageTitle:"Search", term, videos});
    } catch(err) {
        req.flash("error", "Video search Error");
        return res.status(404).render("404", {pageTitle:"Video search Error.(DB)"});
    }
    
};


export const getUpload = (req, res) => res.render("upload", {pageTitle:"Upload"});
export const postUpload = async(req, res) => {
    const {
        session: { user: { _id }},
        body: { title, description, hashtags },
        files: { videoFile, thumbFile }
    } = req;
    const isHeroku = process.env.NODE_ENV === "production";

    try {
        const newVideo = await Video.create({  //이방식은 video에서 설정해둔 타입과 다른타입이면 오류를 발생시킴. 즉 try catch사용해야함
            fileUrl: isHeroku ? videoFile[0].location : videoFile[0].path,
            thumbUrl: isHeroku ? thumbFile[0].location : thumbFile[0].path,
            title,
            description,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect(routes.videoDetail(newVideo.id));
    } catch(error) {
        req.flash("error", "Video upload Error");
        return res.status(400).render("upload", { pageTitle: "Upload" });
    }
};


export const videoDetail = async(req, res) => {
    const { id } = req.params;
    try {
        const video = await Video.findById(id).populate("owner").populate("comments"); //populate를 사용하면 ref에 해당하는 table에서 값을 찾아서 반환시켜줌. populate(relationship)
        const comments = await Comment.find( { "video": id }).populate("owner");
        if(!video) {
            return res.status(404).render("404", {pageTitle:"Video not found."});
        } 

        return res.render("videoDetail", { pageTitle:video.title, video, comments });
    } catch(err) {
        req.flash("error", "Video load Error");
        return res.status(404).render("404", {pageTitle:"Video load Error.(DB)"});
    }
};


//get
export const getEditVideo = async(req, res) => {
    const {
        params: {id},
        session: { user: { _id } }
    } = req;
    try {
        const video = await Video.findById(id);
        if(!video) {
            return res.status(404).render("404", {pageTitle:"Video not found."});
        } 
        if(String(video.owner) !== String(_id)) {
            req.flash("error", "Not authorized");
            return res.status(403).redirect("/");
        }
        return res.render("editVideo", {pageTitle:`Edit ${video.title}`, video});
    } catch(err) {
        req.flash("error", "Video load Error");
        return res.status(404).render("404", {pageTitle:"Video load Error.(DB)"});
    }
};

export const postEditVideo = async(req, res) => {
    const { 
        params: { id },
        body: { title, description, hashtags },
        session: { user: { _id } }
    } = req;
    try {
        const video = await Video.findById(id);
        if(!video) {
            req.flash("error", "Video not found");
            return res.status(404).render("404", {pageTitle:"Video not found."});
        } 
        if(String(video.owner) !== String(_id)) {
            req.flash("error", "You are not the owner of the video");
            return res.status(403).redirect("/");
        }
        await Video.findOneAndUpdate( {_id: id} , {  //findOneAndUpdate같은 경우 middleware가 없음. 그리고 document에 접근할 수가 없음.
            title, 
            description, 
            hashtags: Video.formatHashtags(hashtags)
        });
        req.flash("success", "Change saved.");
        return res.redirect(routes.videoDetail(id));
    } catch(err) {
        req.flash("error", "Video update Error");
        return res.status(404).render("404", {pageTitle:"Video update Error.(DB)"});
    }
};

export const deleteVideo = async(req, res) => {
    const {
        params: {id},
        session: { user: { _id } }
    } = req;
    try { //findByIdAndDelete는 findOneAndDelete({_id:id}) 를 줄인거임
        const video = await Video.findById(id);
        const user = await User.findById( _id );
        
        if(!video) {
            req.flash("error", "Video not found");
            return res.status(404).render("404", {pageTitle:"Video not found."});
        } 
        if(String(video.owner) !== String(_id)) {
            req.flash("error", "You are not the owner of the video");
            return res.status(403).redirect("/");
        }
        user.videos = user.videos.filter((v) => String(v) !== String(id));
        await user.save();
        video.comments.forEach( async(comment) => {
            await Comment.findByIdAndDelete(comment);
        });
        await Video.findByIdAndDelete(id); 
        return res.redirect(routes.home);
    } catch(err) {
        req.flash("error", "Video delete Error");
        return res.status(404).render("404", {pageTitle:"Video delete Error.(DB)"});
    }
};

export const registerView = async(req, res) => {
    const { id } = req.params;
    try {
        const video = await Video.findById(id);
        if(!video) {
            req.flash("error", "Video not found");
            return res.status(404).render("404", {pageTitle:"Video not found."});
        }
        video.meta.views = video.meta.views + 1;
        await video.save();
        return res.sendStatus(200);
    } catch(err) {
        req.flash("error", "Video not found");
        return res.status(404).render("404", {pageTitle:"Video not found.(DB)"});
    }
};

export const createComment = async(req, res) => {
    const { 
        params: { id }, 
        body: { text },
        session: { user }
    } = req
    try {
        const video = await Video.findById(id);
        if(!video) {
            return res.sendStatus(404);
        }
        const comment = await Comment.create({
            text,
            owner: user._id,
            video: id,
        });
        video.comments.push(comment._id);
        await video.save();
        return res.status(201).json({ newCommentId: comment._id, user }); //새로운 댓글의 id를 보내주기 위함. fake comment는 id를 가지고 있지 않음
    } catch(err) {
        req.flash("error", "Create comment Error");
        return res.status(404).render("404", {pageTitle:"Create comment Error.(DB)"});
    }
};

export const deleteComment = async(req, res) => {
    const {
        params: {id: commentId},
        session: { user: { _id } }
    } = req;
    try {
        const comment = await Comment.findById(commentId).populate("owner").populate("video");
        const video = await Video.findById(comment.video._id);
        if(!comment || !video) {
            req.flash("error", "Comment/Video not found");
            return res.status(404).render("404", {pageTitle:"Comment/Video not found."});
        } 
        if(String(comment.owner._id) !== String(_id)) {
            req.flash("error", "You are not the owner of the video");
            return res.status(403).redirect("/");
        }
        await Comment.findByIdAndDelete(commentId); 
        video.comments = video.comments.filter((fil) => String(fil) !== String(commentId));
        await video.save();
        return res.sendStatus(200);
    } catch(err) {
        req.flash("error", "Delete Error");
        return res.status(404).render("404", {pageTitle:"Delete Error.(DB)"});
    }
};

export const updateComment = async(req, res) => {
    const {
        params: { id },
        body: { text },
    } = req;
    try {
        const comment = await Comment.findByIdAndUpdate(id, { text });
        if(!comment) {
            return res.sendStatus(404);
        }
        return res.sendStatus(200);
    } catch(err) {
        req.flash("error", "Update Error");
        return res.status(404).render("404", {pageTitle:"Update Error.(DB)"});
    }
};