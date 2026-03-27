import { type SampleQuestion } from "./sample-questions";

export const communicationPassage = `Effective communication is the cornerstone of any successful organization. It involves not just the transmission of information, but also the mutual understanding between the sender and the receiver. In a modern workplace, messages are conveyed through various channels: emails, instant messaging, video calls, and face-to-face meetings. However, the abundance of digital tools has also introduced new challenges, such as information overload and the potential for misinterpretation due to the lack of non-verbal cues. To communicate effectively, one must consider the audience, choose the appropriate medium, and ensure that the message is clear, concise, and professional. Feedback plays a crucial role in closing the communication loop, allowing for clarification and ensuring that the intended meaning was accurately received. Furthermore, active listening is as important as speaking, as it fosters empathy and strengthens professional relationships. When conflicts arise, transparent and respectful dialogue is often the most efficient path to resolution. Ultimately, consistent and high-quality communication builds trust, enhances productivity, and creates a positive organizational culture.`;

export const communicationL1: SampleQuestion[] = [
  // 10 Content Questions
  {
    question_text: "What is described as the cornerstone of any successful organization in the passage?",
    options: [
      { text: "Digital tools", is_correct: false },
      { text: "Effective communication", is_correct: true },
      { text: "Financial management", is_correct: false },
      { text: "Hierarchical structure", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "According to the passage, communication involves transmission of information and what else?",
    options: [
      { text: "Rapid speed", is_correct: false },
      { text: "Mutual understanding", is_correct: true },
      { text: "Complex vocabulary", is_correct: false },
      { text: "One-way delivery", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "Which of the following is NOT mentioned as a communication channel in the workplace?",
    options: [
      { text: "Video calls", is_correct: false },
      { text: "Social media posts", is_correct: true },
      { text: "Instant messaging", is_correct: false },
      { text: "Emails", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "What challenge has been introduced by the abundance of digital tools?",
    options: [
      { text: "Information overload", is_correct: true },
      { text: "Decreased electricity usage", is_correct: false },
      { text: "Improved handwriting", is_correct: false },
      { text: "Reduced office space", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "Why can digital communication lead to misinterpretation?",
    options: [
      { text: "Because screens are too small", is_correct: false },
      { text: "Due to a lack of non-verbal cues", is_correct: true },
      { text: "Because typing is slower than speaking", is_correct: false },
      { text: "Due to high internet costs", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "What three things must one consider to communicate effectively?",
    options: [
      { text: "Audience, medium, and clarity", is_correct: true },
      { text: "Speed, volume, and cost", is_correct: false },
      { text: "Grammar, spelling, and font size", is_correct: false },
      { text: "Time, place, and weather", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "What is the role of feedback in communication?",
    options: [
      { text: "To delay the process", is_correct: false },
      { text: "To close the communication loop", is_correct: true },
      { text: "To prove the sender wrong", is_correct: false },
      { text: "To generate more emails", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "Why is active listening considered as important as speaking?",
    options: [
      { text: "It saves energy", is_correct: false },
      { text: "It fosters empathy and strengthens relationships", is_correct: true },
      { text: "It is required by law", is_correct: false },
      { text: "It prevents one-way conversations", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "What is recommended for resolving conflicts when they arise?",
    options: [
      { text: "Silent treatment", is_correct: false },
      { text: "Transparent and respectful dialogue", is_correct: true },
      { text: "Escalating to management immediately", is_correct: false },
      { text: "Ignoring the issue", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "What are the ultimate benefits of consistent high-quality communication mentioned in the last sentence?",
    options: [
      { text: "Higher stock prices", is_correct: false },
      { text: "Trust, productivity, and a positive culture", is_correct: true },
      { text: "Fewer meetings", is_correct: false },
      { text: "Better office furniture", is_correct: false }
    ],
    marks: 1
  },
  // 5 Grammar Questions
  {
    question_text: "In the sentence 'It involves not just the transmission...', what part of speech is 'involves'?",
    options: [
      { text: "Noun", is_correct: false },
      { text: "Verb", is_correct: true },
      { text: "Adjective", is_correct: false },
      { text: "Adverb", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "Identify the conjunction in: 'However, the abundance of digital tools has also introduced new challenges...'",
    options: [
      { text: "However", is_correct: true },
      { text: "Abundance", is_correct: false },
      { text: "Digital", is_correct: false },
      { text: "Introduced", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "What is the subject of the sentence: 'Active listening is as important as speaking'?",
    options: [
      { text: "Speaking", is_correct: false },
      { text: "Active listening", is_correct: true },
      { text: "Important", is_correct: false },
      { text: "Listening", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "In the phrase 'transparent and respectful dialogue', what are 'transparent' and 'respectful'?",
    options: [
      { text: "Nouns", is_correct: false },
      { text: "Verbs", is_correct: false },
      { text: "Adjectives", is_correct: true },
      { text: "Pronouns", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "Which tense is primarily used in the passage?",
    options: [
      { text: "Simple Present", is_correct: true },
      { text: "Past Perfect", is_correct: false },
      { text: "Future Continuous", is_correct: false },
      { text: "Present Perfect", is_correct: false }
    ],
    marks: 1
  },
  // 5 Synonyms and Antonyms
  {
    question_text: "What is a synonym for 'cornerstone' as used in the passage?",
    options: [
      { text: "Foundation", is_correct: true },
      { text: "Decoration", is_correct: false },
      { text: "Obstacle", is_correct: false },
      { text: "Ending", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "What is the antonym of 'misinterpretation'?",
    options: [
      { text: "Confusion", is_correct: false },
      { text: "Understanding", is_correct: true },
      { text: "Translation", is_correct: false },
      { text: "Distortion", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "Which word used in the passage is a synonym for 'essential'?",
    options: [
      { text: "Crucial", is_correct: true },
      { text: "Digital", is_correct: false },
      { text: "Instant", is_correct: false },
      { text: "Various", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "What is an antonym for 'transparent' in a professional context?",
    options: [
      { text: "Clear", is_correct: false },
      { text: "Opaque", is_correct: true },
      { text: "Honest", is_correct: false },
      { text: "Visible", is_correct: false }
    ],
    marks: 1
  },
  {
    question_text: "Choose the synonym for 'empathy' based on the context of professional relationships.",
    options: [
      { text: "Apathy", is_correct: false },
      { text: "Sympathy/Understanding", is_correct: true },
      { text: "Hostility", is_correct: false },
      { text: "Efficiency", is_correct: false }
    ],
    marks: 1
  }
];
