import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to:string, html:string)=>{
    // 1st
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === 'production',
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: config?.nodemailer_sender_email,
          pass: config?.nodemailer_sender_pass,
        
        },
      });

    //   2nd
    await transporter.sendMail({
        from: config?.nodemailer_sender_email, // sender address
        to, // list of receivers
        subject: "Reset your password within 10 minutes", // Subject line
        text: "", // plain text body
        html, // html body
      });
}