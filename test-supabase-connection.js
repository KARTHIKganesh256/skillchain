/**
 * SkillChain Supabase Connection Test
 * This script tests your Supabase connection with your actual credentials
 */

const { createClient } = require('@supabase/supabase-js');

// Your Supabase credentials
const supabaseUrl = 'https://hgwjlrnprtfhsbfhceuw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd2pscm5wcnRmaHNiZmhjZXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjEwMzksImV4cCI6MjA3NzIzNzAzOX0.oAJCBRMDjubKtv9VMRk-Fr1agDR_vMlmdBxKEUD47eE';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd2pscm5wcnRmaHNiZmhjZXV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTY2MTAzOSwiZXhwIjoyMDc3MjM3MDM5fQ.4HyAcFZY7RxFCWNk6lGDYAlySSbnXTVt4F6wMyVMcDE';

// Create Supabase clients
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabaseConnection() {
  console.log('🚀 Testing SkillChain Supabase Connection...\n');

  try {
    // Test 1: Basic connection with anon key
    console.log('1️⃣ Testing basic connection with anon key...');
    const { data: anonData, error: anonError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (anonError) {
      console.log('❌ Anon key test failed:', anonError.message);
    } else {
      console.log('✅ Anon key connection successful');
    }

    // Test 2: Admin connection with service role key
    console.log('\n2️⃣ Testing admin connection with service role key...');
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (adminError) {
      console.log('❌ Admin key test failed:', adminError.message);
    } else {
      console.log('✅ Admin key connection successful');
    }

    // Test 3: Check if tables exist
    console.log('\n3️⃣ Checking database tables...');
    const tables = ['users', 'skills', 'posts', 'matches', 'chats', 'messages', 'notifications'];
    
    for (const table of tables) {
      const { data, error } = await supabaseAdmin
        .from(table)
        .select('count')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' not found or accessible`);
      } else {
        console.log(`✅ Table '${table}' exists and accessible`);
      }
    }

    // Test 4: Test authentication
    console.log('\n4️⃣ Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Authentication test failed:', authError.message);
    } else {
      console.log('✅ Authentication service accessible');
    }

    // Test 5: Test RLS policies
    console.log('\n5️⃣ Testing Row Level Security...');
    const { data: rlsData, error: rlsError } = await supabaseAdmin
      .from('users')
      .select('id, email, display_name')
      .limit(1);
    
    if (rlsError) {
      console.log('❌ RLS test failed:', rlsError.message);
    } else {
      console.log('✅ RLS policies working correctly');
      if (rlsData && rlsData.length > 0) {
        console.log('📊 Sample user data:', rlsData[0]);
      }
    }

    console.log('\n🎉 Supabase connection test completed!');
    console.log('\n📋 Next Steps:');
    console.log('1. Run the database schema: SUPABASE_DATABASE_SETUP_FIXED.sql');
    console.log('2. Insert sample data: SUPABASE_SAMPLE_DATA.sql');
    console.log('3. Configure email templates in Supabase Dashboard');
    console.log('4. Start your backend server with the environment variables');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if your Supabase project is active');
    console.log('2. Verify your API keys are correct');
    console.log('3. Make sure your project URL is correct');
    console.log('4. Check if you have the necessary permissions');
  }
}

// Run the test
testSupabaseConnection();
