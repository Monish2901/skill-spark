
-- Add more skills
INSERT INTO public.skills (name, domain, description, icon) VALUES
('JavaScript', 'software', 'Modern web development with JavaScript', 'layout'),
('React', 'software', 'Building user interfaces with React', 'layers'),
('SQL', 'software', 'Relational database querying and design', 'database'),
('Node.js', 'software', 'Server-side development with Node.js', 'server'),
('C++', 'software', 'Object-oriented systems programming with C++', 'terminal'),
('Robotics', 'hardware', 'Design and control of robotic systems', 'bot'),
('VLSI', 'hardware', 'Very Large Scale Integration circuit design', 'cpu'),
('Computer Architecture', 'hardware', 'Understanding computer organization and design', 'hard-drive'),
('PCB Design', 'hardware', 'Printed Circuit Board design and layout', 'circuit-board');

-- Add basic level 1 questions for new skills
DO $$
DECLARE
  v_skill_id UUID;
BEGIN
  -- JavaScript
  SELECT id INTO v_skill_id FROM public.skills WHERE name = 'JavaScript';
  INSERT INTO public.questions (skill_id, level, question_text, question_type, options, correct_answer, marks) VALUES
  (v_skill_id, 1, 'Which keyword is used to declare a block-scoped variable?', 'mcq', '[{"text":"var","is_correct":false},{"text":"let","is_correct":true},{"text":"const","is_correct":false},{"text":"both let and const","is_correct":false}]', 'let', 1),
  (v_skill_id, 1, 'What is the correct way to write an arrow function?', 'mcq', '[{"text":"() => {}","is_correct":true},{"text":"function => {}","is_correct":false},{"text":"=> () {}","is_correct":false},{"text":"arrow function()","is_correct":false}]', '() => {}', 1);

  -- React
  SELECT id INTO v_skill_id FROM public.skills WHERE name = 'React';
  INSERT INTO public.questions (skill_id, level, question_text, question_type, options, correct_answer, marks) VALUES
  (v_skill_id, 1, 'What is the virtual DOM?', 'mcq', '[{"text":"A copy of the real DOM kept in memory","is_correct":true},{"text":"A direct reference to HTML","is_correct":false},{"text":"A server-side cache","is_correct":false},{"text":"A CSS preprocessor","is_correct":false}]', 'A copy of the real DOM kept in memory', 1),
  (v_skill_id, 1, 'Which hook is used for side effects in functional components?', 'mcq', '[{"text":"useEffect","is_correct":true},{"text":"useState","is_correct":false},{"text":"useContext","is_correct":false},{"text":"useReducer","is_correct":false}]', 'useEffect', 1);

  -- SQL
  SELECT id INTO v_skill_id FROM public.skills WHERE name = 'SQL';
  INSERT INTO public.questions (skill_id, level, question_text, question_type, options, correct_answer, marks) VALUES
  (v_skill_id, 1, 'Which clause is used to filter records?', 'mcq', '[{"text":"WHERE","is_correct":true},{"text":"ORDER BY","is_correct":false},{"text":"GROUP BY","is_correct":false},{"text":"SELECT","is_correct":false}]', 'WHERE', 1),
  (v_skill_id, 1, 'What does SQL stand for?', 'mcq', '[{"text":"Structured Query Language","is_correct":true},{"text":"Simple Query Language","is_correct":false},{"text":"Strong Question Language","is_correct":false},{"text":"Sequential Query Language","is_correct":false}]', 'Structured Query Language', 1);

  -- Node.js
  SELECT id INTO v_skill_id FROM public.skills WHERE name = 'Node.js';
  INSERT INTO public.questions (skill_id, level, question_text, question_type, options, correct_answer, marks) VALUES
  (v_skill_id, 1, 'What is npm?', 'mcq', '[{"text":"Node Package Manager","is_correct":true},{"text":"Network Process Monitor","is_correct":false},{"text":"New Program Module","is_correct":false},{"text":"Node Power Management","is_correct":false}]', 'Node Package Manager', 1),
  (v_skill_id, 1, 'Which module is used to create a web server?', 'mcq', '[{"text":"http","is_correct":true},{"text":"fs","is_correct":false},{"text":"path","is_correct":false},{"text":"os","is_correct":false}]', 'http', 1);

  -- C++
  SELECT id INTO v_skill_id FROM public.skills WHERE name = 'C++';
  INSERT INTO public.questions (skill_id, level, question_text, question_type, options, correct_answer, marks) VALUES
  (v_skill_id, 1, 'Which operator is used for dynamic memory allocation?', 'mcq', '[{"text":"new","is_correct":true},{"text":"malloc","is_correct":false},{"text":"alloc","is_correct":false},{"text":"create","is_correct":false}]', 'new', 1),
  (v_skill_id, 1, 'Who created C++?', 'mcq', '[{"text":"Bjarne Stroustrup","is_correct":true},{"text":"Dennis Ritchie","is_correct":false},{"text":"James Gosling","is_correct":false},{"text":"Guido van Rossum","is_correct":false}]', 'Bjarne Stroustrup', 1);

  -- Robotics
  SELECT id INTO v_skill_id FROM public.skills WHERE name = 'Robotics';
  INSERT INTO public.questions (skill_id, level, question_text, question_type, options, correct_answer, marks) VALUES
  (v_skill_id, 1, 'What does an actuator do?', 'mcq', '[{"text":"Converts energy into motion","is_correct":true},{"text":"Senses light","is_correct":false},{"text":"Calculates paths","is_correct":false},{"text":"Powers the battery","is_correct":false}]', 'Converts energy into motion', 1),
  (v_skill_id, 1, 'Which sensor is used to measure distance?', 'mcq', '[{"text":"Ultrasonic sensor","is_correct":true},{"text":"LDR","is_correct":false},{"text":"Thermistor","is_correct":false},{"text":"Potentiometer","is_correct":false}]', 'Ultrasonic sensor', 1);

  -- VLSI
  SELECT id INTO v_skill_id FROM public.skills WHERE name = 'VLSI';
  INSERT INTO public.questions (skill_id, level, question_text, question_type, options, correct_answer, marks) VALUES
  (v_skill_id, 1, 'What does VLSI stand for?', 'mcq', '[{"text":"Very Large Scale Integration","is_correct":true},{"text":"Video Logic System Interface","is_correct":false},{"text":"Vertical Layer Signal Input","is_correct":false},{"text":"Variable Local System Integration","is_correct":false}]', 'Very Large Scale Integration', 1),
  (v_skill_id, 1, 'Which material is primarily used for semiconductors?', 'mcq', '[{"text":"Silicon","is_correct":true},{"text":"Copper","is_correct":false},{"text":"Aluminum","is_correct":false},{"text":"Iron","is_correct":false}]', 'Silicon', 1);

  -- Computer Architecture
  SELECT id INTO v_skill_id FROM public.skills WHERE name = 'Computer Architecture';
  INSERT INTO public.questions (skill_id, level, question_text, question_type, options, correct_answer, marks) VALUES
  (v_skill_id, 1, 'What is the purpose of a cache?', 'mcq', '[{"text":"Fast memory to store frequently accessed data","is_correct":true},{"text":"Permanent storage","is_correct":false},{"text":"Network buffer","is_correct":false},{"text":"Input device","is_correct":false}]', 'Fast memory to store frequently accessed data', 1),
  (v_skill_id, 1, 'What does CPU stand for?', 'mcq', '[{"text":"Central Processing Unit","is_correct":true},{"text":"Computer Personal Unit","is_correct":false},{"text":"Core Process Utility","is_correct":false},{"text":"Central Power Unit","is_correct":false}]', 'Central Processing Unit', 1);

  -- PCB Design
  SELECT id INTO v_skill_id FROM public.skills WHERE name = 'PCB Design';
  INSERT INTO public.questions (skill_id, level, question_text, question_type, options, correct_answer, marks) VALUES
  (v_skill_id, 1, 'What is a via in PCB design?', 'mcq', '[{"text":"A hole that connects different layers","is_correct":true},{"text":"A type of resistor","is_correct":false},{"text":"A power source","is_correct":false},{"text":"A soldering technique","is_correct":false}]', 'A hole that connects different layers', 1),
  (v_skill_id, 1, 'Which software is commonly used for PCB design?', 'mcq', '[{"text":"Altium Designer","is_correct":true},{"text":"Photoshop","is_correct":false},{"text":"Excel","is_correct":false},{"text":"Visual Studio Code","is_correct":false}]', 'Altium Designer', 1);

END $$;
