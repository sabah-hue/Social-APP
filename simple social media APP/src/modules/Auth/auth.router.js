import {Router} from 'express'
import { validate } from '../../middleware/validation.js';
import { signupValidate , verifyEmailValidate , signInValidate 
    ,forgetPasswordvalidate,resetPasswordvalidate , changePasswordvalidate} from './auth.validate.js';
import * as authController from './controller/auth.js';
import { asyncErrorHandler } from '../../utils/errorHandling.js';
import {auth} from '../../middleware/auth.js'

const router = Router();

router.post("/signup", validate(signupValidate),asyncErrorHandler(authController.signUp))
router.get("/verifyaccount/:_id", validate(verifyEmailValidate),asyncErrorHandler(authController.verifyEmail))
router.post("/signin", validate(signInValidate),asyncErrorHandler(authController.signIn))

router.post("/forgetPassword",validate(forgetPasswordvalidate),asyncErrorHandler(authController.forgetPassword))
router.patch("/resetPassword", auth,validate(resetPasswordvalidate),asyncErrorHandler(authController.resetPassword))
router.post("/logout", auth,asyncErrorHandler(authController.logout))
router.patch("/changePassword", auth,validate(changePasswordvalidate),asyncErrorHandler(authController.changePassword))


export default router