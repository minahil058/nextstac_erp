import dbAdapter from '../dbAdapter.js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Email Transporter Setup
const createTransporter = async () => {
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback to Ethereal for testing
        const testAccount = await nodemailer.createTestAccount();
        console.log('Using Ethereal Mail for testing');
        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }
};

export const inviteUser = async (req, res) => {
    const { email, role, name, department } = req.body;

    if (!email || !role) {
        return res.status(400).json({ error: 'Email and Role are required' });
    }

    // Helper to send email
    const sendInvitationEmail = async (targetEmail, targetRole, targetId, targetStatus) => {
        try {
            const transporter = await createTransporter();
            const info = await transporter.sendMail({
                from: '"Financa ERP" <no-reply@financa.com>',
                to: targetEmail,
                subject: 'Invitation to Join Financa ERP',
                text: `You have been invited to join Financa ERP as a ${targetRole}. Please sign up using this email address to access your account.`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #4F46E5;">Welcome to Financa ERP</h2>
                        <p>You have been invited to join the platform as a <strong>${targetRole}</strong>.</p>
                        <p>To get started, please click the link below to create your account:</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/signup" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Create Account</a>
                        <p style="margin-top: 20px; font-size: 12px; color: #666;">This invitation was sent by an administrator.</p>
                    </div>
                `
            });

            console.log('Message sent: %s', info.messageId);
            if (!process.env.SMTP_HOST) {
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                return res.status(201).json({
                    message: 'Invitation sent successfully',
                    user: { id: targetId, email: targetEmail, role: targetRole, status: targetStatus },
                    debug_preview_url: nodemailer.getTestMessageUrl(info)
                });
            }

            res.status(201).json({ message: 'Invitation sent successfully', user: { id: targetId, email: targetEmail, role: targetRole, status: targetStatus } });

        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            res.status(201).json({ warning: 'User created/updated but email failed to send', error: emailError.message });
        }
    };

    try {
        const row = await dbAdapter.findUserByEmail(email);

        if (row) {
            if (row.status === 'Invited') {
                console.log('Resending invitation to:', email);
                return sendInvitationEmail(email, row.role, row.id, row.status);
            }
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // Create Invited User
        const id = uuidv4();
        const status = 'Invited';
        const password_hash = 'PENDING_REGISTRATION';

        let finalDepartment = department;
        if (!finalDepartment) {
            if (role === 'ecommerce_admin') finalDepartment = 'E-commerce';
            if (role === 'dev_admin') finalDepartment = 'Web Development';
        }

        // Insert into DB
        const newUser = { id, name: name || 'Invited User', email, password_hash, role, status, department: finalDepartment };
        await dbAdapter.createUser(newUser);

        sendInvitationEmail(email, role, id, status);

    } catch (e) {
        console.error("Invite Error:", e);
        res.status(500).json({ error: e.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const row = await dbAdapter.findUserByEmail(email);

        if (!row) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (row.status === 'Invited') {
            return res.status(403).json({ error: 'Account not activated. Please complete registration.' });
        }

        if (row.status === 'Inactive') {
            return res.status(403).json({ error: 'Account is inactive. Contact administrator.' });
        }

        // Mock password check
        if (password !== row.password_hash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { password_hash, ...user } = row;
        res.json({ token: 'mock-jwt-token', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Registering user attempt:', { name, email });

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const row = await dbAdapter.findUserByEmail(email);

        // Scenario 1: User does not exist at all -> Deny
        if (!row) {
            return res.status(403).json({ error: 'Access Denied. Your email has not been invited by an administrator.' });
        }

        // Scenario 2: User exists but is already Active -> Deny (Already registered)
        if (row.status === 'Active') {
            return res.status(400).json({ error: 'User already registered. Please login.' });
        }

        // Scenario 3: User exists and status is 'Invited' -> Allow (Update record)
        if (row.status === 'Invited') {
            const password_hash = password; // Should hash in real app
            const status = 'Active';

            const updates = { name, password_hash, status };
            await dbAdapter.updateUser(row.id, updates);

            // Return updated user object
            const user = {
                id: row.id,
                name,
                email,
                role: row.role,
                status,
                department: row.department,
                share_percentage: row.share_percentage
            };

            res.status(200).json({ token: 'mock-jwt-token', user });
        } else {
            // Fallback for any other status
            return res.status(403).json({ error: `Account status is ${row.status}. Contact admin.` });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
