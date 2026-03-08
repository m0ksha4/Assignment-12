import jwt from "jsonwebtoken"
export const signToken=(payload,secretKey,expiresIn)=>{
     return jwt.sign(payload,secretKey,{expiresIn})
    }

export const verifyedToken=(token)=>{
        return jwt.verify(token,process.env.JWT_SECRET)
    }
export const generateToken = (payload)=>{
   const accessToken=signToken(
    payload,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRE);
   const refreshToken=signToken(
    payload,
    process.env.SECRET_REFRESH,
    process.env.EXPIRE_REFRESH)
return {accessToken,refreshToken}
}