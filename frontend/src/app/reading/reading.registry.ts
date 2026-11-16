import { AnswerKey, ReadingExam } from './reading.models';

export interface ReadingMeta {
  id: string;
  slug: string;
  title: string;
  level: string;
  unit: string;
  version: 'normal' | 'sen';
  versionLabel: string;
  description: string;
  duration: string;
  supportLevel: string;
}

interface ReadingEntry {
  unitNumber: number;
  meta: ReadingMeta;
  load: () => Promise<ReadingExam>;
  loadKeys: () => Promise<Record<string, AnswerKey>>;
}

const loadUnit1Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-1/keys')).READING_ANSWER_KEYS;

const loadUnit2Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-2/keys')).READING_ANSWER_KEYS;

const loadUnit3Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-3/keys')).READING_ANSWER_KEYS;

const loadUnit4Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-4/keys')).READING_ANSWER_KEYS;

const loadUnit5Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-5/keys')).READING_ANSWER_KEYS;

const loadUnit6Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-6/keys')).READING_ANSWER_KEYS;

const loadUnit7Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-7/keys')).READING_ANSWER_KEYS;

const loadUnit8Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-8/keys')).READING_ANSWER_KEYS;

const loadUnit9Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-9/keys')).READING_ANSWER_KEYS;

const loadUnit10Keys = async (): Promise<Record<string, AnswerKey>> =>
  (await import('./unit-10/keys')).READING_ANSWER_KEYS;

const entries: ReadingEntry[] = [
  {
    unitNumber: 1,
    meta: { id: 'reading-normal', slug: '2bac-be-the-best-version-of-yourself', title: 'Be the Best Version of Yourself', level: '2BAC English', unit: 'Ticket to English 2 · Unit 1 — The Gifts of Youth', version: 'normal', versionLabel: 'Normal Version', description: 'The standard reading exam on life skills, personal development, and success.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-1/text-1')).readingExam,
    loadKeys: loadUnit1Keys,
  },
  {
    unitNumber: 1,
    meta: { id: 'reading-sen', slug: '2bac-be-the-best-version-of-yourself-sen', title: 'Be the Best Version of Yourself', level: '2BAC English · Adapted practice', unit: 'Unit 1 — The Gifts of Youth', version: 'sen', versionLabel: 'SEN Version', description: 'An adapted exam with shorter text, clear instructions, and flexible reading support.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-1/text-1-sen')).readingExam,
    loadKeys: loadUnit1Keys,
  },
  {
    unitNumber: 1,
    meta: { id: 'reading-small-actions-standard', slug: '2bac-small-actions-big-changes-standard', title: 'Small Actions, Big Changes', level: '2BAC English', unit: 'Ticket to English 2 · Unit 1 — The Gifts of Youth', version: 'normal', versionLabel: 'Standard Version', description: 'Practise reading comprehension, true/false questions, vocabulary, and reference words.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-1/text-2')).readingExam,
    loadKeys: loadUnit1Keys,
  },
  {
    unitNumber: 1,
    meta: { id: 'reading-small-actions-sen', slug: '2bac-small-actions-big-changes-sen', title: 'Small Actions, Big Changes', level: '2BAC English · Adapted practice', unit: 'Unit 1 — The Gifts of Youth', version: 'sen', versionLabel: 'SEN – Adapted Version', description: 'Practise reading comprehension with a shorter text, simpler questions, and accessible instructions.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-1/text-2-sen')).readingExam,
    loadKeys: loadUnit1Keys,
  },
  {
    unitNumber: 2,
    meta: { id: 'unit-2-reading-humour', slug: 'unit-2-reading-humour', title: 'Humour: More Than Just Making People Laugh', level: '2BAC English', unit: 'Ticket to English 2 · Unit 2 — Humour', version: 'normal', versionLabel: 'Normal Version', description: 'Read about the benefits and responsible use of humour.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-2/text-1')).readingExam,
    loadKeys: loadUnit2Keys,
  },
  {
    unitNumber: 2,
    meta: { id: 'unit-2-reading-humour-sen', slug: 'unit-2-reading-humour-sen', title: 'Why Is Humour Important?', level: '2BAC English · Adapted practice', unit: 'Unit 2 — Humour', version: 'sen', versionLabel: 'SEN Version', description: 'Practise reading with a shorter, simpler text about humour.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-2/text-1-sen')).readingExam,
    loadKeys: loadUnit2Keys,
  },
  {
    unitNumber: 3,
    meta: { id: 'unit-3-reading-education', slug: 'unit-3-reading-education', title: 'Education Beyond the Classroom', level: '2BAC English', unit: 'Ticket to English 2 · Unit 3 — Education', version: 'normal', versionLabel: 'Normal Version', description: 'Explore formal, non-formal and informal education.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-3/text-1')).readingExam,
    loadKeys: loadUnit3Keys,
  },
  {
    unitNumber: 3,
    meta: { id: 'unit-3-reading-education-sen', slug: 'unit-3-reading-education-sen', title: 'Three Ways of Learning', level: '2BAC English · Adapted practice', unit: 'Unit 3 — Education', version: 'sen', versionLabel: 'SEN Version', description: 'Practise reading about three types of education in a simpler text.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-3/text-1-sen')).readingExam,
    loadKeys: loadUnit3Keys,
  },
  {
    unitNumber: 4,
    meta: { id: 'unit-4-reading-sustainable-development', slug: 'unit-4-reading-sustainable-development', title: 'Sustainable Development', level: '2BAC English', unit: 'Ticket to English 2 · Unit 4 — Sustainable Development', version: 'normal', versionLabel: 'Normal Version', description: 'Reading content coming soon.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-4/text-1')).readingExam,
    loadKeys: loadUnit4Keys,
  },
  {
    unitNumber: 4,
    meta: { id: 'unit-4-reading-sustainable-development-sen', slug: 'unit-4-reading-sustainable-development-sen', title: 'Sustainable Development', level: '2BAC English · Adapted practice', unit: 'Unit 4 — Sustainable Development', version: 'sen', versionLabel: 'SEN Version', description: 'Adapted reading content coming soon.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-4/text-1-sen')).readingExam,
    loadKeys: loadUnit4Keys,
  },
  {
    unitNumber: 5,
    meta: { id: 'unit-5-reading-women-power', slug: 'unit-5-reading-women-power', title: 'Women: Breaking Barriers and Making a Difference', level: '2BAC English', unit: 'Ticket to English 2 · Unit 5 — Women and Power', version: 'normal', versionLabel: 'Normal Version', description: 'Read about women’s equality, empowerment, and contributions to society.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-5/text-1')).readingExam,
    loadKeys: loadUnit5Keys,
  },
  {
    unitNumber: 5,
    meta: { id: 'unit-5-reading-women-power-sen', slug: 'unit-5-reading-women-power-sen', title: 'Women and Equal Opportunities', level: '2BAC English · Adapted practice', unit: 'Unit 5 — Women and Power', version: 'sen', versionLabel: 'SEN Version', description: 'Practise reading about women and equal opportunities in a simpler text.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-5/text-1-sen')).readingExam,
    loadKeys: loadUnit5Keys,
  },
  {
    unitNumber: 6,
    meta: { id: 'unit-6-reading-culture', slug: 'unit-6-reading-culture', title: 'Understanding and Respecting Different Cultures', level: '2BAC English', unit: 'Ticket to English 2 · Unit 6 — Cultural Issues and Values', version: 'normal', versionLabel: 'Normal Version', description: 'Read about cultural diversity, respect, and inclusion.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-6/text-1')).readingExam,
    loadKeys: loadUnit6Keys,
  },
  {
    unitNumber: 6,
    meta: { id: 'unit-6-reading-culture-sen', slug: 'unit-6-reading-culture-sen', title: 'Respecting Different Cultures', level: '2BAC English · Adapted practice', unit: 'Unit 6 — Cultural Issues and Values', version: 'sen', versionLabel: 'SEN Version', description: 'Practise reading about respecting cultures in a simpler text.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-6/text-1-sen')).readingExam,
    loadKeys: loadUnit6Keys,
  },
  {
    unitNumber: 7,
    meta: { id: 'unit-7-reading-citizenship', slug: 'unit-7-reading-citizenship', title: 'Being a Responsible Citizen', level: '2BAC English', unit: 'Ticket to English 2 · Unit 7 — Citizenship', version: 'normal', versionLabel: 'Normal Version', description: 'Read about responsible citizenship and community participation.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-7/text-1')).readingExam,
    loadKeys: loadUnit7Keys,
  },
  {
    unitNumber: 7,
    meta: { id: 'unit-7-reading-citizenship-sen', slug: 'unit-7-reading-citizenship-sen', title: 'A Good Citizen', level: '2BAC English · Adapted practice', unit: 'Unit 7 — Citizenship', version: 'sen', versionLabel: 'SEN Version', description: 'Practise reading about good citizenship in a simpler text.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-7/text-1-sen')).readingExam,
    loadKeys: loadUnit7Keys,
  },
  {
    unitNumber: 8,
    meta: { id: 'unit-8-reading-international-organisations', slug: 'unit-8-reading-international-organisations', title: 'International Organisations', level: '2BAC English', unit: 'Ticket to English 2 · Unit 8 — International Organisations', version: 'normal', versionLabel: 'Normal Version', description: 'Reading content coming soon.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-8/text-1')).readingExam,
    loadKeys: loadUnit8Keys,
  },
  {
    unitNumber: 8,
    meta: { id: 'unit-8-reading-international-organisations-sen', slug: 'unit-8-reading-international-organisations-sen', title: 'International Organisations', level: '2BAC English · Adapted practice', unit: 'Unit 8 — International Organisations', version: 'sen', versionLabel: 'SEN Version', description: 'Adapted reading content coming soon.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-8/text-1-sen')).readingExam,
    loadKeys: loadUnit8Keys,
  },
  {
    unitNumber: 9,
    meta: { id: 'unit-9-reading-science-technology', slug: 'unit-9-reading-science-technology', title: 'Science and Technology: Opportunities and Challenges', level: '2BAC English', unit: 'Ticket to English 2 · Unit 9 — Science and Technology', version: 'normal', versionLabel: 'Normal Version', description: 'Read about the benefits and challenges of science and technology.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-9/text-1')).readingExam,
    loadKeys: loadUnit9Keys,
  },
  {
    unitNumber: 9,
    meta: { id: 'unit-9-reading-science-technology-sen', slug: 'unit-9-reading-science-technology-sen', title: 'Science and Technology in Our Lives', level: '2BAC English · Adapted practice', unit: 'Unit 9 — Science and Technology', version: 'sen', versionLabel: 'SEN Version', description: 'Practise reading about science and technology in a simpler text.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-9/text-1-sen')).readingExam,
    loadKeys: loadUnit9Keys,
  },
  {
    unitNumber: 10,
    meta: { id: 'unit-10-reading-brain-drain', slug: 'unit-10-reading-brain-drain', title: 'Brain Drain', level: '2BAC English', unit: 'Ticket to English 2 · Unit 10 — Brain Drain', version: 'normal', versionLabel: 'Normal Version', description: 'Reading content coming soon.', duration: '25–30 minutes', supportLevel: 'Standard exam practice' },
    load: async () => (await import('./unit-10/text-1')).readingExam,
    loadKeys: loadUnit10Keys,
  },
  {
    unitNumber: 10,
    meta: { id: 'unit-10-reading-brain-drain-sen', slug: 'unit-10-reading-brain-drain-sen', title: 'Brain Drain', level: '2BAC English · Adapted practice', unit: 'Unit 10 — Brain Drain', version: 'sen', versionLabel: 'SEN Version', description: 'Adapted reading content coming soon.', duration: '25–30 minutes · extra time may be used', supportLevel: 'Adapted text · flexible pace' },
    load: async () => (await import('./unit-10/text-1-sen')).readingExam,
    loadKeys: loadUnit10Keys,
  },
];

export function getUnitReadingMeta(unit: number): ReadingMeta[] {
  return entries.filter((entry) => entry.unitNumber === unit).map((entry) => entry.meta);
}

export function getNationalExamMeta(): ReadingMeta[] { return []; }

export async function loadReading(slug: string): Promise<ReadingExam> {
  const entry = entries.find((item) => item.meta.slug === slug);
  if (!entry) throw new Error(`Reading exam not found: ${slug}`);
  return entry.load();
}

export async function loadReadingAnswerKeys(slug: string): Promise<Record<string, AnswerKey>> {
  const entry = entries.find((item) => item.meta.slug === slug);
  if (!entry) throw new Error(`Reading exam not found: ${slug}`);
  return entry.loadKeys();
}
