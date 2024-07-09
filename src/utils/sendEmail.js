import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MY_GMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});
export async function sendResetPasswordEmail(email, token) {
    const mailOptions = {
        to: email,
        from: 'sarthik32@gmail.com',
        subject: 'Password Reset',
        text: `reset your password using this token: ${token}`
    };

    await transporter.sendMail(mailOptions);
}

export async function sendNotification(data) {
    const mailOptions = {
        to: data.email,
        from: 'sarthik32@gmail.com',
        subject: 'New Registration',
        html: `<h1>Welcome to Our Service</h1>
            <p>Hi ${data.firstName},</p>
            <p>Thank you for registering with us. Your account has been successfully created.</p>`
    }
}
