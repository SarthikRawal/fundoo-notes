import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function sendEmail(email, token) {
    const transporter = createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.MY_GMAIL,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        to: email,
        from: 'sarthik32@gmail.com',
        subject: 'Password Reset',
        text: `reset your password using this token: ${token}`
    };

    await transporter.sendMail(mailOptions);
}

export default sendEmail