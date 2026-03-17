import { BadRequestException, ConflictException, encryption, hash, SYS_MESSAGE, SYS_ROLE } from "../../common/index.js"
import { sendEmail } from "../../common/utils/email.utils.js"
import { otpRepository } from "../../DB/models/OTP/otp.repository.js"
import { tokenRepository } from "../../DB/models/token/token.repository.js"
import { userRepsitory } from "../../DB/models/users/users.repository.js"
//create user
export const createUser=async(item)=>{
await userRepsitory.create(item)
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
  //create user
        await createUser(body)
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
   
    await userRepsitory.update({email},{isEmailVerified:true})
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
export const logout=async(tokenPayload,user)=>{
 await tokenRepository.create({
    token:tokenPayload.jti,
    userId:user._id,
    expiresAt:new Date(tokenPayload.exp*1000)
    })
 
}
