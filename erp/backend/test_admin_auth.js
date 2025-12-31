
import { supabaseAdmin } from './supabaseClient.js';

const testEmail = `test_admin_${Date.now()}@example.com`;
const testPassword = 'TestPassword123!';

async function testAdminCreation() {
    console.log('Testing Supabase Admin User Creation...');
    console.log('Email:', testEmail);

    if (!supabaseAdmin) {
        console.error('❌ supabaseAdmin is null. Check environment variables and service role key.');
        return;
    }

    try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: testEmail,
            password: testPassword,
            email_confirm: true,
            user_metadata: { name: 'Test User' }
        });

        if (error) {
            console.error('❌ Creation Failed:', error.message);
        } else {
            console.log('✅ User Created Successfully:', data.user.id);
            console.log('User Confirmed At:', data.user.email_confirmed_at);

            if (data.user.email_confirmed_at) {
                console.log('✅ PASS: User is confirmed.');
            } else {
                console.error('❌ FAIL: User created but NOT confirmed.');
            }

            // Cleanup
            console.log('Cleaning up...');
            await supabaseAdmin.auth.admin.deleteUser(data.user.id);
            console.log('Test user deleted.');
        }

    } catch (err) {
        console.error('❌ Unexpected Error:', err);
    }
}

testAdminCreation();
