import mongoose from "mongoose";
export const connection=async()=>{
   await mongoose.connect(process.env.DBURL).then(()=>{
    console.log("DB Connection Successfuly ")})
    .catch((error)=>{
     console.log("DB Fail To Connect",error.message);
     
    })
}