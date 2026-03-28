import {Router}from 'express'
import { getAllMessages, getSpecificeMessage, sendMessage } from './message.service.js'
import { SYS_MESSAGE } from '../../common/index.js'
import { fileUpload } from '../../common/utils/multer.utils.js'
import { isAuthentication } from '../../DB/middlewares/authentication.middelwares.js'
const router=Router()
router.post('/:reciverId/anonymous',fileUpload().array("attachments",2),async(req,res,next)=>{
    const{content}=req.body
    const{reciverId}=req.params
    const files =req.files
    const createdMessage=await sendMessage(content,files,reciverId)
    res.status(201).json({
        message:SYS_MESSAGE.message.created,data:{createdMessage}
    })
})

router.post('/:reciverId/public',isAuthentication,fileUpload().array("attachments",2),async(req,res,next)=>{
    const{content}=req.body
    const{reciverId}=req.params
    const files =req.files
    const createdMessage=await sendMessage(content,files,reciverId,req.user._id)
    res.status(201).json({
        message:SYS_MESSAGE.message.created,data:{createdMessage}
    })
})
router.get("/:id/get-message",isAuthentication,async(req,res,next)=>{
    const{id}=req.params
   const message =await getSpecificeMessage(id,req.user._id)
   res.status(200).json({success:true,data:{message}})
    
})
router.get("/all-message",isAuthentication,async(req,res,next)=>{
   const messages= await getAllMessages(req.user._id)
   res.status(200).json({success:true,data:{messages}})
    
})
export default router