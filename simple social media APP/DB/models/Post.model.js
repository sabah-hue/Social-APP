import mongoose from 'mongoose'
import {Schema} from 'mongoose'

const postSchema = new Schema({
    title:{
        type:String,
        require:true
    },
    content:{
        type:String,
    },
    image:{
        type:Object,
        require:true
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    privacy:{
        type:String,
        enum:['public','privite'],
        default:'public'
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    ReactOnPost:[
        {
            userId:{
                type:Schema.Types.ObjectId,
                ref:'User'
            },
            react:{
                type:String,
                enum:['like','unlike','love','notReacted'],
                default:'notReacted'
            }
        }
    ],
    like:[{type:Schema.Types.ObjectId,ref:'User'}],
    unlike:[{ type:Schema.Types.ObjectId, ref:'User'}],
    comment:[{type:Schema.Types.ObjectId,ref:'Comment'}]
},{timestamps:true})

const postModel = mongoose.model('Post' , postSchema);
export default postModel;
