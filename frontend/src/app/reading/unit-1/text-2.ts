import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
    id: 'reading-small-actions-standard', slug: '2bac-small-actions-big-changes-standard', title: 'Small Actions, Big Changes',
    level: '2BAC English', unit: 'Ticket to English 2 · Unit 1 — The Gifts of Youth', version: 'normal',
    versionLabel: 'Standard Version', description: 'Practise reading comprehension, true/false questions, vocabulary, and reference words.',
    duration: '25–30 minutes', supportLevel: 'Standard exam practice',
    passage: [
      'Young people have many gifts, such as energy, creativity, ambition, and enthusiasm. Success is not only about getting good marks or having a successful career. It is also about developing life skills and using our talents to help others.',
      'Salma is a 17-year-old student who decided to take the initiative and organize a campaign to clean her neighbourhood. At first, she was worried that her classmates would not be interested. However, she showed determination, invited her friends, and explained the importance of teamwork.',
      'The students shared ideas and responsibilities. Salma was responsible and well-organized: she prepared a timetable and divided the tasks. Her friend Hamza was creative and confident, so he designed posters to encourage more students to participate. Although they faced some challenges, they learned to cooperate, respect different opinions, and solve problems together.',
      'At the end of the campaign, the neighbourhood was cleaner, and more people became interested in protecting the environment. The students felt proud of their achievement. Through volunteering, they developed important life skills, including communication, leadership, empathy, and responsibility.',
      'Salma believes that young people should not wait for others to make changes. They should use their gifts wisely, believe in themselves, and take action. Even small efforts can lead to great results.',
    ],
    sections: [
      { id: 'a', title: 'Section A · Answer the questions', instructions: 'Answer each question using information from the text.', questions: [
        { id: 'sa-std-a1', prompt: 'What campaign did Salma organize?', marks: 1, type: 'short' },
        { id: 'sa-std-a2', prompt: 'Why was Salma worried at first?', marks: 1, type: 'short' },
        { id: 'sa-std-a3', prompt: 'What did Hamza do to help the campaign?', marks: 1, type: 'short' },
        { id: 'sa-std-a4', prompt: 'Mention two life skills the students developed through volunteering.', marks: 1, type: 'short' },
      ] },
      { id: 'b', title: 'Section B · True or False', instructions: 'Choose True or False, then justify your answer with evidence from the text.', questions: [
        { id: 'sa-std-b1', prompt: 'Salma stopped the campaign when the students faced challenges.', marks: 1, type: 'true-false-justify' },
        { id: 'sa-std-b2', prompt: 'Salma prepared a timetable and divided the tasks.', marks: 1, type: 'true-false-justify' },
        { id: 'sa-std-b3', prompt: 'Salma believes young people should wait for others to make changes.', marks: 1, type: 'true-false-justify' },
      ] },
      { id: 'c', title: 'Section C · Vocabulary', instructions: 'Find a word in the text that means each definition.', questions: [
        { id: 'sa-std-c1', prompt: 'A strong desire to achieve something.', marks: 0.5, type: 'short' },
        { id: 'sa-std-c2', prompt: 'To work together.', marks: 0.5, type: 'short' },
        { id: 'sa-std-c3', prompt: 'Difficult situations or problems.', marks: 0.5, type: 'short' },
        { id: 'sa-std-c4', prompt: 'The ability to guide or organize a group.', marks: 0.5, type: 'short' },
      ] },
      { id: 'd', title: 'Section D · Reference', instructions: 'Identify who each reference word refers to.', questions: [
        { id: 'sa-std-d1', prompt: '“At first, she was worried that her classmates would not be interested.” — Who does “she” refer to?', marks: 0.5, type: 'short' },
        { id: 'sa-std-d2', prompt: '“They learned to cooperate.” — Who does “they” refer to?', marks: 0.5, type: 'short' },
      ] },
    ],
  };
