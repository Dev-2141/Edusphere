// Course categories. `author` holds the short topic line printed on each cover;
// `genres` holds the subject groups used by the All Books filter.

export type Motif = 'rings' | 'stripes' | 'moon' | 'grid' | 'wave' | 'drops' | 'stars' | 'arch';
export type Tone = 'sun' | 'coral' | 'mint' | 'lilac' | 'cobalt' | 'cream' | 'ink';

export interface Book {
  id: string;
  title: string;
  author: string;
  genres: string[];
  extra?: string; // playful tag, e.g. "Has a Lighthouse"
  blurb: string;
  cover: { bg: string; fg: string; accent: string; motif: Motif };
  card: Tone;
}

export const books: Book[] = [
  {
    id: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    author: 'ML · Deep Learning · GenAI',
    genres: ['Tech'],
    extra: 'Trending',
    blurb: 'Learn how machines learn: from core machine-learning ideas to neural networks, language models and building your own AI tools.',
    cover: { bg: '#141115', fg: '#a8f0d4', accent: '#c6b4ff', motif: 'grid' },
    card: 'ink',
  },
  {
    id: 'business',
    title: 'Business',
    author: 'Strategy · Marketing · Finance',
    genres: ['Business'],
    blurb: 'Build the skills to start, run and grow an organisation — strategy, marketing, finance, operations and leadership.',
    cover: { bg: '#ffcf33', fg: '#141115', accent: '#ff5470', motif: 'stripes' },
    card: 'sun',
  },
  {
    id: 'data-science',
    title: 'Data Science',
    author: 'Python · Statistics · Analytics',
    genres: ['Tech', 'Science'],
    extra: 'Beginner friendly',
    blurb: 'Turn raw data into answers with statistics, Python, SQL and visualisation, then tell the story behind the numbers.',
    cover: { bg: '#1d3a8a', fg: '#fff1c9', accent: '#ff8a3d', motif: 'wave' },
    card: 'cobalt',
  },
  {
    id: 'information-technology',
    title: 'Information Technology',
    author: 'Cloud · Networking · Security',
    genres: ['Tech'],
    blurb: 'Keep systems running and secure: networking, cloud platforms, IT support, cybersecurity and certifications.',
    cover: { bg: '#a8f0d4', fg: '#1f3b2f', accent: '#3355ff', motif: 'rings' },
    card: 'mint',
  },
  {
    id: 'computer-science',
    title: 'Computer Science',
    author: 'Algorithms · Software · Systems',
    genres: ['Tech', 'Science'],
    blurb: 'Understand how software works under the hood — programming, algorithms, data structures and system design.',
    cover: { bg: '#c6b4ff', fg: '#1b1240', accent: '#3355ff', motif: 'drops' },
    card: 'lilac',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    author: 'Public Health · Medicine · Care',
    genres: ['Health'],
    blurb: 'Explore how health and care systems work, from anatomy and public health to patient care and health informatics.',
    cover: { bg: '#ff5470', fg: '#fff8ec', accent: '#141115', motif: 'arch' },
    card: 'coral',
  },
  {
    id: 'physical-science-engineering',
    title: 'Physical Science and Engineering',
    author: 'Physics · Chemistry · Engineering',
    genres: ['Science'],
    blurb: 'Study the laws that shape the physical world and apply them to design, build and solve real engineering problems.',
    cover: { bg: '#5b1022', fg: '#ffd6dd', accent: '#ffcf33', motif: 'moon' },
    card: 'coral',
  },
  {
    id: 'personal-development',
    title: 'Personal Development',
    author: 'Productivity · Wellbeing · Careers',
    genres: ['Skills'],
    extra: 'Short courses',
    blurb: 'Grow the everyday skills that make everything else easier: focus, communication, resilience and career planning.',
    cover: { bg: '#ff8a3d', fg: '#fff8ec', accent: '#1d3a8a', motif: 'stars' },
    card: 'sun',
  },
  {
    id: 'social-sciences',
    title: 'Social Sciences',
    author: 'Psychology · Economics · Society',
    genres: ['Humanities'],
    blurb: 'Discover why people and societies behave the way they do through psychology, economics, sociology and politics.',
    cover: { bg: '#1f6b4f', fg: '#fff8ec', accent: '#ffcf33', motif: 'rings' },
    card: 'mint',
  },
  {
    id: 'language-learning',
    title: 'Language Learning',
    author: 'Speaking · Writing · Culture',
    genres: ['Skills', 'Humanities'],
    blurb: 'Pick up a new language or polish one you already know, with practice in speaking, listening, writing and culture.',
    cover: { bg: '#3355ff', fg: '#fff8ec', accent: '#a8f0d4', motif: 'wave' },
    card: 'cobalt',
  },
  {
    id: 'arts-humanities',
    title: 'Arts and Humanities',
    author: 'History · Philosophy · Music',
    genres: ['Humanities'],
    blurb: 'Explore the ideas and creativity that shape culture — history, philosophy, literature, music and the visual arts.',
    cover: { bg: '#fff1c9', fg: '#141115', accent: '#ff5470', motif: 'arch' },
    card: 'lilac',
  },
];

export const genres = [
  'Horror',
  'Science Fiction',
  'Romance',
  'Thriller',
  'Literary Fiction',
  'Fantasy',
  'Gothic',
  'Historical',
  'Magical Realism',
  'Contemporary',
];

export const readersChoice = [
  { year: '2026', book: 'artificial-intelligence', note: 'Won by a landslide in the spring vote.' },
  { year: '2025', book: 'data-science', note: 'The category everyone kept coming back to.' },
  { year: '2024', book: 'personal-development', note: 'Most-gifted category of the year.' },
  { year: '2023', book: 'language-learning', note: 'Our very first learners’ favourite.' },
];

export const byId = (id: string) => books.find((b) => b.id === id)!;
