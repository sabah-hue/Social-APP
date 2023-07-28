import * as dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import initApp from './src/app.router.js';
const app = express();
initApp(app,express);


const port=process.env.PORT || 3000;
app.listen(port,()=>{
    console.log('server running ...')
})