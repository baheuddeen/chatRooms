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
    username,
    verificationCode,
}: {
    email: string,
    username: string,
    verificationCode: number,
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
        subject: "Welcome to WeeWhisper! Please Verify Your Account",
        html: `
        Dear ${username},

        <div style="margin: 20px 0;">
            <p>
            Thank you for joining WeeWhisper, the chat app where your conversations and connections whisper softly into the vast expanse of digital space. We're thrilled to have you!
            Before you dive into the world of whispers, we need a tiny moment of your time to verify your account. This small step is a giant leap towards securing your digital presence and ensuring your whispers reach the right ears.
            </p>
            <p style="text-align: center;">
            Your verification code is:
            </p>
                <div style="font-size: 22px; color: #000000; letter-spacing: 3px; padding: 10px; text-align: center; background-color: #c5c5c5;">
                    ${verificationCode}
                </div>
            <p/>
            Didn't expect this email? If you didn't sign up for WeeWhisper or you believe this email has reached you by mistake, please safely ignore it. However, if you feel something is amiss, whisper to us at support@wee-whisper.com—we're here to listen and assist. 
            thanks for choosing WeeWhisper,
            </p>
        </div>
        `,
      });
    console.log('email sent');
    
}
