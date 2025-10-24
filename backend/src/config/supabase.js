/**
 * Supabase Configuration for Backend
 */

const { createClient } = require('@supabase/supabase-js');

let supabase = null;
let supabaseAdmin = null;

/**
 * Initialize Supabase clients
 */
const initializeSupabase = () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.warn('⚠️  Supabase environment variables not found. Please configure Supabase to use database features.');
      console.warn('   See SUPABASE_SETUP_GUIDE.md for setup instructions.');
      return; // Don't throw error, just warn and continue
    }

    // Client for regular operations (with RLS)
    supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Admin client for server-side operations (bypasses RLS)
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    console.log('✅ Supabase initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Supabase:', error);
    throw error;
  }
};

/**
 * Get Supabase client (with RLS)
 */
const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase not initialized. Please configure Supabase environment variables.');
  }
  return supabase;
};

/**
 * Get Supabase admin client (bypasses RLS)
 */
const getSupabaseAdmin = () => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin not initialized. Please configure Supabase environment variables.');
  }
  return supabaseAdmin;
};

/**
 * Test Supabase connection
 */
const testSupabaseConnection = async () => {
  try {
    if (!supabaseAdmin) {
      return {
        success: false,
        message: 'Supabase not configured. Please set up environment variables.',
        error: 'Missing Supabase configuration'
      };
    }

    const admin = getSupabaseAdmin();
    const { data, error } = await admin
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Supabase connection successful',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return {
      success: false,
      message: 'Supabase connection failed',
      error: error.message
    };
  }
};

module.exports = {
  initializeSupabase,
  getSupabase,
  getSupabaseAdmin,
  testSupabaseConnection
};
