import userModel from "../models/User.js";
import express from 'express';
import bcrypt from 'bcrypt';

const UserRouter = express.Router();

UserRouter.post('/register' , async(req,res) =>{
    try {
        const {username,email,password} = req.body;
        const existing = await userModel.findOne({email})
        if(existing){
            return res.status(400).json({
                message:"already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        const newUser = new userModel({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        const user = await newUser.save();
        res.status(200).json({id:user._id})

    } 
    catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})
UserRouter.post('/login' , async(req,res) =>{
    try {
        const {username , password} = req.body;
        const user = await userModel.findOne({username})
        if(!user){
            return res.status(400).json({
                message:"Wrong username or password"
            }); 
        } 

        const validPassword = await bcrypt.compare(password , user.password);

        if(!validPassword){
            return res.status(400).json({
                message:"Wrong password !"
            })
        }

        res.status(200).json({
            _id:user._id , 
            username :username
        });

    } catch (error) {
        res.status(500).json(error);
    }
})
export default UserRouter;