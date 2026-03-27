import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://etxzzkyqhmtqfuyodoea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0eHp6a3lxaG10cWZ1eW9kb2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTU4MTgsImV4cCI6MjA4ODQzMTgxOH0.WlCpC5BLn0IpoJiZiXOt8bkfDu9Cv_kLr9qy_HwbI6M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: skills, error } = await supabase.from('skills').select('*');
  fs.writeFileSync('output.json', JSON.stringify(skills, null, 2), 'utf-8');
  console.log('Saved to output.json');
  if (error) console.error('Error fetching skills:', error);
}

check();
