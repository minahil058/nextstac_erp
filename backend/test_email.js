import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const testEmail = async () => {
    console.log('Testing SMTP Connection...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_USER);
    // Don't log password

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT, // Try 587 first
            secure: false, // true for 465, false for 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false // Sometimes helps with self-signed certs or strict firewalls dev envs
            }
        });

        // Verify connection config
        await transporter.verify();
        console.log('✅ Server connection established successfully!');

        // Send Test Email
        const info = await transporter.sendMail({
            from: `"Test Server" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to yourself
            subject: 'SMTP Readiness Test',
            text: 'If you receive this, your SMTP configuration is correct.',
        });

        console.log('✅ Message sent: %s', info.messageId);
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error(error);
    }
};

testEmail();
