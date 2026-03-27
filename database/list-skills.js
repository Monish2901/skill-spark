import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etxzzkyqhmtqfuyodoea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0eHp6a3lxaG10cWZ1eW9kb2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTU4MTgsImV4cCI6MjA4ODQzMTgxOH0.WlCpC5BLn0IpoJiZiXOt8bkfDu9Cv_kLr9qy_HwbI6M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listAll() {
  const { data, error } = await supabase.from('skills').select('*');
  if (error) {
    console.error(error);
    return;
  }
  console.log(`Total skills in DB: ${data.length}`);
  data.forEach(s => {
    console.log(`- ${s.name} (${s.domain})`);
  });
}

listAll();
