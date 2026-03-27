import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://etxzzkyqhmtqfuyodoea.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0eHp6a3lxaG10cWZ1eW9kb2VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4NTU4MTgsImV4cCI6MjA4ODQzMTgxOH0.WlCpC5BLn0IpoJiZiXOt8bkfDu9Cv_kLr9qy_HwbI6M';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  const { data, error } = await supabase.from('skills').insert({
    name: "Test Skill " + Date.now(),
    domain: "software",
    description: "Testing permissions"
  }).select();
  
  if (error) {
    console.error("FAIL:", error.message, error.code);
  } else {
    console.log("SUCCESS:", data);
  }
}

testInsert();
