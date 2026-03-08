import { userRepsitory } from "../../DB/models/users/users.repository.js"

export const createUser=async(item)=>{
await userRepsitory.create(item)
}
export const checkUserExist=async(filter,projection={},opthions={})=>{
return await userRepsitory.getOneData(filter,projection,opthions)
}