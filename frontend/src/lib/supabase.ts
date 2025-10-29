import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hgwjlrnprtfhsbfhceuw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhnd2pscm5wcnRmaHNiZmhjZXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjEwMzksImV4cCI6MjA3NzIzNzAzOX0.oAJCBRMDjubKtv9VMRk-Fr1agDR_vMlmdBxKEUD47eE';

export const supabase = createClient(supabaseUrl, supabaseKey);

