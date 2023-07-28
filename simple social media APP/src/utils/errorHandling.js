export class ResError extends Error{
    constructor(message , statusCode){
        super(message);
        this.statusCode = statusCode;
    }
}
///// 
export const asyncErrorHandler =(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next)
        .catch((error)=>{
            console.log(error)
            return next(new ResError(error))
        })
    }
}
////// 

export const globalErrorHandling = (err,req,res,next)=>{
    if(err){
        let code = err.statusCode || 500
        if(process.env.Mood=='dev'){
            return res.status(code).json({message:err.message,err, stack:err.stack})
        }
        return res.status(code).json({message:err.message})
    }
}
