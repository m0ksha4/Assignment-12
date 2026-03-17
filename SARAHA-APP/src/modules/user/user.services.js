import { decryption, NotFoundException, SYS_MESSAGE } from "../../common/index.js"
import { userRepsitory } from "../../DB/models/users/users.repository.js"
import fs from "node:fs"
import { checkUserExist } from "../auth/auth.service.js"
//update Pp
export const updateProfilePic=async(user,file)=>{
const updatePp= await userRepsitory.update({_id:user._id},{profilePic:file.path})
if(!user){
    throw new NotFoundException(SYS_MESSAGE.users.notFound)
}
//delete the old Pp
fs.unlinkSync(user.profilePic)
return updatePp
} 
export const getProfile=async (user)=>{
  
         const userExist=await checkUserExist({_id:user._id})
         if(!userExist){throw new NotFoundException(SYS_MESSAGE.users.notFound) }
         userExist.phoneNumber=decryption(userExist.phoneNumber)
         return userExist
}