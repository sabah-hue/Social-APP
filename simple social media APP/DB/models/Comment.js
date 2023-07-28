import mongoose from 'mongoose'
import {Schema} from 'mongoose'

const commentSchema = new Schema({
    content:{
        type:String,
        require:true
    },
    image:{
        type:Object,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        require:true
    },
    postId:{
        type:Schema.Types.ObjectId,
        ref:'Post',
        require:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    like:[{type:Schema.Types.ObjectId,ref:'User'}],
    unlike:[{ type:Schema.Types.ObjectId, ref:'User'}],
    replay:[{ type:Schema.Types.ObjectId, ref:'Comment'}]
},{timestamps:true})

const commentModel = mongoose.model('Comment' , commentSchema);
export default commentModel;
