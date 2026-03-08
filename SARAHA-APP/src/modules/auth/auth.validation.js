import joi from 'joi'
import { generalFildes } from '../../DB/middlewares/validation.middlewares.js'
export const signupSchema=joi.object({
    userName:generalFildes.userName,
    email:generalFildes.email,
    phoneNumber:generalFildes.phoneNumber,
    password:generalFildes.password,
    rePassword:generalFildes.rePassword,
    gender:generalFildes.gender,
    role:generalFildes.role

}).required().or("email","phoneNumber")
export const loginSchema=joi.object({
    email:generalFildes.email,
     password:generalFildes.password,
    phoneNumber:generalFildes.phoneNumber
}).required().or("email","phoneNumber")
