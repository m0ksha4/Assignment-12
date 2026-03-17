import { Router } from "express";
import { decryption, NotFoundException, SYS_MESSAGE, verifyedToken } from "../../common/index.js";
import { checkUserExist } from "../auth/auth.service.js";
import { fileUpload } from "../../common/utils/multer.utils.js"
import { isAuthentication,fileValidation, } from "../../DB/middlewares/index.js"
import { getProfile, updateProfilePic } from "./user.services.js";
const router=Router()
router.get("/get-profile",isAuthentication,async(req,res,next)=>{
   const user=await getProfile(req.user)
return res.status(200).json({message:"done",data:user})

})
router.patch("/upload-photo",
  isAuthentication,
  fileUpload().single("profilePic")
,fileValidation,
async(req,res,next)=>{
    
   const updatedUser=await updateProfilePic(req.user,req.file)
   
     return res.status(200).json({message:"done",data:updatedUser})
    
})
export default router