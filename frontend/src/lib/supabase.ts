import { createClient } from '@supabase/supabase-js';

// Prefer CRA env vars; fall back to runtime window.ENV injection if present
const runtimeEnv: Record<string, string | undefined> = (typeof window !== 'undefined' && (window as any).ENV) || {};

const supabaseUrl =
  process.env.REACT_APP_SUPABASE_URL ||
  (runtimeEnv.REACT_APP_SUPABASE_URL as string | undefined) ||
  (runtimeEnv.VITE_SUPABASE_URL as string | undefined) ||
  '';

const supabaseKey =
  process.env.REACT_APP_SUPABASE_ANON_KEY ||
  (runtimeEnv.REACT_APP_SUPABASE_ANON_KEY as string | undefined) ||
  (runtimeEnv.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  '';

if (!supabaseUrl || !supabaseKey) {
  // eslint-disable-next-line no-console
  console.warn(
    'Supabase env vars are missing. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY (or inject window.ENV).'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

