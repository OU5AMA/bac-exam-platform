import { ReadingExam } from './reading.models';

const yesNo = [{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }];
const senMeanings = [
  { value: 'a', label: 'A · To work together' },
  { value: 'b', label: 'B · The ability to do something well' },
  { value: 'c', label: 'C · To stop trying' },
  { value: 'd', label: 'D · Believing in yourself' },
];

export const READING_EXAMS: ReadingExam[] = [
  {
    id: 'reading-normal', slug: '2bac-be-the-best-version-of-yourself', title: 'Be the Best Version of Yourself',
    level: '2BAC English', unit: 'Ticket to English 2 · Unit 1 — The Gifts of Youth', version: 'normal',
    versionLabel: 'Normal Version', description: 'The standard reading exam on life skills, personal development, and success.',
    duration: '25–30 minutes', supportLevel: 'Standard exam practice',
    passage: [
      'Youth is a special period of life full of opportunities, energy, and ambition. Young people have many gifts, such as creativity, talent, imagination, and enthusiasm. However, these gifts alone are not always enough to achieve success. To become the best version of yourself, you also need to develop important life skills.',
      'My friend Youssef is a good example of a young person who understands the value of these skills. When he was younger, he was shy and often found it difficult to express his opinions. He also had problems concentrating on his studies because social media and video games were major distractions. Instead of giving up, he decided to take the initiative and make positive changes in his life.',
      'First, Youssef learned to organize his time and set clear goals. He became more responsible and well-organized, which helped him concentrate better and improve his school results. Second, he developed his communication skills by participating in classroom discussions and working with other students. He learned to listen to different opinions, respect others, and cooperate with his classmates.',
      'Moreover, Youssef discovered that challenges were opportunities to learn rather than reasons to stop trying. His ambition and determination motivated him to overcome difficulties. He also joined a local association where he helped younger children with their homework. This experience taught him the importance of teamwork, empathy, and responsibility.',
      'Today, Youssef is more confident and motivated. He believes that success is not only about getting good marks or having a lot of money. It is also about developing your abilities, making good decisions, and contributing to society. In his opinion, every young person has the potential to succeed if they use their gifts wisely and continue learning throughout life.',
    ],
    sections: [
      { id: 'a', title: 'Section A · Answer the questions', instructions: 'Answer each question using information from the text.', questions: [
        { id: 'n-a1', prompt: 'What is the main idea of the text?', marks: 1, type: 'short' },
        { id: 'n-a2', prompt: 'Mention two problems Youssef had when he was younger.', marks: 1, type: 'short' },
        { id: 'n-a3', prompt: 'How did Youssef improve his communication skills?', marks: 1, type: 'short' },
        { id: 'n-a4', prompt: 'What did Youssef learn from helping younger children?', marks: 1, type: 'short' },
      ] },
      { id: 'b', title: 'Section B · True or False', instructions: 'Choose True or False and justify your answer from the text.', questions: [
        { id: 'n-b1', prompt: 'Youssef gave up when he faced difficulties.', marks: 1, type: 'true-false-justify' },
        { id: 'n-b2', prompt: 'Organizing his time helped Youssef improve his school results.', marks: 1, type: 'true-false-justify' },
        { id: 'n-b3', prompt: 'Youssef thinks success is only about getting good marks and money.', marks: 1, type: 'true-false-justify' },
      ] },
      { id: 'c', title: 'Section C · Vocabulary', instructions: 'Find a word in the text that means each definition.', questions: [
        { id: 'n-c1', prompt: 'The desire to achieve something.', marks: 0.5, type: 'short' },
        { id: 'n-c2', prompt: 'To pay attention to something.', marks: 0.5, type: 'short' },
        { id: 'n-c3', prompt: 'Difficult situations or tasks.', marks: 0.5, type: 'short' },
        { id: 'n-c4', prompt: 'The ability to understand and share another person’s feelings.', marks: 0.5, type: 'short' },
      ] },
      { id: 'd', title: 'Section D · Reference words', instructions: 'Identify what each reference word refers to in the text.', questions: [
        { id: 'n-d1', prompt: '“He became more responsible and well-organized.” (Paragraph 3) — Who does “He” refer to?', marks: 0.5, type: 'short' },
        { id: 'n-d2', prompt: '“This experience taught him the importance of teamwork.” (Paragraph 4) — What does “This experience” refer to?', marks: 0.5, type: 'short' },
      ] },
    ],
  },
  {
    id: 'reading-sen', slug: '2bac-be-the-best-version-of-yourself-sen', title: 'Be the Best Version of Yourself',
    level: '2BAC English · Adapted practice', unit: 'Unit 1 — The Gifts of Youth', version: 'sen',
    versionLabel: 'SEN Version', description: 'An adapted exam with shorter text, clear instructions, and flexible reading support.',
    duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace',
    passage: [
      'Everyone wants to be successful in life. Young people have many gifts, such as talent, creativity, and energy. However, they also need important life skills.',
      'My friend Adam is a good example. In the past, he was shy and had difficulty speaking in front of others. He sometimes got bad marks because he did not organize his time well.',
      'One day, Adam decided to change. He started making a study timetable and setting goals. He also began working with his classmates. He learned to communicate, cooperate, and respect other people’s opinions.',
      'Adam is now more confident and responsible. He knows that success is not only about getting good marks. It is also about helping others, working hard, and never giving up. Adam believes that every young person can improve and become the best version of themselves.',
    ],
    sections: [
      { id: 'a', title: 'Section A · Answer the questions', instructions: 'Read the text. Answer with a word or a short phrase.', questions: [
        { id: 's-a1', prompt: 'What is the name of the boy in the text?', marks: 1, type: 'short' },
        { id: 's-a2', prompt: 'Was Adam shy in the past?', marks: 1, type: 'true-false' },
        { id: 's-a3', prompt: 'What did Adam use to organize his study time?', marks: 1, type: 'short' },
        { id: 's-a4', prompt: 'Mention one thing that helps people succeed in life.', marks: 1, type: 'short' },
      ] },
      { id: 'b', title: 'Section B · True or False', instructions: 'Choose True or False.', questions: [
        { id: 's-b1', prompt: 'Adam was confident in the past.', marks: 1, type: 'true-false' },
        { id: 's-b2', prompt: 'Adam learned to cooperate with his classmates.', marks: 1, type: 'true-false' },
      ] },
      { id: 'c', title: 'Section C · Multiple choice', instructions: 'Choose one answer for each question.', questions: [
        { id: 's-c1', prompt: 'Adam was shy and had difficulty:', marks: 1, type: 'choice', options: [{ value: 'a', label: 'Cooking' }, { value: 'b', label: 'Speaking in front of others' }, { value: 'c', label: 'Playing football' }] },
        { id: 's-c2', prompt: 'Adam is now more:', marks: 1, type: 'choice', options: [{ value: 'a', label: 'Confident and responsible' }, { value: 'b', label: 'Lazy and careless' }, { value: 'c', label: 'Angry and rude' }] },
      ] },
      { id: 'd', title: 'Section D · Match the words', instructions: 'Choose the meaning that matches each word.', questions: [
        { id: 's-d1', prompt: 'Talent', marks: 0.5, type: 'matching', options: senMeanings },
        { id: 's-d2', prompt: 'Cooperate', marks: 0.5, type: 'matching', options: senMeanings },
        { id: 's-d3', prompt: 'Confident', marks: 0.5, type: 'matching', options: senMeanings },
        { id: 's-d4', prompt: 'Give up', marks: 0.5, type: 'matching', options: senMeanings },
      ] },
    ],
  },

  {
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
  },
  {
    id: 'reading-small-actions-sen', slug: '2bac-small-actions-big-changes-sen', title: 'Small Actions, Big Changes',
    level: '2BAC English · Adapted practice', unit: 'Unit 1 — The Gifts of Youth', version: 'sen',
    versionLabel: 'SEN – Adapted Version', description: 'Practise reading comprehension with a shorter text, simpler questions, and accessible instructions.',
    duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace',
    passage: [
      'Salma is a 17-year-old student. She believes that young people have many gifts, such as creativity, energy, and ambition. She thinks that they can use these gifts to help others.',
      'One day, Salma decided to organize a campaign to clean her neighbourhood. At first, she was worried because she thought her classmates would not help. However, she invited her friends, and they agreed to join her.',
      'Salma made a simple timetable and divided the tasks. Her friend Hamza designed posters to invite more students. They worked together and helped each other. Although they faced some problems, they did not give up.',
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
  },
];

export function readingExamBySlug(slug: string | null): ReadingExam | undefined {
  return READING_EXAMS.find((exam) => exam.slug === slug);
}
