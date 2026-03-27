import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://amcqvhreqtlplrvrfwnb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY3F2aHJlcXRscGxydnJmd25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMzU5MTIsImV4cCI6MjA4ODYxMTkxMn0.mqlNeUEaIdUPvTuVQ0QoPQt29XqNv6RbkTIgjDOjaA0";
const supabase = createClient(supabaseUrl, supabaseKey);

async function listReal() {
  const { data, error } = await supabase.from('skills').select('*');
  if (error) {
    console.error(error);
    return;
  }
  console.log(`Total skills: ${data.length}`);
  data.forEach(s => console.log(`- ${s.name} (${s.domain}) : ID ${s.id}`));
}

listReal();
