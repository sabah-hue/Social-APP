import userRouter from './modules/User/user.router.js'
import postRouter from './modules/post/post.router.js'
import authRouter from './modules/Auth/auth.router.js'
import connectDB from '../DB/connectionDB.js'
import { globalErrorHandling , ResError } from './utils/errorHandling.js'

const initApp = (app , express)=>{
    app.use(express.json({}));
    app.get('/',(req,res)=>res.send('hello'));
    app.use('/user',userRouter);
    app.use('/post',postRouter);
    app.use('/auth',authRouter);

    // invalid routes
    app.all('*',(req,res,next)=>{
        next(new ResError('404 page not found' ,404))
    })

    app.use(globalErrorHandling);

    connectDB();
}

export default initApp;