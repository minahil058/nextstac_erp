
import supabase from './supabaseClient.js';

const emailToDelete = 'sabhiahm12@gmail.com';

async function deleteUser() {
    console.log(`Attempting to delete ${emailToDelete} from Supabase...`);

    if (!supabase) {
        console.error('Supabase client not initialized. Check .env variables.');
        return;
    }

    const { data: users, error: searchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', emailToDelete);

    if (searchError) {
        console.error('Error finding user:', searchError.message);
        return;
    }

    if (!users || users.length === 0) {
        console.log('User not found in Supabase.');
        return;
    }

    console.log(`Found ${users.length} user(s). Deleting...`);

    for (const user of users) {
        const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', user.id);

        if (deleteError) {
            console.error(`Failed to delete user ID ${user.id}:`, deleteError.message);
        } else {
            console.log(`Successfully deleted user ID ${user.id}`);
        }
    }
}

deleteUser();
