import { ReadingExam } from '../reading.models';

export const readingExam: ReadingExam = {
    id: 'reading-normal', slug: '2bac-be-the-best-version-of-yourself', title: 'Be the Best Version of Yourself',
    level: '2BAC English', unit: 'Ticket to English 2 · Unit 1 — The Gifts of Youth', version: 'normal',
    versionLabel: 'Normal Version', description: 'The standard reading exam on life skills, personal development, and success.',
    duration: '25–30 minutes', supportLevel: 'Standard exam practice',
    passage: [
      'Youth is a special period of life full of opportunities, energy, and ambition. Young people have many gifts, such as creativity, talent, imagination, and enthusiasm. However, these gifts alone are not always enough to achieve success. To become the best version of yourself, you also need to develop important life skills.',
      'My friend Youssef is a good example of a young person who understands the value of these skills. When he was younger, he was shy and often found it difficult to express his opinions. He also had problems concentrating on his studies because social media and video games were major distractions. Instead of giving up, he decided to take the initiative and make positive changes in his life.',
      'First, Youssef learned to organize his time and set clear goals. <strong>He</strong> became more responsible and well-organized, which helped him concentrate better and improve his school results. Second, he developed his communication skills by participating in classroom discussions and working with other students. He learned to listen to different opinions, respect others, and cooperate with his classmates.',
      'Moreover, Youssef discovered that challenges were opportunities to learn rather than reasons to stop trying. His ambition and determination motivated him to overcome difficulties. He also joined a local association where he helped younger children with their homework. <strong>This experience</strong> taught him the importance of teamwork, empathy, and responsibility.',
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
  };
