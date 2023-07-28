import {Router} from 'express'
import * as postController from './controller/post.js'
import {myMulter , fileValidation} from '../../services/cloudinary.js'
import { validate } from '../../middleware/validation.js';
import { validateCreatePost, validateupdatePostPrivacy , validatedeletePost ,
     validateLikeUnlikePost, validateComment,validateReplyOnComment } from './post.validate.js';
import {asyncErrorHandler} from '../../utils/errorHandling.js';
import {auth} from '../../middleware/auth.js' 
const router = Router();


router.post("/newPost",auth,myMulter(fileValidation.image).single('image')
            ,validate(validateCreatePost),asyncErrorHandler(postController.newPost))
         
router.get("/all",asyncErrorHandler(postController.showAllPosts))

router.patch("/updatePrivacy/:_id",auth,validate(validateupdatePostPrivacy),asyncErrorHandler(postController.updatePostPrivacy))
router.delete("/deletePost/:_id",auth,validate(validatedeletePost),asyncErrorHandler(postController.deletePost))
router.delete("/softdeletePost/:_id",auth,validate(validatedeletePost),asyncErrorHandler(postController.deletePost))

router.patch("/likeUnlike/:_id",auth,validate(validateLikeUnlikePost),asyncErrorHandler(postController.likeOrUnlikePost))
////////
router.post("/comment/:postId",auth,myMulter(fileValidation.image).single('image'),validate(validateComment),asyncErrorHandler(postController.commentOnPost))
router.post("/replay/:commentId",auth,myMulter(fileValidation.image).single('image'),validate(validateReplyOnComment),asyncErrorHandler(postController.replyOnComment))


export default router