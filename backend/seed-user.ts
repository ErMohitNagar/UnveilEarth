import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedTestUser() {
  const email = 'testuser3@example.com';
  const password = 'password123';
  const name = 'Test User 3';

  console.log(`Creating test user: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name }
  });

  if (error) {
    if (error.message.includes("already registered")) {
        console.log(`User ${email} already exists! You can log in with password: ${password}`);
    } else {
        console.error("Error creating user:", error.message);
    }
  } else {
    console.log("Success! Test user created in Supabase Auth.");
    
    // Sync to public.users table
    const { error: syncError } = await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        display_name: name
    });

    if (syncError) {
        console.error("Error syncing to public.users:", syncError.message);
    } else {
        console.log("Success! User synced to custom database table.");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`User ID: ${data.user.id}`);
    }
  }
}

seedTestUser();
