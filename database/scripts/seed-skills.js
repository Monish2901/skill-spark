import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from root
const envPath = join(__dirname, '..', '.env')
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath))
    for (const k in envConfig) {
        process.env[k] = envConfig[k]
    }
}

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY // Note: Usually need service_role for inserts if RLS is on, but maybe anon works if allowed

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
    console.log('Seeding skills...')

    const newSkills = [
        { name: 'JavaScript', domain: 'software', description: 'Modern web development with JavaScript', icon: 'Layout' },
        { name: 'React', domain: 'software', description: 'Component-based UI development', icon: 'Layers' },
        { name: 'SQL', domain: 'software', description: 'Relational database management', icon: 'Database' },
        { name: 'Node.js', domain: 'software', description: 'Server-side JavaScript runtime', icon: 'Server' },
        { name: 'C++', domain: 'software', description: 'High-performance systems programming', icon: 'Terminal' },
        { name: 'Robotics', domain: 'hardware', description: 'Design and control of robotic systems', icon: 'Bot' },
        { name: 'VLSI', domain: 'hardware', description: 'Very Large Scale Integration design', icon: 'Cpu' },
        { name: 'Computer Architecture', domain: 'hardware', description: 'Design of computer systems and hardware', icon: 'HardDrive' },
        { name: 'PCB Design', domain: 'hardware', description: 'Printed Circuit Board layout and design', icon: 'CircuitBoard' }
    ]

    for (const skill of newSkills) {
        const { data, error } = await supabase
            .from('skills')
            .upsert(skill, { onConflict: 'name' })
            .select()

        if (error) {
            console.error(`Error adding ${skill.name}:`, error.message)
        } else {
            console.log(`Successfully added/updated: ${skill.name}`)
        }
    }

    console.log('Seeding complete!')
}

seed()
