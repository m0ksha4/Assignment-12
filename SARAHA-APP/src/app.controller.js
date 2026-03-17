import express from 'express'
import {connection} from './DB/index.js'
import {authRouter,userRouter} from "./modules/index.js"
import { redisConnection } from './redis.connection.js'
export const bootStrap=()=>{
const app= express()
connection()
redisConnection()
app.use(express.json())
app.use("/auth",authRouter)
app.use("/user",userRouter)




app.use((error,req,res,next)=>{
return res.status(error.cause||500).json({message:error.message,details:error.details,stack:error.stack})
})
app.listen(process.env.PORT,()=>{
    console.log("App Run On Port",process.env.PORT);
    
})
}