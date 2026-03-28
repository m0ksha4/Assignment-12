import mongoose from 'mongoose'
import { SchemaTypes } from 'mongoose'
const schema=new mongoose.Schema({
    content:{type:String,required:function(){
        if(this.attachments.length==0){return true}
        else{return false}
    }},
    attachments:{type:[String]},
    reciver:{type:SchemaTypes.ObjectId,required:true,ref:"Users"},
    sender:{type:SchemaTypes.ObjectId,ref:"Users"}
},{timestamps:true})
export const Message=mongoose.models.Message || mongoose.model("Message",schema)