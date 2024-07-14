import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {dbconnect} from './config/db.js'
import Pinrouter from './routes/pins.js';
import UserRouter from './routes/users.js';
import cors from 'cors'
 
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

dbconnect();

app.use("/api/pins", Pinrouter)
app.use("/api/users", UserRouter)

const PORT = process.env.PORT || 8800
app.listen(PORT , ()=>{
    console.log(`Server started at port ${PORT}`)
})
