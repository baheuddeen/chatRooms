import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';

 
dotenv.config();

// async function createTransporter () {
//     const OAuth2 = google.auth.OAuth2;
//     const oauth2Client = new OAuth2(
//         process.env.CLIENT_ID,
//         process.env.CLIENT_SECRET,
//         "https://developers.google.com/oauthplayground"
//     );
    
//     oauth2Client.setCredentials({
//         refresh_token: process.env.REFRESH_TOKEN
//     });

//     const accessToken = await oauth2Client.getAccessToken();
    
//     const transporter = nodemailer.createTransport({
//         // @ts-ignore
//         host: "smtp.gmail.com",
//         port: 465,
//         secure: true,
//         auth: {
//           type: "OAuth2",
//           user: process.env.EMAIL,
//           accessToken,
//           clientId: process.env.CLIENT_ID,
//           clientSecret: process.env.CLIENT_SECRET,
//           refreshToken: process.env.REFRESH_TOKEN
//         }
//       });    

//     return transporter;
// } 


// export async function sendEmail({
//     email,
//     jwt,
// }: {
//     email: string,
//     jwt: string,
// }) {
//     const transporter = await createTransporter();
//     console.log('email: ', email);
    
//     await transporter.sendMail({
//         from: "verify.mbahy@gmail.com",
//         to: email,
//         subject: "Verify",
//         text: `Verify your Account https://mbahy.eastus.cloudapp.azure.com/api/users/verify?jwt=${jwt}`,
//       });
// }




export async function sendEmail({
    email,
    jwt,
}: {
    email: string,
    jwt: string,
}) {
    const transporter = nodemailer.createTransport({
    host: "mail.privateemail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.PRIVATE_EMAIL,
        pass: process.env.PRIVATE_PASSWORD
    }
    });  
    
    await transporter.sendMail({
        from: "verify@wee-whisper.com",
        to: email,
        subject: "Verify",
        text: `Verify your Account https://www.wee-whisper.com/api/users/verify?jwt=${jwt}`,
      });
    console.log('email sent');
    
}
