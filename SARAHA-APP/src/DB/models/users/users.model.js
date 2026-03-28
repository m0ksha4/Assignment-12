import  mongoose from "mongoose";
import { PROVIDER_SYS, SYS_GENDER,SYS_ROLE } from "../../../common/constant/index.js";

const schema=new mongoose.Schema({
    userName:{type:String,required:true,trim:true,minlength:3},
    email:{type:String,required:true,unique:true,trim:true},
    provider:{type:String,enum:Object.values(PROVIDER_SYS),default:PROVIDER_SYS.system},
    password:{type:String,required:function(){
        if(this.provider=="google"){return false}
        else{return true}
    }},
    phoneNumber:{type:String,required:function(){
        if(this.email){return false}else{return true}
    }},
    profilePic:String,
    isEmailVerified:{type:Boolean,default:true},
    credentialsUpdatedAt:{type:Date,default:Date.now()},
    age:{type:Number,min:18,max:60},
    gender:{type:Number,enum:Object.values(SYS_GENDER),default:SYS_GENDER.male},
    role:{type:Number,enum:Object.values(SYS_ROLE),default:SYS_ROLE.user}

},{})
export const User=mongoose.models.Users || mongoose.model("Users",schema)