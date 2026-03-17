import { BadRequestException, SYS_MESSAGE, verifyedToken } from "../../common/index.js"
import { checkUserExist } from "../../modules/auth/auth.service.js"
import { tokenRepository } from "../models/token/token.repository.js"

export const isAuthentication=async(req,res,next)=>{
    
   const{authorization}=req.headers
      const payload=verifyedToken(authorization)
      const user=await checkUserExist({id:payload._id})
       if(!user){throw new NotFoundException(SYS_MESSAGE.users.notFound) }
       //check credentialsUpdatedAt
       if(new Date(user.credentialsUpdatedAt).getTime()>payload.iat*1000){
         throw new BadRequestException("invalid token !")
       }
       //check jti
       const tokenExist=await tokenRepository.getOneData({token:payload.jti})
       if(tokenExist){throw new BadRequestException("invalid token !")}
       req.user=user
       req.payload=payload
       next()
}