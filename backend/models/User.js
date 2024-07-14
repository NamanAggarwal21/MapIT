import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
        username:{
            type:String,
            require:true,
            min:3,
            max:20,
            unique:true
        },
        email:{
            type:String,
            require:true,
            max:50,
            unique:true
        },
        password:{
            type:String,
            require:true,
            min:6
        },
       
    },
    {   timestamps:true }
)

const userModel = mongoose.model.User || mongoose.model("User",UserSchema);
export default userModel