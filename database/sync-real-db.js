import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://amcqvhreqtlplrvrfwnb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY3F2aHJlcXRscGxydnJmd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMzU5MTIsImV4cCI6MjA4ODYxMTkxMn0.mqlNeUEaIdUPvTuVQ0QoPQt29XqNv6RbkTIgjDOjaA0";
const supabase = createClient(supabaseUrl, supabaseKey);

async function syncAll() {
  const skillsToSync = [
    { name: 'JavaScript', domain: 'software' },
    { name: 'React', domain: 'software' },
    { name: 'SQL', domain: 'software' },
    { name: 'Node.js', domain: 'software' },
    { name: 'C++', domain: 'software' },
    { name: 'OOPS', domain: 'software' },
    { name: 'Robotics', domain: 'hardware' },
    { name: 'VLSI', domain: 'hardware' },
    { name: 'Computer Architecture', domain: 'hardware' },
    { name: 'PCB Design', domain: 'hardware' },
    { name: 'General Knowledge (GK)', domain: 'common' },
    { name: 'Aptitude', domain: 'common' },
    { name: 'Communication Skills', domain: 'common', description: 'Professional communication and reading comprehension', icon: 'message-square' }
  ];

  for (const s of skillsToSync) {
    console.log(`Syncing ${s.name}...`);
    const { data, error } = await supabase.from('skills').upsert(s, { onConflict: 'name' }).select();
    if (error) console.error(`  FAIL ${s.name}: ${error.message}`);
    else console.log(`  SUCCESS ${s.name}`);
  }
}

syncAll();
