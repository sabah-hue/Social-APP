import { hash , compare } from "../../../utils/HashAndComparePassword.js";
import { generateToken } from "../../../utils/GenerateAndVerifyToken.js";
import { ResError } from "../../../utils/errorHandling.js";
import userModel from "../../../../DB/models/User.model.js";
import { nanoid } from "nanoid";
import {sendEmail} from "../../../services/sendEmail.js"
import bcryptjs from "bcryptjs";


/// =========== sign up =============== ///
export const signUp = async (req,res,next)=>{
   
        const { firstName , lastName , email , password , age , phone , gender } = req.body;
        const checkUser = await userModel.findOne({email})
           if(checkUser) 
            return next(new ResError('email already exist', 409 ))

            const hashPass = hash({password} ) 
            const generateCode = nanoid(6);

            const registerUser = new userModel({ name:{firstName , lastName} , email , password:hashPass , 
                                   age , phone , code:generateCode})
            const newUser =await registerUser.save();
            if(newUser){
              const here = `<a href="${req.protocol}://${req.headers.host}/auth/verifyaccount/${newUser._id}">click here</a>`

               await sendEmail({to:newUser.email , subject: "verification mail" ,
                       message:`<p> to verify your account ${here}  </p>`});
                       return res.status(201).json({message:"Done" , newUser})
                      }else{
                return next(new ResError('Fail' , 400 ))
                }
    }
 
/// =========== verify Email =============== ///

export const verifyEmail = async (req, res,next) => {
  const _id = req.params._id;
  const userCheck = await userModel.findOne({ _id });
      if (!userCheck) {
        return next(new ResError('user not found' , 400 ))
    }
    if(userCheck.isConfirm){
      return  res.status(202).json({ message: " account already verified" });
    }
    await userModel.updateOne({_id:userCheck._id} , {isConfirm:true})
    res.status(202).json({ message: " verified Successfuly" });
  }

 /// =========== sign In =============== ///

 export const signIn = async (req, res, next) => {

    const { email , password} = req.body;
    const user = await userModel.findOne({email})
    console.log(user)
    if(user){
      if(!user.isConfirm){
        return next(new ResError('confirm your account first',400))
      }
      if(user.status == 'deleted'){
        return next(new ResError('this account has been deleted',400))
      }
      const isCorrect = compare({plaintext: password , hashPassword: user.password })

      console.log(isCorrect)
      console.log(password)

    if(!isCorrect){
        return next(new ResError('invalid login data',400))
    }
    await userModel.findOneAndUpdate({_id:user._id} , {isLoggedIn:true , status:'online' },{new:true})
    
    const token = generateToken({payload:{id:user._id , email:user.email ,isLoggedIn:true , role:user.role , }})
    return res.json({message:"Done login successfuly" , token})
    }else{
      return next(new ResError('email not exist' , 404 ))
    }
}

 /// =========== forget password part1 'recive mail and send code' =============== ///

export const forgetPassword = async (req, res, next) => {
      const { email  } = req.body;
     
      const userCheck = await userModel.findOne({ email });
      if (userCheck) {
           const userCode = userCheck.code; // created when user sign up - oldCode

            await sendEmail({to:email , subject: "reset your password" ,
            message:`<p>your code is <b> ${userCode} </b> </p>`});

            res.status(200).json({message:"done , enter the code send on your email"})
        
        } else {
          return next(new ResError('email not exist' , 404 ))
        }
  };

 /// =========== forget password part1 'recive mail and send code' =============== ///

  export const resetPassword = async (req, res, next) => {
      const { email , newpassword , code } = req.body;
      //const {_id} = req.user;
      const userCheck = await userModel.findOne({ email});
      if (userCheck) {
            if(code == userCheck.code){
                const hashPass = hash({password: newpassword} );

                await userModel.updateOne({_id:userCheck._id} , {password:hashPass , code: nanoid(6) })
                res.status(200).json({ message: " your password changed Successfully" });
              }else{
                return next(new ResError('wrong code' , 400 ))
              }
        } else {
          return next(new ResError('invalid user' , 400 ))
        }
  };


 /// =========== logOut =============== ///
 export const logout = async (req,res,next)=>{

  const { _id } = req.user;
  const userCheck = await userModel.findOne({ _id }); 
  if(userCheck.isLoggedIn == false) 
  { return next(new ResError('you are already logout' , 400 ))}
  if(userCheck){
      await userModel.updateOne({_id:userCheck._id} , {isLoggedIn:false,status:'offline'},{new:true})
      res.status(200).json({message:'logged out successfuly'})
    }else{
    return next(new ResError('fail to logout' , 400 ))

  }
 }
 
  /// =========== changePassword =============== ///
 export const changePassword = async (req, res,next) => {

 const { email, cpassword , newpassword } = req.body;
      const userCheck = await userModel.findOne({ email }); 
      if(userCheck){ 
        const hashPass = hash({password: newpassword} );
        await userModel.updateOne({_id:userCheck._id} , {password:hashPass})
            res.status(200).json({ message: "changed Successfuly" })
    } else {
      return next(new ResError('fail',400));
    }
};


