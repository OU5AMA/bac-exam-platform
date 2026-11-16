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
