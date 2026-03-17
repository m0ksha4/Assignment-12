import { Router } from "express";
import { checkUserExist, createUser, logout, logoutFromAllDevices, sendOtp, signup, verifyedAccount } from "./auth.service.js";
import { BadRequestException, comper, ConflictException, decryption, encryption, 
     generateToken, hash, NotFoundException,SYS_MESSAGE, SYS_ROLE, UnauthorizedException,
     verifyedToken} from "../../common/index.js";
     import { loginSchema, signupSchema } from "./auth.validation.js";
import { isValid } from "../../DB/middlewares/validation.middlewares.js";
import { fileUpload } from "../../common/utils/multer.utils.js";
import { isAuthentication } from "../../DB/middlewares/authentication.middelwares.js";

const router= Router()
 router.post("/signup",fileUpload().none(),isValid(signupSchema),async(req,res,next)=>{
  
   await signup(req.body)
    res.status(200).json({message:SYS_MESSAGE.users.created})
 })
 router.post("/login",isValid(loginSchema),async(req,res,next)=>{
     const {email,phoneNumber}=req.body
   const userExist=await checkUserExist({ 
        $or:[
             { email: { $eq:email,$exists:true,$ne:null } },
             {phoneNumber : { $eq:phoneNumber,$exists:true,$ne:null } } 
            ]})
        if(!userExist){throw new NotFoundException(SYS_MESSAGE.users.notFound) }
        const match=await comper(req.body.password,userExist.password)
        if(!match){throw new UnauthorizedException('Invalid credentials') }
        const {accessToken,refreshToken}=generateToken({
            id:userExist._id,
            email:userExist.email,
            role:userExist.role
        }
        )
            userExist.phoneNumber=decryption(userExist.phoneNumber)
        res.status(200).json({data:userExist,accessToken,refreshToken})
 })

router.get("/refresh",async(req,res,next)=>{
  const{authorization}=req.headers
  if(!authorization){throw new BadRequestException("Token is required")}
 const payload= verifyedToken(authorization)
 delete payload.iat
 delete payload.exp
 const {accessToken,refreshToken}=generateToken(payload)
return res.status(200).json({accessToken,refreshToken})
})
router.patch("/verify-account",async(req,res,next)=>{
    await verifyedAccount(req.body)
    res.status(200).json({message:"your account  verifyed successfully"})
})
router.post("/send-otp",async (req,res,next)=>{
    await sendOtp(req.body)
    res.status(200).json({message:"OTP sent successfully. Please check your email"})
})
router.patch("/logout-from-all-devices",isAuthentication,async (req,res,next)=>{
await logoutFromAllDevices(req.user)
res.status(200).json({
    message:"logout from all devices successfully"
})
})
router.post("/logout",isAuthentication,async (req,res,next)=>{
await logout(req.payload,req.user)

res.status(200).json({
    message:"logout  successfully"
})
})
export default router