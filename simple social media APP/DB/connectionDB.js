import mongoose from 'mongoose';

const connectDB = async()=>{
    return await mongoose.connect(process.env.CONN_DB)
    .then((result)=>{console.log('DB connected')})
    .catch((e)=>{console.log('fail to connect DB')})
}

export default connectDB