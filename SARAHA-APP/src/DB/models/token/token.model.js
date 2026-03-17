import mongoose, { SchemaTypes } from "mongoose";
const schema=new mongoose.Schema({
    token:String,
    userId:{type:SchemaTypes.ObjectId,ref:"User",required:true},
    expiresAt:{
        type:Date,
        index:{expires:0 }
    }
})
export const Token=mongoose.model("Token",schema)