import userModel from '../../DB/models/User.model.js'
import { asyncErrorHandler, ResError } from '../utils/errorHandling.js';
import { verifyToken } from '../utils/GenerateAndVerifyToken.js';

export const auth = asyncErrorHandler(
    async (req,res,next)=>{
        const {authorization} = req.headers;
    
            if(!authorization?.startsWith(process.env.BEARER_KEY)){ 
                return next(new Error('in-valid bearer key',{cause:409}))
    
            }
            const token = authorization.split(process.env.BEARER_KEY)[1];
            if(!token){ 
                return next(new ResError('token require',400))
            }
        
            const decode = verifyToken({token})
            console.log(decode)
            if(!decode?.id){
                return next(new ResError('in-valid token payload', 400 ))
            }
            const authUser = await userModel.findById(decode.id).select('_id email role')
            console.log(authUser);
            if(!authUser){
                return next(new ResError('please register first', 400))
            }
            if(authUser.isLoggedIn == false){
                return next(new ResError('please login first', 400 ))
            }
            if( authUser.isConfirm == false){
                return next(new ResError('confirm your email first', 400 ))
            }
            if( authUser.status == 'deleted'){
                return next(new ResError('your account is deleted', 400 ))
            }
        
            req.user = authUser;
            return next()
    }
    
)
