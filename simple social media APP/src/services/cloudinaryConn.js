import * as dotenv from 'dotenv'
dotenv.config();
import cloudinary from 'cloudinary'

// cloudinary.v2.config({
//     cloud_name: process.env.cloud_name,
//     api_key: process.env.api_key,
//     api_secret: process.env.api_secret,
//   });

cloudinary.v2.config({
  cloud_name: "dps8pco1z",
  api_key: "485143223195272",
  api_secret: "HjiZWOYoGu-uatiGCOzonZfbnDw"
});

  export default cloudinary.v2;