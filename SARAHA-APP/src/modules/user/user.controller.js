import { Router } from "express";
import { decryption, NotFoundException, SYS_MESSAGE, verifyedToken } from "../../common/index.js";
import { checkUserExist } from "../auth/auth.service.js";
const router=Router()
router.get("/get-profile",async(req,res,next)=>{
    const{authorization}=req.headers
     const payload =verifyedToken(authorization)
     const user=await checkUserExist({id:payload._id})
     if(!user){throw new NotFoundException(SYS_MESSAGE.users.notFound) }
     user.phoneNumber=decryption(user.phoneNumber)
return res.status(200).json({message:"done",data:user})

})
export default router