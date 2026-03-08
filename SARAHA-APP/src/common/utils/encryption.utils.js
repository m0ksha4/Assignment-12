import crypto from 'crypto'
export const encryption=(data)=>{
    const iv=crypto.randomBytes(16)
    const cipherData=crypto.createCipheriv("aes-256-cbc",Buffer.from(process.env.SECRETKEY),iv)
    let encryptedData=cipherData.update(data,"utf-8","hex")
    encryptedData+=cipherData.final("hex")
    return `${iv.toString("hex")}:${encryptedData}`
}
export const decryption=(encryptedData)=>{
    const[iv,encryptedValue]=encryptedData.split(":")
    const ivBufferLike=Buffer.from(iv,"hex")
    const decipher=crypto.createDecipheriv("aes-256-cbc",Buffer.from(process.env.SECRETKEY),ivBufferLike)
    let decrypted=decipher.update(encryptedValue,"hex","utf-8")
    decrypted+=decipher.final("utf-8")
    return decrypted

}