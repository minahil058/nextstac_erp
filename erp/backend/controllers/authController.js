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
                console.log('Resending invitation to (and updating):', email);

                // UPDATE the existing invite with new Role/Dept if changed
                let finalDepartment = department;
                if (!finalDepartment) {
                    if (role === 'ecommerce_admin') finalDepartment = 'E-commerce';
                    if (role === 'dev_admin') finalDepartment = 'Web Development';
                }

                await dbAdapter.updateUser(row.id, {
                    role: role,
                    department: finalDepartment,
                    name: name || row.name
                });

                return sendInvitationEmail(email, role, row.id, row.status);
            }
            return res.status(400).json({ error: 'User with this email already exists and is active.' });
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

// NOTE: login and register functions have been removed.
// Authentication is now handled by Supabase Auth on the frontend.
// Users sign in directly with Supabase using the SDK in AuthContext.jsx
//
// The inviteUser function above is still used for admin-initiated user invitations.

export const syncProfile = async (req, res) => {
    // req.user and req.userId came from verifySupabaseToken middleware
    const authId = req.userId;
    const authEmail = req.userEmail;

    // Optional: Allow client to pass specific role if creating BRAND NEW user (not invited)
    // But for invited users, we ignore this and use what's in DB.
    const { name, role: requestedRole } = req.body;

    console.log(`Syncing profile for: ${authEmail} (Auth ID: ${authId})`);

    try {
        // 1. Check if there is an existing "Invited" profile for this email with a DIFFERENT ID?
        // Or any profile.
        const existingProfile = await dbAdapter.findUserByEmail(authEmail);

        if (existingProfile) {
            console.log('Found existing profile:', existingProfile);

            // Case A: User was invited (Status = Invited)
            // They have a placeholder ID in the table. We need to swap it for the real Auth ID.
            if (existingProfile.status === 'Invited' || existingProfile.id !== authId) {
                console.log('Migrating invited user to active status...');

                // 1. Delete the old placeholder row
                await dbAdapter.deleteUser(existingProfile.id);

                // 2. Insert the new row with correct Auth ID and preserved details
                const newProfile = {
                    id: authId,
                    email: authEmail,
                    name: existingProfile.name || name || 'User',
                    role: existingProfile.role, // PERMANENTLY KEEP ASSIGNED ROLE
                    department: existingProfile.department, // KEEP ASSIGNED DEPT
                    status: 'Active',
                    password_hash: 'supabased',
                    created_at: new Date().toISOString()
                };

                await dbAdapter.createUser(newProfile);

                return res.status(200).json({
                    success: true,
                    message: 'Profile synchronized and activated',
                    user: newProfile
                });
            } else {
                // Case B: User already exists with correct ID? Maybe just ensure active?
                if (existingProfile.status !== 'Active') {
                    await dbAdapter.updateUser(authId, { status: 'Active' });
                }
                return res.status(200).json({ success: true, user: existingProfile });
            }
        } else {
            // Case C: New User (Self Signup without invite?)
            // If self-signup is allowed.
            // CAUTION: We probably don't want random people becoming admins.
            // Default to 'user' role or requested role if safe? 
            // For now, let's allow it but force role='user' unless maybe locally.
            // Wait, we removed public signup. Only invited users should usually get here.
            // But if they clicked "Signup" on login page (which we hid/removed)... 

            console.log('Creating new user profile...');
            const newProfile = {
                id: authId,
                email: authEmail,
                name: name || 'New User',
                role: 'user', // Default to basic user, NOT SUPER ADMIN
                department: null,
                status: 'Active',
                password_hash: 'supabased',
                created_at: new Date().toISOString()
            };

            await dbAdapter.createUser(newProfile);

            return res.status(201).json({
                success: true,
                message: 'New profile created',
                user: newProfile
            });
        }

    } catch (error) {
        console.error('Sync Profile Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
