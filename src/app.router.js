import authRouter from './modules/auth/auth.router.js';
import userRouter from './modules/user/user.router.js'
import bookRouter from './modules/book/book.router.js';
import { globalErrorHandler } from './utils/errorHandling.js';
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import connectionDb from '../DB/connection.js';
// import bodyParser from"body-parser";


const initApp = (app, express) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // app.use(bodyParser.json());
    app.use(express.json({}))
    //for image
    app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

    app.get('/', (req, res) => res.send('Hello World!'))
    mongoose.set('strictQuery', false)

    app.use('/auth', authRouter)
    app.use('/user', userRouter)
    app.use('/book', bookRouter)

    app.use("*" , (req,res)=>{
        return res.json({message:"404 Page Not Found"})
    })
    app.use(globalErrorHandler)
    // connection DB
    connectionDb()

}


export default initApp