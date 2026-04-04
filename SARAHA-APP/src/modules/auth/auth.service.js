import { OAuth2Client } from "google-auth-library"
import { BadRequestException, comper, ConflictException, decryption, encryption, generateToken, hash, NotFoundException, PROVIDER_SYS, SYS_MESSAGE, SYS_ROLE, UnauthorizedException, verifyedToken } from "../../common/index.js"
import { sendEmail } from "../../common/utils/email.utils.js"
import { otpRepository } from "../../DB/models/OTP/otp.repository.js"
import { tokenRepository } from "../../DB/models/token/token.repository.js"
import { userRepsitory } from "../../DB/models/users/users.repository.js"
import { redisClient } from "../../DB/redis.connection.js"
import { v4 as uuidv4 } from 'uuid'
//create user
export const createUser=async(item)=>{
const user= await userRepsitory.create(item)
return user
}
//check if user exist
export const checkUserExist=async(filter,projection={},opthions={})=>{
return await userRepsitory.getOneData(filter,projection,opthions)
}

export const signup=async(body)=>{
     const{email,phoneNumber}=body
       const userExist=await checkUserExist({ 
            $or:[
                 { email: { $eq:email,$exists:true,$ne:null } },
                 {phoneNumber : { $eq:phoneNumber,$exists:true,$ne:null } } 
                ]})
                if(userExist){throw new ConflictException(SYS_MESSAGE.users.alreadyExisst) }
  //prepare & hashing data 
        body.role=SYS_ROLE.user
        body.password = await hash(body.password)
         body.phoneNumber=encryption(body.phoneNumber)
  //create otp
        sendOtp(body)
  //create user in cach
    await redisClient.set(email,JSON.stringify(body),{EX:1*24*60*60})
}
export const loginService=async(body)=>{
    const {email,phoneNumber}=body
       const userExist=await checkUserExist({ 
            $or:[
                 { email: { $eq:email,$exists:true,$ne:null } },
                 {phoneNumber : { $eq:phoneNumber,$exists:true,$ne:null } } 
                ]})
            if(!userExist){throw new NotFoundException(SYS_MESSAGE.users.notFound) }
            const match=await comper(body.password,userExist.password)
            if(!match){throw new UnauthorizedException('Invalid credentials') }
            const {accessToken,refreshToken}=generateToken({
                id:userExist._id,
                email:userExist.email,
                role:userExist.role
            }
            )
                userExist.phoneNumber=decryption(userExist.phoneNumber)
                const sessionId = uuidv4()
                await redisClient.set(`refreshToken:${userExist._id}:${sessionId}`,refreshToken )
                return {userExist,accessToken,refreshToken,sessionId}
}
export const verifyedAccount=async (body)=>{
    const {email,otp}=body
    const otpDoc=await otpRepository.getOneData({email})
    //if not found otp
    if(!otpDoc){throw new BadRequestException("expired otp")}
//if otp incorrect
    if(otp!=otpDoc.otp){
       //if try more than 3 times
            otpDoc.attempts+=1
            if(otpDoc.attempts>3){
                otpRepository.deleteONE({_id:otpDoc._id})
          throw new BadRequestException("Too many incorrect OTP attempts. Please request a new OTP")}
          await otpDoc.save()
    throw new BadRequestException("invalid otp")
    }
   //get data from cach
   let userFromCach= await redisClient.get(email)
   //create user in DB
   await userRepsitory.create(JSON.parse(userFromCach))
   //delete user from cach
   await redisClient.del(email)

    await otpRepository.deleteONE({_id:otpDoc._id})
    return true
}
export async function sendOtp(body){

    const{email}=body
    //if exist otp
    const otpDoc  =await otpRepository.getOneData({email})
    if(otpDoc){
        throw new BadRequestException("can't send otp ,your otp still valid")
    }
    //Create otp
        const otp=Math.floor(100000+Math.random()*900000)
    //save otp
    await otpRepository.create({
        email,
        otp,
        expiresAt:Date.now()+3*60*1000 })
     //send eamil
        sendEmail({to:"mokshaebrahim47@gmail.com",
        subject:"verify your account",
            html:`<p>your OTP to verify your account ${otp}</p>` })

}
export const logoutFromAllDevices=async (user)=>{
    await userRepsitory.update({_id:user._id},
        {credentialsUpdatedAt:Date.now()}
    )
    return true
}
export const logout = async (tokenPayload, user, sessionId) => {

    await redisClient.set(`bl_${tokenPayload.jti}`, tokenPayload.jti, {
        EX: Math.floor(
            (new Date(tokenPayload.exp * 1000).getTime() - Date.now()) / 1000
        )
    })
    await redisClient.del(`refreshToken:${user._id}:${sessionId}`)
}
const googleVerfiyToken=async (idToken)=>{
   const client = new OAuth2Client(process.env.ID_CLIENT)
   const ticket =await client.verifyIdToken({idToken})
   return ticket.getPayload()
}
export const loginWithGoogle=async(idToken)=>{
const payload=await googleVerfiyToken(idToken)
if(payload.email_verified==false){throw new BadRequestException("refused email from google")}
 const user = await checkUserExist({email:payload.email})
 
if(!user){
    const newUser= await createUser({
    email:payload.email,
    userName:payload.name,
    profilePic:payload.picture,
    provider:PROVIDER_SYS.google})
return generateToken({
    _id:newUser._id,
    role:newUser.role,
    provider:newUser.provider
 })
    }

return generateToken({
    _id:user._id,
    role:user.role,
    provider:user.provider
})
}
export const refreshTokenService=async(authorization,sessionId)=>{
     
     const payload= verifyedToken(authorization,process.env.SECRET_REFRESH)
     const cashedRefreshToken=await redisClient.get(`refreshToken:${payload.id}:${sessionId}`)
     
     if (!cashedRefreshToken) {
        throw new UnauthorizedException('session expired or logged out')
    }

     if(cashedRefreshToken!=authorization){
        
        await redisClient.del(`refreshToken:${payload.id}:${sessionId}`)
        throw new UnauthorizedException(`you are not authorized `)
     }
     delete payload.iat
     delete payload.exp
    const {accessToken,refreshToken}= generateToken(payload)
    await redisClient.set(`refreshToken:${payload.id}:${sessionId}`,refreshToken)
    return {accessToken,refreshToken}
}