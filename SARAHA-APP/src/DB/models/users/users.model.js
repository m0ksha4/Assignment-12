import  mongoose from "mongoose";
import { SYS_GENDER,SYS_ROLE } from "../../../common/constant/index.js";

const schema=new mongoose.Schema({
    userName:{type:String,required:true,trim:true,minlength:3},
    email:{type:String,required:true,unique:true,trim:true},
    password:{type:String,required:true},
    phoneNumber:{type:String,required:function(){
        if(this.email){return false}else{return true}
    }},
    age:{type:Number,min:18,max:60},
    gender:{type:Number,enum:Object.values(SYS_GENDER),default:SYS_GENDER.male},
    role:{type:Number,enum:Object.values(SYS_ROLE),default:SYS_ROLE.user}

},{})
export const User=mongoose.models.Users || mongoose.model("Users",schema)