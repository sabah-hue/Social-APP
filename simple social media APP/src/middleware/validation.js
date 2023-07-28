import joi from 'joi'
import { Types } from 'mongoose'

const valideObjectId = (value , helper)=>{
  console.log(value);
    return Types.ObjectId.isValid(value) ? true : helper.message("in-valid ObjectId")
}

export const generalFields = {
    firstName: joi.string().required().min(4).max(10).alphanum().messages({
        "any.required": "first name is required",
        "string.empty": "first Name can not be empty",
        "string.max": "first Name must not exceed 10 char",
        "string.min": "first Name must contain at least 4 char",
      }),
      lastName: joi.string().required().min(4).max(10).alphanum().messages({
        "any.required": "last name is required",
        "string.empty": "last Name can not be empty",
        "string.max": "last Name must not exceed 10 char",
        "string.min": "last Name must contain at least 4 char",
      }),
      email: joi.string().required().email({
        minDomainSegments:2,tlds:{allow:["com","net"]}
      }).messages({
        "any.required": "please enter your email",
        "string.email":"email must be valid"
      }),
      password: joi.string().required()
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).messages({
        "any.required": "password is required",
        "string.pattern.base": "password must be at least 8 char , one letter , one number",
      }),
      cpass: joi.string().required().valid(joi.ref("password")).messages({
        "any.only": "confirmation password must match password",
      }),
      age: joi.number().min(16).max(90).optional().messages({
        "number.base":"age must be a number",
        "number.min": "age must not exceed 90 years",
        "number.max": "age must not less than 16 years",
      }),
      phone: joi.string().regex(/^[0-9]{10}$/)
      .messages({'string.pattern.base': `Phone number must have 10 digits.`}).optional(),
      id:joi.string().custom(valideObjectId).required()
}

/////////
export const validate = (data)=>{
    return (req,res,next)=>{
        const valideDataPlace = ["body", "params", "query", "headers", "file", "files"];
        let validateError = [];
        for(const key of valideDataPlace){
            if(data[key]){
                const validateResult = data[key].validate(req[key],{abortEarly:false});
                if(validateResult?.error?.details){
                    validateError.push(validateResult.error.details);
                }
            }
        }
        if(validateError.length){
            return res.json({
                validation_Erorr: "Validation Error",
                Errors: validateError,
              });
        }
        return next();
    }
}