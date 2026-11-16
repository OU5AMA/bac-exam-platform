import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
    id: 'reading-small-actions-sen', slug: '2bac-small-actions-big-changes-sen', title: 'Small Actions, Big Changes',
    level: '2BAC English · Adapted practice', unit: 'Unit 1 — The Gifts of Youth', version: 'sen',
    versionLabel: 'SEN – Adapted Version', description: 'Practise reading comprehension with a shorter text, simpler questions, and accessible instructions.',
    duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace',
    passage: [
      'Salma is a 17-year-old student. She believes that young people have many gifts, such as creativity, energy, and ambition. She thinks that they can use these gifts to help others.',
      'One day, Salma decided to organize a campaign to clean her neighbourhood. At first, she was worried because she thought her classmates would not help. However, <strong>she</strong> invited her friends, and they agreed to join her.',
      'Salma made a simple timetable and divided the tasks. Her friend Hamza designed posters to invite more students. <strong>They</strong> worked together and helped each other. Although they faced some problems, they did not give up.',
      'At the end of the campaign, the neighbourhood was cleaner. The students felt proud and happy. They learned important life skills, such as teamwork, responsibility, and cooperation.',
      'Salma believes that young people should take action. Even small actions can make a big difference.',
    ],
    sections: [
      { id: 'a', title: 'Section A · Answer the questions', instructions: 'Read the text. Answer with a word or a short phrase.', questions: [
        { id: 'sa-sen-a1', prompt: 'How old is Salma?', marks: 1, type: 'short' },
        { id: 'sa-sen-a2', prompt: 'What campaign did Salma organize?', marks: 1, type: 'short' },
        { id: 'sa-sen-a3', prompt: 'What did Hamza do?', marks: 1, type: 'short' },
        { id: 'sa-sen-a4', prompt: 'How did the students feel at the end?', marks: 1, type: 'short' },
      ] },
      { id: 'b', title: 'Section B · True or False', instructions: 'Choose True or False.', questions: [
        { id: 'sa-sen-b1', prompt: 'Salma organized a campaign to clean her neighbourhood.', marks: 1, type: 'true-false' },
        { id: 'sa-sen-b2', prompt: 'Hamza made a timetable and divided the tasks.', marks: 1, type: 'true-false' },
        { id: 'sa-sen-b3', prompt: 'The students learned teamwork and responsibility.', marks: 1, type: 'true-false' },
      ] },
      { id: 'c', title: 'Section C · Match the words', instructions: 'Choose the meaning that matches each word.', questions: [
        { id: 'sa-sen-c1', prompt: 'Ambition', marks: 0.5, type: 'matching', options: [{ value: 'a', label: 'A · Working together' }, { value: 'b', label: 'B · A strong desire to succeed' }, { value: 'c', label: 'C · Feeling proud and pleased' }, { value: 'd', label: 'D · Feeling anxious or afraid' }] },
        { id: 'sa-sen-c2', prompt: 'Cooperation', marks: 0.5, type: 'matching', options: [{ value: 'a', label: 'A · Working together' }, { value: 'b', label: 'B · A strong desire to succeed' }, { value: 'c', label: 'C · Feeling proud and pleased' }, { value: 'd', label: 'D · Feeling anxious or afraid' }] },
        { id: 'sa-sen-c3', prompt: 'Worried', marks: 0.5, type: 'matching', options: [{ value: 'a', label: 'A · Working together' }, { value: 'b', label: 'B · A strong desire to succeed' }, { value: 'c', label: 'C · Feeling proud and pleased' }, { value: 'd', label: 'D · Feeling anxious or afraid' }] },
        { id: 'sa-sen-c4', prompt: 'Proud', marks: 0.5, type: 'matching', options: [{ value: 'a', label: 'A · Working together' }, { value: 'b', label: 'B · A strong desire to succeed' }, { value: 'c', label: 'C · Feeling proud and pleased' }, { value: 'd', label: 'D · Feeling anxious or afraid' }] },
      ] },
      { id: 'd', title: 'Section D · Reference', instructions: 'Identify who each reference word refers to.', questions: [
        { id: 'sa-sen-d1', prompt: '“She invited her friends.” — Who does “She” refer to?', marks: 0.5, type: 'short' },
        { id: 'sa-sen-d2', prompt: '“They worked together.” — Who does “They” refer to?', marks: 0.5, type: 'short' },
      ] },
    ],
  };
