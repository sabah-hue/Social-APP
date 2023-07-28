import { ResError } from "../utils/errorHandling.js";

export const admin = async(req,res,next)=>{
    if(req.user.role !== 'admin'){
       return next(new ResError('not authorized',403))
    }
    return next();
}