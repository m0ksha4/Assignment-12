
import{User}from './models/users/users.model.js'
export class DBrepsitory{
    nModel
    constructor(model){
        this.nModel=model
    }
async create(item){
    return await this.nModel.insertOne(item)
}
async update(filter,updatedData,opthions={returnDocument: "after"}){
    return await this.nModel.findOneAndUpdate(filter,updatedData,opthions)
}
async getOneData(filter,projection={},options={}){
   return await this.nModel.findOne(filter,projection,options)
}
async getAll(filter,projection={},options={}){
   return await this.nModel.find(filter,projection,options)
}
async deleteONE(filter){
    return await this.nModel.deleteOne(filter)
}

 }
