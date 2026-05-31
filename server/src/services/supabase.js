import { createClient } from '@supabase/supabase-js';

const tableName = process.env.SUPABASE_TABLE || 'transcriptions';
let client;

function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    const error = new Error('Supabase credentials are not configured.');
    error.status = 500;
    throw error;
  }

  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    );
  }

  return client;
}

export async function insertTranscription(payload) {
  const { data, error } = await getSupabase()
    .from(tableName)
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    const requestError = new Error(`Could not save transcription: ${error.message}`);
    requestError.status = 500;
    throw requestError;
  }

  return data;
}

export async function listTranscriptions() {
  const { data, error } = await getSupabase()
    .from(tableName)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    const requestError = new Error(`Could not load transcriptions: ${error.message}`);
    requestError.status = 500;
    throw requestError;
  }

  return data;
}
