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

import { supabaseAdmin } from '../supabaseClient.js';

// ... existing imports ...

export const inviteUser = async (req, res) => {
    const { email, role, name, department, password } = req.body;

    if (!email || !role) {
        return res.status(400).json({ error: 'Email and Role are required' });
    }

    // Helper to send email
    const sendInvitationEmail = async (targetEmail, targetRole, targetId, targetStatus) => {
        // ... (keep existing email logic or simplify if password provided)
        // If password provided, we might not need to send "Invite" link, but rather "Credentials" email.
        // For minimal change, we keep the invite email logic but maybe suppress it or tweak it?
        // Actually, let's keep it as is, but maybe the user won't use the link if they just login.

        try {
            const transporter = await createTransporter();
            const text = password
                ? `You have been added to Financa ERP. Your login credentials are: Email: ${targetEmail}, Password: ${password}.`
                : `You have been invited to join Financa ERP. Please sign up using this email.`;

            const info = await transporter.sendMail({
                from: '"Financa ERP" <no-reply@financa.com>',
                to: targetEmail,
                subject: 'Welcome to Financa ERP',
                text: text,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #4F46E5;">Welcome to Financa ERP</h2>
                        <p>You have been assigned the role: <strong>${targetRole}</strong>.</p>
                        ${password ? `<p>Your temporary password is: <strong>${password}</strong></p>` : `<p>Please sign up via the portal.</p>`}
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Login Here</a>
                    </div>
                `
            });

            console.log('Message sent: %s', info.messageId);
            // ... (keep existing debug return)
            if (!process.env.SMTP_HOST) {
                return res.status(201).json({
                    message: 'User created successfully',
                    user: { id: targetId, email: targetEmail, role: targetRole, status: targetStatus },
                    debug_preview_url: nodemailer.getTestMessageUrl(info)
                });
            }
            res.status(201).json({ message: 'User created successfully', user: { id: targetId, email: targetEmail, role: targetRole, status: targetStatus } });

        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            res.status(201).json({ warning: 'User created but email failed', error: emailError.message });
        }
    };

    try {
        const row = await dbAdapter.findUserByEmail(email);
        if (row) return res.status(400).json({ error: 'User with this email already exists.' });

        let id = uuidv4();
        let status = 'Invited';
        let password_hash = 'PENDING_REGISTRATION';

        // Create in Supabase Auth if password provided
        if (password && supabaseAdmin) {
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true
            });

            if (authError) {
                console.error('Supabase Auth Create Error:', authError);
                return res.status(400).json({ error: 'Failed to create user in Auth system: ' + authError.message });
            }

            if (authData.user) {
                id = authData.user.id; // Use Supabase ID
                status = 'Active';
                password_hash = 'SUPABASE_AUTH'; // Placeholder
            }
        } else if (password && !supabaseAdmin) {
            console.warn('Backend missing SUPABASE_SERVICE_ROLE_KEY. Cannot create Auth user.');
            // We proceed to create in local DB, but they can't login via Supabase Auth.
            // Notify frontend?
            return res.status(500).json({ error: 'Server misconfiguration: Cannot create login credentials. Missing Service Role Key.' });
        }

        let finalDepartment = department;
        if (!finalDepartment) {
            if (role === 'ecommerce_admin') finalDepartment = 'E-commerce';
            if (role === 'dev_admin') finalDepartment = 'Web Development';
        }

        // Insert into DB
        const newUser = { id, name: name || 'Admin User', email, password_hash, role, status, department: finalDepartment };
        await dbAdapter.createUser(newUser);

        sendInvitationEmail(email, role, id, status);

    } catch (e) {
        console.error("Invite Error:", e);
        res.status(500).json({ error: e.message });
    }
};

export const syncProfile = async (req, res) => {
    try {
        const { id, email, name, avatar_url } = req.body;

        if (!id || !email) {
            return res.status(400).json({ error: 'User ID and Email are required for sync' });
        }

        // Check if user exists
        const existingUser = await dbAdapter.findUserByEmail(email);

        if (existingUser) {
            // Update existing user
            await dbAdapter.updateUser(existingUser.id, {
                name: name || existingUser.name,
                avatar_url: avatar_url || existingUser.avatar_url,
                // Don't overwrite role if not provided or restricted
            });
            // Return updated user
            const updated = await dbAdapter.findUserByEmail(email);
            return res.json({ message: 'Profile synced', user: updated });
        } else {
            // Create new user (Role defaults to 'user' if not specified, but usually first user is admin? 
            // In sync flow, we assume invite flow created them OR they signed up. 
            // If they signed up via Supabase directly, we create them here.)

            // Note: In strict mode, we might want to ONLY allow invited users.
            // But for now, let's allow JIT creation for authenticated users.
            const newUser = {
                id: id, // Use Supabase ID
                email,
                name: name || 'New User',
                password_hash: 'SUPABASE_AUTH', // Placeholder
                role: 'user', // Default role
                status: 'Active',
                avatar_url
            };

            await dbAdapter.createUser(newUser);
            return res.status(201).json({ message: 'User created via sync', user: newUser });
        }
    } catch (error) {
        console.error('Sync Profile Error:', error);
        res.status(500).json({ error: error.message });
    }
};

// NOTE: login and register functions have been removed.
// Authentication is now handled by Supabase Auth on the frontend.
// Users sign in directly with Supabase using the SDK in AuthContext.jsx
//
// The inviteUser function above is still used for admin-initiated user invitations.
// TODO: Update inviteUser to use Supabase Admin API to create auth users programmatically.
