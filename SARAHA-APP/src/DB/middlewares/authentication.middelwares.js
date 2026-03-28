import { BadRequestException, SYS_MESSAGE, verifyedToken } from "../../common/index.js"
import { checkUserExist } from "../../modules/auth/auth.service.js"
import { tokenRepository } from "../models/token/token.repository.js"
import { redisClient } from "../redis.connection.js"

export const isAuthentication=async(req,res,next)=>{
    
   const{authorization}=req.headers
      const payload=verifyedToken(authorization,process.env.JWT_SECRET)
      const user=await checkUserExist({id:payload._id})
       if(!user){throw new NotFoundException(SYS_MESSAGE.users.notFound) }
       //check credentialsUpdatedAt
       if(new Date(user.credentialsUpdatedAt).getTime()>payload.iat*1000){
         throw new BadRequestException("invalid token !")
       }
       //check jti
       const tokenExist=await redisClient.get(`bl_${payload.jti}`)
       if(tokenExist){throw new BadRequestException("revoked token !")}
       req.user=user
       req.payload=payload
       next()
}