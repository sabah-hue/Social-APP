import nodemailer from 'nodemailer'

export const sendEmail =async ({to="" , message="",subject="" , attachments=[]})=>{
    let mailTransporter = nodemailer.createTransport({
      host:'localhost',
      port:587,
      secure:false,
       service:"gmail",
       auth:{
        user: 'sabah.abdelbaset@gmail.com',
        pass:'aastcttmvzllsnhz' 
       }
    });

    let info = await mailTransporter.sendMail({
        from:'sabah.abdelbaset@gmail.com',
        to,
        subject,
        html:message,
        attachments:attachments
        });
        console.log(info)
}