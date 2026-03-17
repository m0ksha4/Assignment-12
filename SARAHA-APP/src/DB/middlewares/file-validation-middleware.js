import {fileTypeFromBuffer} from 'file-type'
import fs from 'node:fs'
import { BadRequestException } from '../../common/index.js'
export const fileValidation=async(req,res,next)=>{
    //file path
    const filePath=req.file.path
    //read file & return Buffer
    const fileBuffer=fs.readFileSync(filePath)
    //get the file type
    const typeFile=await fileTypeFromBuffer(fileBuffer)
    const allowedType=["image/png","image/jpeg","image/gif"]
    if(!typeFile||!allowedType.includes(typeFile.mime))
    {
        fs.unlinkSync(filePath)
        throw new BadRequestException("invalid type file")
    }
return next()
}