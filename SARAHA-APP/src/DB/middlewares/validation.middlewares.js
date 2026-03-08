import { BadRequestException, SYS_GENDER, SYS_ROLE } from "../../common/index.js"
import joi from "joi"
export const isValid=(schema)=>{
    return (req,res,next)=>{
          const validationResault=schema.validate(req.body,{abortEarly:false})
            if(validationResault.error){
                let errorMessage=validationResault.error.details.map((err)=>{
                    return {message:err.message,path:err.path[0]}
                })
            throw new BadRequestException("invalid validation",errorMessage)
            }
            next()
    }
}
export const generalFildes={
    userName:joi.string().required().min(2).max(30).trim().messages({
            "string.empty":"userName is Required",
            "string.min":"The userName must be at least two letters long ",
            "string.max":"The userName must not exceed 30 characters"
        }),
    email:joi.string().email().messages({
            "string.email":"Enter a valid email address"
        }),
    phoneNumber:joi.string().pattern(/^(\+20|0020)?01[0125][0-9]{8}$/)
        .messages({
            "string.pattern.base":"Invalid phone number. Please enter a valid Egyptian mobile number like: 01012345678 or +201012345678"
        }),
    password:joi.string().required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .messages({
            "string.pattern.base":"Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&)"
        }),
    rePassword:joi.string().valid(joi.ref("password")).messages({
            "any.only":"rePassword must be match password"
        }),
    role:joi.number().valid(...Object.values(SYS_ROLE)).default(0),
    gender:joi.number().valid(...Object.values(SYS_GENDER)).default(0),
}