import mongoose from 'mongoose'
import {Schema} from 'mongoose'

const userSchema = new Schema({
    name:{
        firstName:{
            type:String,
            require:true
        },
        lastName:{
            type:String,
            require:true
        }
    },
    email:{
        type:String,
        require:true,
        unique:true
    }, 
    password:{
        type:String,
        require:true
    }, 
    gender:{
        type:String,
        default:'male',
        enum:['male','female']
    },
    profilePic:Object,
    coverPic:[],
    phone:{
        type:String,
    },
    profilePic:{
        type:Object
    },
    age:Number,
    role:{
        type:String,
        enum:['User','Admin'],
        default:'User',
        required:true
    },
    isConfirm:{
        type:Boolean,
        default:false,
    },
    status:{
        type:String,
        default:'offline',
        enum:['offline','online','deactive','block','deleted']
    },
    isLoggedIn:{
        type:Boolean,
        default:false  
    },
    code:{
        type:String
    }
},{timestamps:true})

const userModel = mongoose.model('User' , userSchema);
export default userModel;
