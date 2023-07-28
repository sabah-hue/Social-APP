import postModel from '../../../../DB/models/Post.model.js'
import cloudinary from '../../../services/cloudinaryConn.js'
import { ResError } from '../../../utils/errorHandling.js';
import userModel from '../../../../DB/models/User.model.js';
import commentModel from '../../../../DB/models/Comment.js';

//// ============= new post ============ ////
export const newPost = async(req,res,next)=>{
    const {title , content } = req.body;
    if(req.file){
        const {secure_url , public_id}= await cloudinary.uploader.
        upload(req.file.path,{folder:`post/${req.user._id}`}) ;
        const post = await postModel.insertMany({title,content,
            image:{secure_url , public_id},userId:req.user._id}, { new: true } )
        
        return res.status(201).json({message:'done',post})
    }
    const post = await postModel.insertMany({title,content , userId:req.user._id}, { new: true } )
    
    return res.status(201).json({message:'done',post})
}
//// ============= show all public posts  ============ ////

export const showAllPosts = async (req,res,next)=>{
    let pageNo = req.query.page; // ?page=5 
    pageNo = pageNo * 1 || 1 ;
    const postsPerPage = 5
    const skip = (pageNo-1)*postsPerPage;

    let posts = await postModel.find({privacy:'public'}).skip(skip).limit(postsPerPage).populate([
        {path :"userId"} ,{path :"like"},{path:"unlike"},
        {path:"comment",populate:[
        {path :"userId"} ,{path :"like"},{path:"unlike"},
        {path:"replay",populate:[
            {path :"userId"} ,{path :"like"},{path:"unlike"} 
        ]}   
        ]}
    ])

    res.status(200).json({message:'Done' , posts})
}

//// ============= change post privacy ============ ////
export const updatePostPrivacy = async (req,res,next)=>{
    const {privacy} = req.body;
    const {_id} = req.params;
    const updatedPost = await postModel.findByIdAndUpdate(_id , {privacy})
    if(!updatedPost){
        return  next(new ResError('fail to update privacy',400))
    }
    res.status(200).json({message:'Done'})
}

//// =============  delete post  ============ ////
export const deletePost = async(req,res,next)=>{
    const {_id} = req.params;// post Id
    const {userId} = req.body;

    const user = await userModel.findById(req.user._id);
    if(user){
            const post = await postModel.findById(_id, { new: false })
             console.log(post)
             if(post?.image){
                await cloudinary.uploader.destroy(post.image.public_id)
             }
             await postModel.findOneAndDelete(_id, { new: false })

        return res.status(200).json({message:'done'})
    }else{
        return next(new ResError({message:'fail to delete'}))
    }
}
//// ============= soft delete post  ============ ////
export const softdeletePost = async(req,res,next)=>{
    const {_id} = req.params;// post Id
    const {userId} = req.body;

    const user = await userModel.findById(req.user._id);
    if(user){
        if(req.user._id == userId.toString()){
            const post = await postModel.findByIdAndUpdate(_id,{isDeleted:true}, { new: false })
             console.log(post)
            //await cloudinary.uploader.destroy(post.public_id)
    
        }
        return res.status(200).json({message:'done'})
    }else{
        return next(new ResError({message:'fail to delete'}))
    }
}

//// =============  React on post  ============ ////
// export const reactOnPost = async(req,res,next)=>{
//     const {postId , reactOnPost} = req.body
//     const post = await postModel.findById(postId);
//     if(post?.ReactOnPost.includes(req.user._id)){
//             const post = await postModel.findByIdAndUpdate(postId,
//                 {$addToSet:{ReactOnPost : {req.user._id,reactOnPost}}},
//                 { new: false })
//     }
// }


//// =============  like , disLike on post  ============ ////

export const likeOrUnlikePost = async(req,res,next)=>{
const {id} = req.params; // postId
const {_id} = req.user;
const {Indicator} = req.body;  // Indicator = 1 'like post' ,  Indicator = 0 'unlike post
if(!Indicator){
return next(new ResError('Indicator is required',400))
}
if(Indicator == '1'){
    const post = await postModel.findOneAndUpdate(id,
        {$addToSet:{like:_id},$pull:{unlike:_id}},{new:true});
        console.log(post);
    if(!post) {return next(new ResError('no matched post',400))}
    return res.status(200).json({message:"done like post" , post})

}if(Indicator == '0'){
    const post = await postModel.findOneAndUpdate(id,
        {$addToSet:{unlike:_id},$pull:{like:_id}},{new:true})
    if(!post) {return next(new ResError('no matched post',400))}
    return res.status(200).json({message:"done unlike post" , post})
}else{
    return next(new ResError('wrong Indicator',400))

}
}

/// ============= comment on Post ============= ///
export const commentOnPost = async(req,res,next)=>{
    const{postId}= req.params;
    const { content } = req.body;
    const post = await postModel.findOne({_id:postId})
    if(!post){return next(new ResError('no match post',400))}
    if(req.file){
        const {secure_url , public_id}= await cloudinary.uploader.
        upload(req.file.path,{folder:`comment/${req.user._id}`}) ;
        const comment = await commentModel.insertMany({content,
            image:{secure_url , public_id},userId:req.user._id}, { new: true } )
        
        return res.status(201).json({message:'done',comment})
    }
    const comment = await postModel.insertMany({content , userId:req.user._id}, { new: true } )
    post.comment.push(comment._id);
    await post.save();
    return res.status(201).json({message:'done',comment})
}

/// ============= reply on comment ============= ///
export const replyOnComment = async(req,res,next)=>{
    const{commentId}= req.params;
    const { content  } = req.body;
    const Comment = await commentModel.findOne({_id:commentId})
    if(!Comment){return next(new ResError('no match comment',400))}
    if(req.file){
        const {secure_url , public_id}= await cloudinary.uploader.
        upload(req.file.path,{folder:`reply/${req.user._id}`}) ;
        const comment = await commentModel.insertMany({content,
            image:{secure_url , public_id},userId:req.user._id}, { new: true } )
        
        return res.status(201).json({message:'done',comment})
    }
    const comment = await commentModel.insertMany({content , userId:req.user._id}, { new: true } )
    Comment.replay.push(reply._id);
    await Comment.save();
    return res.status(201).json({message:'done',comment})
}

