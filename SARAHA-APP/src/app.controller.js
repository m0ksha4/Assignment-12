import express from 'express'
import {connection} from './DB/index.js'
import {authRouter,userRouter,messageRouter} from "./modules/index.js"
import { redisConnection } from './DB/redis.connection.js'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit,{ipKeyGenerator} from 'express-rate-limit'
export const bootStrap=()=>{
const app= express()
connection()
redisConnection()
app.use(cors('*'))
app.use(helmet())
const limit = rateLimit({
    windowMs: 60 * 1000, 
    max: 3,
    handler: (req, res, next) => {
        throw new Error("too many requests", { cause: 429 })
    },
    keyGenerator: (req, res, next) => {
        const ip = ipKeyGenerator(req) 
        return `${ip}:${req.path}` 
    }
})
app.use(limit)
app.use(express.json())
app.use("/auth",authRouter)
app.use("/user",userRouter)
app.use("/message",messageRouter)




app.use((error,req,res,next)=>{
return res.status(error.cause||500).json({message:error.message,details:error.details,stack:error.stack})
})
app.listen(process.env.PORT,()=>{
    console.log("App Run On Port",process.env.PORT);
    
})
}