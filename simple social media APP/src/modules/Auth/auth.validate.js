import joi from 'joi';
import { generalFields } from '../../middleware/validation.js';
/// =========== sign up =============== ///
export const signupValidate = {
    body:joi.object().required().keys({
        firstName: generalFields.firstName,
        lastName:generalFields.lastName,
        email: generalFields.email,
        password: generalFields.password,
        cpass:generalFields.cpass,
        age: generalFields.age,
        phone: generalFields.phone,
      })
}

/// =========== verifyEmailValidate =============== ///

export const verifyEmailValidate = {
  params:joi.object({
    _id:generalFields.id
  })
}

/// =========== signInValidate =============== ///

export const signInValidate = {
  body:joi.object().required().keys({
      email: generalFields.email,
      password:generalFields.password,
      })
}

/// =========== forgetPasswordvalidate =============== ///

export const forgetPasswordvalidate = {
  body:joi.object().required().keys({
      email: generalFields.email
  })
}

/// =========== resetPasswordvalidate =============== ///
export const resetPasswordvalidate = {
  body:joi.object().required().keys({
    email: generalFields.email,
    newpassword: generalFields.password,
    cpass: joi.string().required().valid(joi.ref("newpassword")).messages({
      "any.only": "confirmation password must match password"}),
    code: joi.string().max(6).min(6).required().messages({
      "any.required": "code is required",
      "string.max": "in-valid code length ",
      "string.min": "in-valid code length ",
    })
    }), 
}

////// updateUservalidate
export const updateUservalidate = {
  body:joi.object().required().keys({
      name: joi.string().min(4).max(15).alphanum().messages({
        "string.min": "Username must contain at least 4 char",
      }),
      phone: joi.number().optional(),
      age: joi.number().optional(),
    })
}

///// changePasswordvalidate
export const changePasswordvalidate = {
    body:joi.object().required().keys({
      email: generalFields.email,
      newpassword: generalFields.password,
      cpassword: joi.string().required().valid(joi.ref("newpassword")).messages({
        "any.only": "confirmation password must match password"}),
      }), 
}

