import nodemailer from 'nodemailer'
export const sendEmail=async({to,subject,html}={})=>{
    const transporter=nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587, 
    auth:{
        user:"mohamedebrahim9879@gmail.com",
        pass:"fsuj efop sdou wzss"
    }
})
await transporter.sendMail({
    from:',"Saraha-App"<mohamedebrahim9879@gmail.com>',
    to,
    subject,
    html
})
}