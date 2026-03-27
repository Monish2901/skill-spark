export interface SkillData {
  name: string;
  domain: string;
  description: string;
  icon: string;
  totalLevels?: number;
}

export const NEW_SKILLS_DATA: SkillData[] = [
  { name: 'JavaScript', domain: 'software', description: 'Modern web development with JavaScript', icon: 'layout' },
  { name: 'React', domain: 'software', description: 'Building user interfaces with React', icon: 'layers' },
  { name: 'SQL', domain: 'software', description: 'Relational database querying and design', icon: 'database' },
  { name: 'Node.js', domain: 'software', description: 'Server-side development with Node.js', icon: 'server' },
  { name: 'C++', domain: 'software', description: 'Object-oriented systems programming with C++', icon: 'terminal' },
  { name: 'Robotics', domain: 'hardware', description: 'Design and control of robotic systems', icon: 'bot' },
  { name: 'VLSI', domain: 'hardware', description: 'Very Large Scale Integration circuit design', icon: 'cpu' },
  { name: 'Computer Architecture', domain: 'hardware', description: 'Understanding computer organization and design', icon: 'hard-drive' },
  { name: 'PCB Design', domain: 'hardware', description: 'Printed Circuit Board design and layout', icon: 'circuit-board' },
  { name: 'OOPS', domain: 'software', description: 'Object-Oriented Programming System concepts', icon: 'binary' },
  { name: 'General Knowledge (GK)', domain: 'common', description: 'Basic general knowledge and awareness', icon: 'globe' },
  { name: 'Aptitude', domain: 'common', description: 'Quantitative and logical aptitude', icon: 'brain' },
  { name: 'Communication Skills', domain: 'common', description: 'Professional communication and reading comprehension', icon: 'message-square', totalLevels: 1 }
];

export const getVirtualId = (name: string) => `virtual-${name.toLowerCase().replace(/\s+/g, '-')}`;

export const getSkillByName = (name: string) => 
  NEW_SKILLS_DATA.find(s => s.name.toLowerCase() === name.toLowerCase());

export const getSkillByVirtualId = (id: string) => {
  if (!id.startsWith('virtual-')) return null;
  const name = id.replace('virtual-', '').replace(/-/g, ' ');
  return getSkillByName(name);
};
export const SKILLS_VERSION = '1.0.1';
