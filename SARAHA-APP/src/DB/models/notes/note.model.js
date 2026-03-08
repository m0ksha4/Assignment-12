import mongoose from 'mongoose'
const schema=new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    userId:{type:Schema.Types.ObjectId,required:true,ref:"Users"}
})
export const Note=mongoose.models.Notes || mongoose.model("Notes",schema)