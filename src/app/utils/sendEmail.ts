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
          user: "nishatnime100@gmail.com",
          pass: "tuej plmr hkyg kpnt",
        },
      });

    //   2nd
    await transporter.sendMail({
        from: 'nishatnime100@gmail.com', // sender address
        to, // list of receivers
        subject: "Change Password", // Subject line
        text: "Reset your password within 10 minutes", // plain text body
        html, // html body
      });
}