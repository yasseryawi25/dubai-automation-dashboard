const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://supabase.yasta.online';
const SUPABASE_ANON_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc1MTM4NDIyMCwiZXhwIjo0OTA3MDU3ODIwLCJyb2xlIjoiYW5vbiJ9.1qnOwvVZNzuXRwvRdsWHHMoSTuIUSKGX3yIjFBmaDXc';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testLeadsTable() {
  try {
    console.log('Querying leads table...');
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(5);
    console.log('Query complete.');
    if (error) {
      console.error('Error fetching leads:', error);
    } else {
      console.log('Leads data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testLeadsTable(); 