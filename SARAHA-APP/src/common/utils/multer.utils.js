import multer, { diskStorage } from 'multer'
import fs from 'node:fs'
import { BadRequestException } from './err.utils.js'
export const fileUpload=(allowedType=["image/png","image/jpeg","image/gif"])=>{
 return multer({
    fileFilter:(req,file,cb)=>{
        if(!allowedType.includes(file.mimetype)){
            return cb(new BadRequestException("invalid File Format"),false)
        }
        cb(null,true)
    },
    storage:diskStorage({
        
        destination:(req,file,cb)=>{
            const folder=req.user?
        `uploads/${req.user._id}`:
        `uploads/${req.params.reciverId}/messages`

            if(!fs.existsSync(folder)){
            fs.mkdirSync(folder,{recursive:true})}
            cb(null,folder)
        },
        filename:(req,file,cb)=>{ 
            cb(null,Date.now()+Math.random()+"__"+file.originalname)
        }
    })
 })   
}