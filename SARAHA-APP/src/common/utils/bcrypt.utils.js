import bcrypt from 'bcrypt'
export const hash=async(password)=>{
    return await bcrypt.hash(password,10)
}
export const comper=async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword)
}
