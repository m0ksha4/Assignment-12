import mongoose from "mongoose";
const schema=new mongoose.Schema({
    email:{type:String,required:true},
    otp:{type:String,required:true},
    //TTL (time to live)هو اقصي مده المودل دا يفضل موجود فيها في db
    expiresAt:{
        type:Date,
        index:{expires:0}//0 after date 
    },
    attempts:{
        type:Number,default:0
    }
})



export const OTP=mongoose.model("otp",schema)