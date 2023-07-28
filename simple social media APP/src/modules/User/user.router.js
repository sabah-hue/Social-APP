import {Router} from 'express'
import * as userController from './controller/user.js'
import {auth} from '../../middleware/auth.js'
import {myMulter , fileValidation} from '../../services/cloudinary.js'
import { validate } from '../../middleware/validation.js';
import { validateupdateprofile  } from './user.validate.js';
import {asyncErrorHandler} from '../../utils/errorHandling.js';
 
const router = Router();

router.post("/viewprofile",auth,asyncErrorHandler(userController.viewprofile))

router.patch("/profilePic",auth,myMulter(fileValidation.image).single('image')
            ,asyncErrorHandler(userController.updateProfilePic))

router.put("/profileCover",auth,myMulter(fileValidation.image).array('image',5)
            ,asyncErrorHandler(userController.updateCoverPic))
            
router.put("/updateprofile",auth,validate(validateupdateprofile),asyncErrorHandler(userController.updateprofile))

export default router