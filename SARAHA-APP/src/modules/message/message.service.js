import { NotFoundException, SYS_MESSAGE } from "../../common/index.js"
import { messageRepository } from "../../DB/models/message/message.repository.js"

export const sendMessage=async(content,files,reciverId,senderId)=>{
    let paths=[]
    if(files){
        paths=files.map((file)=>{
        return file.path})
    }
   const createdMessage= await messageRepository.create({
        content,
        reciver:reciverId,
        attachments:paths,
        sender:senderId

    })
    return createdMessage
}
export const getSpecificeMessage=async(id,userId)=>{
   const getMessage= await messageRepository.getOneData({_id:id,$or:[{reciver:userId},{sender:userId}]}
        ,{},
    {
      populate:[
           {path:"reciver",select:"userName email"},
           {path:"sender",select:"userName email"}
        ] 
    })
    if(!getMessage){throw new NotFoundException(SYS_MESSAGE.message.notFound)}
    return getMessage}
export const getAllMessages=async(userId)=>{
    const messages=await messageRepository.getAll({$or:[{reciver:userId},{sender:userId}]},{},
        {
           populate:[
           {path:"reciver",select:"userName email"},
           {path:"sender",select:"userName email"}
        ]  
        }
    )
    if(messages.length==0){throw new NotFoundException(SYS_MESSAGE.message.notFound)}
    return messages
}