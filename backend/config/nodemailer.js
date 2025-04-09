import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port:587,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
})

export default transporter;