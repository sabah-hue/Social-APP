import joi from 'joi'
import { generalFields } from '../../middleware/validation.js';
////// validateCreatePost
export const validateCreatePost = {
    body:joi.object().required().keys({
        title: joi.string().required().messages({
            "any.required": "title is required"
        }),
        content: joi.string().optional(),
        privacy: joi.string().optional(),
      })
  }

////// validateupdatePostPrivacy
export const validateupdatePostPrivacy = {
    body:joi.object().required().keys({
        privacy: joi.string().required().valid('private','public').messages({
            "any.required": "privacy is required"
        }),
      }),
    params:joi.object({
        _id:generalFields.id
      })
  }

////// validatedeletePost
export const validatedeletePost = {
    body:joi.object({
        userId:generalFields.id
        }),
    params:joi.object({
        _id:generalFields.id
      })
  }
////// validateLikeUnlikePost
export const validateLikeUnlikePost = {
    body:joi.object().required().keys({
        Indicator: joi.string().required().messages({
            "any.required": "Indicator is required"
        })
    }),
    params:joi.object({
        _id:generalFields.id
      })
  }
////////// validateComment
export const validateComment = {
    body:joi.object().required().keys({
        content: joi.string().required().messages({
            "any.required": "content is required"
        })
    }),
    params:joi.object({
        postId:generalFields.id
      })
  }
  ////////// validateReplyOnComment
export const validateReplyOnComment = {
    body:joi.object().required().keys({
        content: joi.string().required().messages({
            "any.required": "content is required"
        })
    }),
    params:joi.object({
        commentId:generalFields.id
      })
  }