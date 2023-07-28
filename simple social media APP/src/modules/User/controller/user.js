import userModel from "../../../../DB/models/User.model.js"
import { ResError  } from "../../../utils/errorHandling.js"
import cloudinary from '../../../services/cloudinaryConn.js'
/////// view my profile
export const viewprofile = async(req,res,next)=>{
        const user = await userModel.findOne(req.user._id)
        return res.status(200).json({message:"Done" , user})
    }
////// update profile pic
export const updateProfilePic = async(req,res,next)=>{
    if(req.file){
        const {secure_url , public_id}= await cloudinary.uploader.
        upload(req.file.path,{folder:`user/${req.user._id}`}) ;
        const user = await userModel.findByIdAndUpdate(req.user._id,
            {profilePic:{secure_url , public_id}}, { new: false } )
    
        await cloudinary.uploader.destroy(user.profilePic.public_id)
        return res.status(200).json({message:'done',user})
    }
    return next(new ResError('no attach photo',400))
}

////// update cover pic
export const updateCoverPic = async(req,res,next)=>{
    if(!req.files){
        return next(new ResError('no image selected' , 400))
    }
    const coverPic = [];
    for (const file of req.files){
        const {secure_url , public_id}= await cloudinary.uploader
        .upload(file.path,{folder:`user/${req.user._id}/coverPic`})

        await cloudinary.uploader.destroy(public_id)
        coverPic.push({secure_url , public_id})
    }
    const user = await userModel.findByIdAndUpdate(req.user._id,{coverPic}, { new: false } )
    
    return res.status(201).json({message:'done',user})

}
///// update my profile data
export const updateprofile = async(req,res,next)=>{
    const { firstName , lastName, age , phone } = req.body;
        const user = await userModel.findOneAndUpdate(req.user._id,{name:{firstName , lastName}  , age , phone })
        if(!user){return next(new ResError('fail to update',400))}
        return res.status(200).json({message:"Done" , user})
}  
/////