import express from 'express';
import pinModel from '../models/Pin.js'

const Pinrouter = express.Router();

Pinrouter.post('/' , async (req,res) =>{
    const newPin = new pinModel(req.body);
    try{
        const savedPin = await newPin.save();
        res.status(200).json(savedPin)
    }
    catch(e){
        res.status(500).json(e)
    }
});

Pinrouter.get('/', async(req,res)=>{
    try {
        const pins = await pinModel.find();
        res.status(200).json(pins)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
})

export default Pinrouter;