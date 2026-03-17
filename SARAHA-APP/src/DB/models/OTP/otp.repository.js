import { DBrepsitory } from "../../db.repository.js";
import{OTP}from './otp.model.js'
class OTPRepository extends DBrepsitory{
    constructor(){
        super(OTP)
    }
}

export const otpRepository=new OTPRepository()