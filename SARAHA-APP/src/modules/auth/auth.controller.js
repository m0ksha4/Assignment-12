import { Router } from "express";
import { checkUserExist, createUser } from "./auth.service.js";
import { BadRequestException, comper, ConflictException, decryption, encryption, 
     generateToken, hash, NotFoundException,SYS_MESSAGE, SYS_ROLE, UnauthorizedException,
     verifyedToken} from "../../common/index.js";
     import { loginSchema, signupSchema } from "./auth.validation.js";
import { isValid } from "../../DB/middlewares/validation.middlewares.js";

const router= Router()
 router.post("/signup",isValid(signupSchema),async(req,res,next)=>{
  
    const{email,phoneNumber}=req.body
    req.body.role=SYS_ROLE.user
   const userExist=await checkUserExist({ 
        $or:[
             { email: { $eq:email,$exists:true,$ne:null } },
             {phoneNumber : { $eq:phoneNumber,$exists:true,$ne:null } } 
            ]})
            if(userExist){throw new ConflictException(SYS_MESSAGE.users.alreadyExisst) }
           req.body.password = await hash(req.body.password)
           req.body.phoneNumber=encryption(req.body.phoneNumber)
    await createUser(req.body)
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
            console.log(userExist)
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

export default router