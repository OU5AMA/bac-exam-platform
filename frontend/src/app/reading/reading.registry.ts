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
