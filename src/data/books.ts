// Catalogue data. Each `Book` is a main course category (Coursera-style
// subject); `courses` are the sub-topic courses inside it, and every course is
// a playlist of real YouTube lessons embedded from their original creators.
// `author` holds the short topic line printed on each cover; `genres` holds
// the subject groups used by the All Courses filter.

export type Motif = 'rings' | 'stripes' | 'moon' | 'grid' | 'wave' | 'drops' | 'stars' | 'arch';
export type Tone = 'sun' | 'coral' | 'mint' | 'lilac' | 'cobalt' | 'cream' | 'ink';
export type Level = 'Beginner' | 'Intermediate' | 'Mixed';

export interface Lesson {
  title: string;
  youtube: string; // YouTube video id
  channel: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  level: Level;
  summary: string;
  skills: string[];
  lessons: Lesson[];
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genres: string[];
  extra?: string; // playful tag, e.g. "Trending"
  blurb: string;
  cover: { bg: string; fg: string; accent: string; motif: Motif };
  card: Tone;
  courses: Course[];
}

const fcc = 'freeCodeCamp.org';
const cc = 'CrashCourse';
const ted = 'TED';

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
    courses: [
      {
        id: 'neural-networks-visually',
        title: 'Neural Networks, Visually',
        instructor: '3Blue1Brown',
        level: 'Beginner',
        summary: 'See what a neural network actually computes, then watch it learn through gradient descent and backpropagation — all explained with animation, not jargon.',
        skills: ['Neural networks', 'Gradient descent', 'Backpropagation', 'Calculus intuition'],
        lessons: [
          { title: 'But what is a neural network?', youtube: 'aircAruvnKk', channel: '3Blue1Brown' },
          { title: 'Gradient descent, how neural networks learn', youtube: 'IHZwWFHWa-w', channel: '3Blue1Brown' },
          { title: 'Backpropagation, intuitively', youtube: 'Ilg3gGewQ5U', channel: '3Blue1Brown' },
          { title: 'Backpropagation calculus', youtube: 'tIeHLnjs5U8', channel: '3Blue1Brown' },
        ],
      },
      {
        id: 'zero-to-gpt',
        title: 'Zero to GPT',
        instructor: 'Andrej Karpathy',
        level: 'Intermediate',
        summary: 'An Edusphere Original path through three landmark lectures: what large language models are, how backprop works from scratch, and how to build a GPT in code.',
        skills: ['Large language models', 'Autograd', 'Transformers', 'Self-attention', 'PyTorch'],
        lessons: [
          { title: 'Intro to Large Language Models', youtube: 'zjkBMFhNj_g', channel: 'Andrej Karpathy' },
          { title: 'Building micrograd: neural networks and backpropagation', youtube: 'VMj-3S1tku0', channel: 'Andrej Karpathy' },
          { title: 'Let’s build GPT: from scratch, in code', youtube: 'kCc8FmEb1nY', channel: 'Andrej Karpathy' },
        ],
      },
      {
        id: 'machine-learning-for-everybody',
        title: 'Machine Learning for Everybody',
        instructor: 'freeCodeCamp · Programming with Mosh',
        level: 'Beginner',
        summary: 'Your first hands-on machine-learning course: classification, regression and your first model in Python, with no prior ML experience needed.',
        skills: ['Supervised learning', 'scikit-learn', 'Python', 'Model evaluation'],
        lessons: [
          { title: 'Machine Learning for Everybody – Full Course', youtube: 'i_LwzRVP7bg', channel: fcc },
          { title: 'Python Machine Learning Tutorial', youtube: '7eh4d6sabA0', channel: 'Programming with Mosh' },
        ],
      },
    ],
  },
  {
    id: 'business',
    title: 'Business',
    author: 'Strategy · Marketing · Finance',
    genres: ['Business'],
    blurb: 'Build the skills to start, run and grow an organisation — strategy, marketing, finance, operations and leadership.',
    cover: { bg: '#ffcf33', fg: '#141115', accent: '#ff5470', motif: 'stripes' },
    card: 'sun',
    courses: [
      {
        id: 'how-to-start-a-startup',
        title: 'How to Start a Startup',
        instructor: 'Y Combinator · TED · CrashCourse',
        level: 'Beginner',
        summary: 'Ideas, teams, execution and timing: the essentials of starting a company, from the people who have funded thousands of them.',
        skills: ['Entrepreneurship', 'Product thinking', 'Team building', 'Execution'],
        lessons: [
          { title: 'Who even is an entrepreneur?', youtube: 'aozlwC3XwfY', channel: cc },
          { title: 'How to Start a Startup (Sam Altman, Dustin Moskovitz)', youtube: 'CBYhVcO4WgI', channel: 'YC Root Access' },
          { title: 'Team and Execution (Sam Altman)', youtube: 'CVfnkM44Urs', channel: 'YC Root Access' },
          { title: 'The single biggest reason why start-ups succeed', youtube: 'bNpx7gpSqbY', channel: ted },
        ],
      },
      {
        id: 'digital-marketing',
        title: 'Digital Marketing Foundations',
        instructor: 'Grow with Google',
        level: 'Beginner',
        summary: 'Understand how people discover, compare and buy online, and how marketers meet them at every step of the funnel.',
        skills: ['Digital marketing', 'E-commerce', 'Customer journey', 'Marketing funnel'],
        lessons: [
          { title: 'Intro to Digital Marketing & E-commerce', youtube: 'U-X7DG9UY3M', channel: 'Grow with Google' },
          { title: 'The Customer Journey & the Marketing Funnel', youtube: 'iRjXccj4yRo', channel: 'Grow with Google' },
        ],
      },
      {
        id: 'finance-fundamentals',
        title: 'Finance Fundamentals',
        instructor: 'Yale Courses · Khan Academy · freeCodeCamp',
        level: 'Mixed',
        summary: 'From budgeting and stocks to how financial markets work — plus the spreadsheet skills every finance role expects.',
        skills: ['Budgeting', 'Stocks', 'Financial markets', 'Excel'],
        lessons: [
          { title: 'Budgeting and the 50:30:20 rule', youtube: 'LKxOamnP8J4', channel: 'Khan Academy' },
          { title: 'What it means to buy a company’s stock', youtube: '98qfFzqDKR8', channel: 'Khan Academy' },
          { title: 'Financial Markets: Introduction (Robert Shiller)', youtube: 'WQui_3Hpmmc', channel: 'YaleCourses' },
          { title: 'Microsoft Excel Tutorial for Beginners', youtube: 'Vl0H-qTclOg', channel: fcc },
        ],
      },
      {
        id: 'leadership-soft-skills',
        title: 'Leadership & Soft Skills',
        instructor: 'TED · CrashCourse',
        level: 'Beginner',
        summary: 'Lead with purpose, build trust, resist manipulation and handle conflict at work without burning bridges.',
        skills: ['Leadership', 'Trust', 'Influence', 'Conflict resolution'],
        lessons: [
          { title: 'How great leaders inspire action (Simon Sinek)', youtube: 'qp0HIF3SfI4', channel: ted },
          { title: 'Why you need trust to do business', youtube: 'EFeEAtXdzFU', channel: cc },
          { title: 'Defense against the dark arts of influence', youtube: 'aS2NB8CFwZc', channel: cc },
          { title: 'How to handle conflict', youtube: 'gOHoSuDEO4M', channel: cc },
        ],
      },
    ],
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
    courses: [
      {
        id: 'statistics-foundations',
        title: 'Statistics Foundations',
        instructor: 'CrashCourse · StatQuest',
        level: 'Beginner',
        summary: 'Learn to think statistically: what statistics can and can’t tell you, and how techniques like PCA reveal structure in data.',
        skills: ['Descriptive statistics', 'Statistical thinking', 'PCA'],
        lessons: [
          { title: 'What is statistics?', youtube: 'sxQaBpKfDRk', channel: cc },
          { title: 'Mathematical thinking', youtube: 'tN9Xl1AcSv8', channel: cc },
          { title: 'Principal Component Analysis (PCA), step-by-step', youtube: 'FgakZw6K1QQ', channel: 'StatQuest with Josh Starmer' },
        ],
      },
      {
        id: 'data-analysis-with-python',
        title: 'Data Analysis with Python',
        instructor: 'freeCodeCamp',
        level: 'Beginner',
        summary: 'Clean, explore and visualise real datasets with NumPy, pandas, Matplotlib and Seaborn, then put it together as a data-science workflow.',
        skills: ['pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Data cleaning'],
        lessons: [
          { title: 'Data Analysis with Python – Full Course', youtube: 'r-uOLxNrNk8', channel: fcc },
          { title: 'Learn Data Science – Full Course for Beginners', youtube: 'ua-CiDNNj30', channel: fcc },
        ],
      },
      {
        id: 'sql-for-data',
        title: 'SQL & Databases',
        instructor: 'freeCodeCamp',
        level: 'Beginner',
        summary: 'Design tables, write queries and join data together — the one language every analyst uses daily.',
        skills: ['SQL', 'Relational databases', 'Queries', 'Joins'],
        lessons: [{ title: 'SQL Tutorial – Full Database Course for Beginners', youtube: 'HXV3zeQKqGY', channel: fcc }],
      },
    ],
  },
  {
    id: 'information-technology',
    title: 'Information Technology',
    author: 'Cloud · Networking · Security',
    genres: ['Tech'],
    blurb: 'Keep systems running and secure: networking, cloud platforms, IT support, cybersecurity and certifications.',
    cover: { bg: '#a8f0d4', fg: '#1f3b2f', accent: '#3355ff', motif: 'rings' },
    card: 'mint',
    courses: [
      {
        id: 'it-foundations',
        title: 'IT Foundations: Networking & Linux',
        instructor: 'freeCodeCamp',
        level: 'Beginner',
        summary: 'How networks move data and how to find your way around a Linux system — the groundwork for any IT support or sysadmin role.',
        skills: ['Networking', 'TCP/IP', 'Linux', 'Command line'],
        lessons: [
          { title: 'Computer Networking Course (CompTIA Network+ prep)', youtube: 'qiQR5rTSshw', channel: fcc },
          { title: 'Introduction to Linux – Full Course', youtube: 'sWbUDq4S6Y8', channel: fcc },
        ],
      },
      {
        id: 'cloud-and-devops',
        title: 'Cloud & DevOps',
        instructor: 'freeCodeCamp · TechWorld with Nana',
        level: 'Intermediate',
        summary: 'Get cloud-certification ready, then package and run applications with Docker and Kubernetes.',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Containers'],
        lessons: [
          { title: 'AWS Certified Cloud Practitioner course', youtube: 'SOTamWNgDKc', channel: fcc },
          { title: 'Docker Tutorial for Beginners', youtube: '3c-iBn73dDE', channel: 'TechWorld with Nana' },
          { title: 'Kubernetes Tutorial for Beginners', youtube: 'X48VuDVv0do', channel: 'TechWorld with Nana' },
        ],
      },
      {
        id: 'ethical-hacking',
        title: 'Ethical Hacking Essentials',
        instructor: 'freeCodeCamp',
        level: 'Intermediate',
        summary: 'Learn how network penetration testing works so you can find and fix weaknesses before attackers do.',
        skills: ['Cybersecurity', 'Penetration testing', 'Network security'],
        lessons: [{ title: 'Full Ethical Hacking Course – Network Penetration Testing', youtube: '3Kq1MIfTWCE', channel: fcc }],
      },
    ],
  },
  {
    id: 'computer-science',
    title: 'Computer Science',
    author: 'Algorithms · Software · Systems',
    genres: ['Tech', 'Science'],
    blurb: 'Understand how software works under the hood — programming, algorithms, data structures and system design.',
    cover: { bg: '#c6b4ff', fg: '#1b1240', accent: '#3355ff', motif: 'drops' },
    card: 'lilac',
    courses: [
      {
        id: 'how-computers-work',
        title: 'How Computers Work',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'From mechanical calculators to logic gates and binary: the ideas every computer is built on.',
        skills: ['Computing history', 'Boolean logic', 'Binary'],
        lessons: [
          { title: 'Early computing', youtube: 'O5nskjZ_GoI', channel: cc },
          { title: 'Electronic computing', youtube: 'LN0ucKNX0hc', channel: cc },
          { title: 'Boolean logic & logic gates', youtube: 'gI-qXk7XojA', channel: cc },
          { title: 'Representing numbers and letters with binary', youtube: '1GSjbWt0c9M', channel: cc },
        ],
      },
      {
        id: 'programming-foundations',
        title: 'Programming Foundations',
        instructor: 'freeCodeCamp',
        level: 'Beginner',
        summary: 'Write your first programs in Python and JavaScript, and learn to track your work with Git and GitHub.',
        skills: ['Python', 'JavaScript', 'Git', 'GitHub'],
        lessons: [
          { title: 'Learn Python – Full Course for Beginners', youtube: 'rfscVS0vtbw', channel: fcc },
          { title: 'Learn JavaScript – Full Course for Beginners', youtube: 'PkZNo7MFNFg', channel: fcc },
          { title: 'Git and GitHub for Beginners', youtube: 'RGOj5yH7evk', channel: fcc },
        ],
      },
      {
        id: 'cs50',
        title: 'Harvard CS50',
        instructor: 'Harvard University (via freeCodeCamp)',
        level: 'Mixed',
        summary: 'Harvard’s famous introduction to computer science: C, Python, SQL, algorithms and web development in one course.',
        skills: ['C', 'Algorithms', 'Memory', 'Web development'],
        lessons: [{ title: 'Harvard CS50 – Full Computer Science University Course', youtube: '8mAITcNt710', channel: fcc }],
      },
      {
        id: 'data-structures-algorithms',
        title: 'Data Structures & Algorithms',
        instructor: 'freeCodeCamp',
        level: 'Intermediate',
        summary: 'Arrays, linked lists, trees, graphs and the algorithms that run on them — the core of every technical interview.',
        skills: ['Data structures', 'Algorithms', 'Big-O', 'Problem solving'],
        lessons: [
          { title: 'Algorithms and Data Structures Tutorial', youtube: '8hly31xKli0', channel: fcc },
          { title: 'Data Structures Easy to Advanced', youtube: 'RBSGKlAvoiM', channel: fcc },
        ],
      },
    ],
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    author: 'Public Health · Medicine · Care',
    genres: ['Health'],
    blurb: 'Explore how health and care systems work, from anatomy and public health to patient care and health informatics.',
    cover: { bg: '#ff5470', fg: '#fff8ec', accent: '#141115', motif: 'arch' },
    card: 'coral',
    courses: [
      {
        id: 'anatomy-physiology',
        title: 'Anatomy & Physiology',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'A tour of the human body, from tissues to the hormones that keep every system in balance.',
        skills: ['Anatomy', 'Physiology', 'Tissues', 'Endocrine system'],
        lessons: [
          { title: 'Introduction to anatomy & physiology', youtube: 'uBGl2BujkPQ', channel: cc },
          { title: 'Tissues, part 1', youtube: 'i5tR3csCWYo', channel: cc },
          { title: 'Endocrine system: glands & hormones', youtube: 'eWHH9je2zG4', channel: cc },
        ],
      },
      {
        id: 'public-health',
        title: 'Introduction to Public Health',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'What public health is, how biology and environment shape health, and where the field is heading.',
        skills: ['Public health', 'Epidemiology basics', 'Health policy'],
        lessons: [
          { title: 'What is public health?', youtube: '5aww-Bpgkf4', channel: cc },
          { title: 'How your biology affects your health', youtube: 'SzsifG0UvTM', channel: cc },
          { title: 'The future of public health', youtube: 'VvRr0oL6s_E', channel: cc },
        ],
      },
      {
        id: 'nutrition-and-sleep',
        title: 'Nutrition, Metabolism & Sleep',
        instructor: 'CrashCourse · TED',
        level: 'Beginner',
        summary: 'How your body turns food into energy, and why sleep is the most underrated health habit there is.',
        skills: ['Metabolism', 'Nutrition', 'Sleep science'],
        lessons: [
          { title: 'Metabolism & nutrition, part 1', youtube: 'fR3NxCR9z2U', channel: cc },
          { title: 'Metabolism & nutrition, part 2', youtube: 'kb146Y1igTQ', channel: cc },
          { title: 'Sleep is your superpower (Matt Walker)', youtube: '5MuIMqhT8DM', channel: ted },
        ],
      },
    ],
  },
  {
    id: 'physical-science-engineering',
    title: 'Physical Science and Engineering',
    author: 'Physics · Chemistry · Engineering',
    genres: ['Science'],
    blurb: 'Study the laws that shape the physical world and apply them to design, build and solve real engineering problems.',
    cover: { bg: '#5b1022', fg: '#ffd6dd', accent: '#ffcf33', motif: 'moon' },
    card: 'coral',
    courses: [
      {
        id: 'physics-foundations',
        title: 'Physics Foundations',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'Describe motion precisely and meet the calculus that physics is written in.',
        skills: ['Kinematics', 'Derivatives', 'Motion'],
        lessons: [
          { title: 'Motion in a straight line', youtube: 'ZM8ECpBuQYE', channel: cc },
          { title: 'Derivatives', youtube: 'ObHJJYvu3RE', channel: cc },
        ],
      },
      {
        id: 'chemistry-foundations',
        title: 'Chemistry Foundations',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'Start inside the atom, then learn the unit conversions and significant figures every lab depends on.',
        skills: ['Atomic structure', 'Units', 'Significant figures'],
        lessons: [
          { title: 'The nucleus', youtube: 'FSyAehMdpyI', channel: cc },
          { title: 'Unit conversion & significant figures', youtube: 'hQpQ0hxVNTg', channel: cc },
        ],
      },
      {
        id: 'intro-to-engineering',
        title: 'Introduction to Engineering',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'What engineers actually do, and a first look at civil engineering — the discipline that builds the world around us.',
        skills: ['Engineering design', 'Civil engineering'],
        lessons: [
          { title: 'What is engineering?', youtube: 'btGYcizV0iI', channel: cc },
          { title: 'Civil engineering', youtube: '-xbtnz4wdaA', channel: cc },
        ],
      },
    ],
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
    courses: [
      {
        id: 'learn-anything-faster',
        title: 'Learn Anything Faster',
        instructor: 'TEDx · TED',
        level: 'Beginner',
        summary: 'Beat procrastination, protect your focus and get good at new skills in your first 20 hours of practice.',
        skills: ['Skill acquisition', 'Focus', 'Procrastination'],
        lessons: [
          { title: 'The first 20 hours: how to learn anything (Josh Kaufman)', youtube: '5MgBikgcWnY', channel: 'TEDx Talks' },
          { title: 'Inside the mind of a master procrastinator (Tim Urban)', youtube: 'arj7oStGLkU', channel: ted },
          { title: 'Quit social media (Cal Newport)', youtube: '3E7hkPZ-HTk', channel: 'TEDx Talks' },
        ],
      },
      {
        id: 'communication-confidence',
        title: 'Communication & Confidence',
        instructor: 'TED',
        level: 'Beginner',
        summary: 'Speak so people want to listen and use body language that changes how others — and you — see yourself.',
        skills: ['Public speaking', 'Body language', 'Presence'],
        lessons: [
          { title: 'How to speak so that people want to listen (Julian Treasure)', youtube: 'eIho2S0ZahI', channel: ted },
          { title: 'Your body language may shape who you are (Amy Cuddy)', youtube: 'Ks-_Mh1QhMc', channel: ted },
        ],
      },
      {
        id: 'mindset-resilience',
        title: 'Mindset & Resilience',
        instructor: 'TED',
        level: 'Beginner',
        summary: 'The research behind grit and vulnerability, and how both help you keep going when things get hard.',
        skills: ['Grit', 'Resilience', 'Emotional intelligence'],
        lessons: [
          { title: 'Grit: the power of passion and perseverance (Angela Lee Duckworth)', youtube: 'H14bBuluwB8', channel: ted },
          { title: 'The power of vulnerability (Brené Brown)', youtube: 'iCvmsMzlF7o', channel: ted },
        ],
      },
    ],
  },
  {
    id: 'social-sciences',
    title: 'Social Sciences',
    author: 'Psychology · Economics · Society',
    genres: ['Humanities'],
    blurb: 'Discover why people and societies behave the way they do through psychology, economics, sociology and politics.',
    cover: { bg: '#1f6b4f', fg: '#fff8ec', accent: '#ffcf33', motif: 'rings' },
    card: 'mint',
    courses: [
      {
        id: 'intro-psychology',
        title: 'Introduction to Psychology',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'Where psychology came from and how psychologists design research to study the mind.',
        skills: ['Psychology', 'Research methods'],
        lessons: [
          { title: 'Intro to psychology', youtube: 'vo4pMVb0R6M', channel: cc },
          { title: 'Psychological research', youtube: 'hFV71QPvX2I', channel: cc },
        ],
      },
      {
        id: 'economics-basics',
        title: 'Economics Basics',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'Scarcity, trade and economic systems — the big ideas behind every headline about the economy.',
        skills: ['Microeconomics', 'Trade', 'Macroeconomics'],
        lessons: [
          { title: 'Intro to economics', youtube: '3ez10ADR_gM', channel: cc },
          { title: 'Specialization and trade', youtube: 'NI9TLDIPVcs', channel: cc },
          { title: 'Economic systems and macroeconomics', youtube: 'B43YEW2FvDs', channel: cc },
        ],
      },
      {
        id: 'sociology-basics',
        title: 'Sociology Basics',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'Look at everyday life through a sociologist’s eyes and meet the paradigms they use to explain society.',
        skills: ['Sociology', 'Social theory'],
        lessons: [
          { title: 'What is sociology?', youtube: 'YnCJU6PaCio', channel: cc },
          { title: 'Major sociological paradigms', youtube: 'DbTt_ySTjaY', channel: cc },
        ],
      },
    ],
  },
  {
    id: 'language-learning',
    title: 'Language Learning',
    author: 'Speaking · Writing · Culture',
    genres: ['Skills', 'Humanities'],
    blurb: 'Pick up a new language or polish one you already know, with practice in speaking, listening, writing and culture.',
    cover: { bg: '#3355ff', fg: '#fff8ec', accent: '#a8f0d4', motif: 'wave' },
    card: 'cobalt',
    courses: [
      {
        id: 'how-to-learn-languages',
        title: 'How to Learn Any Language',
        instructor: 'TED · TEDx · Poly-glot-a-lot',
        level: 'Beginner',
        summary: 'Polyglots share the methods that actually work — so whichever language you choose, you learn it faster.',
        skills: ['Language acquisition', 'Study methods'],
        lessons: [
          { title: 'How to learn any language in six months (Chris Lonsdale)', youtube: 'd0yGdNEWdn0', channel: 'TEDx Talks' },
          { title: 'The secrets of learning a new language (Lýdia Machová)', youtube: 'o_XVt5rdpFY', channel: ted },
          { title: 'How to acquire any language, not learn it', youtube: 'illApgaLgGA', channel: 'Poly-glot-a-lot' },
        ],
      },
      {
        id: 'spanish-for-beginners',
        title: 'Spanish for Beginners',
        instructor: 'Spanish with Wes · The Language Tutor',
        level: 'Beginner',
        summary: 'Start speaking Spanish from lesson one, with the alphabet and pronunciation to back it up.',
        skills: ['Spanish', 'Pronunciation', 'Basic grammar'],
        lessons: [
          { title: 'Complete Spanish course: introduction', youtube: 'D0DOn3Gfww0', channel: 'Spanish with Wes!' },
          { title: 'Lesson 1: the basics', youtube: 'Jni1jFR3lao', channel: 'Spanish with Wes!' },
          { title: 'How to pronounce letters in Spanish', youtube: 'kJQjXAVEWt0', channel: 'The Language Tutor - Spanish' },
        ],
      },
      {
        id: 'french-for-beginners',
        title: 'French for Beginners',
        instructor: 'NLF Academy · The Language Tutor',
        level: 'Beginner',
        summary: 'Your first steps in French: the course roadmap, the alphabet and counting with confidence.',
        skills: ['French', 'Pronunciation', 'Numbers'],
        lessons: [
          { title: 'Learning French for beginners: introduction', youtube: 'ef_-6iUP3BQ', channel: 'NLF Academy' },
          { title: 'Master the French alphabet', youtube: '-JhOFyw2WlI', channel: 'The Language Tutor - French' },
          { title: 'How to count in French', youtube: 'DGCB0ySwfok', channel: 'The Language Tutor - French' },
        ],
      },
    ],
  },
  {
    id: 'arts-humanities',
    title: 'Arts and Humanities',
    author: 'History · Philosophy · Music',
    genres: ['Humanities'],
    blurb: 'Explore the ideas and creativity that shape culture — history, philosophy, literature, music and the visual arts.',
    cover: { bg: '#fff1c9', fg: '#141115', accent: '#ff5470', motif: 'arch' },
    card: 'lilac',
    courses: [
      {
        id: 'intro-to-philosophy',
        title: 'Introduction to Philosophy',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'What philosophy is for, and how to build — and take apart — a good argument.',
        skills: ['Philosophy', 'Logic', 'Critical thinking'],
        lessons: [
          { title: 'What is philosophy?', youtube: '1A_CAkYt3GY', channel: cc },
          { title: 'How to argue: philosophical reasoning', youtube: 'NKEhdsnKKHs', channel: cc },
          { title: 'How to argue: induction & abduction', youtube: '-wrCpLJ1XAw', channel: cc },
        ],
      },
      {
        id: 'world-history',
        title: 'World History',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'Start at the beginning of civilisation: farming, cities and the Indus Valley.',
        skills: ['World history', 'Ancient civilisations'],
        lessons: [
          { title: 'The agricultural revolution', youtube: 'Yocja_N5s1I', channel: cc },
          { title: 'Indus Valley civilization', youtube: 'n7ndRwqJYDM', channel: cc },
        ],
      },
      {
        id: 'art-and-literature',
        title: 'Art & Literature',
        instructor: 'CrashCourse',
        level: 'Beginner',
        summary: 'Why we study art and why we read — two short introductions to looking and reading more closely.',
        skills: ['Art history', 'Literary analysis'],
        lessons: [
          { title: 'Why we study art', youtube: 't6Wc7OMks4U', channel: cc },
          { title: 'How and why we read', youtube: 'MSYw502dJNY', channel: cc },
        ],
      },
      {
        id: 'music-theory',
        title: 'Music Theory Essentials',
        instructor: 'Andrew Huang · David Bennett',
        level: 'Beginner',
        summary: 'Scales, chords and keys explained in two fast, friendly sessions — no sheet-music reading required.',
        skills: ['Scales', 'Chords', 'Keys', 'Harmony'],
        lessons: [
          { title: 'Learn music theory in half an hour', youtube: 'rgaTLrZGlk0', channel: 'ANDREW HUANG' },
          { title: 'Learn music theory in 29 minutes', youtube: 'xZgU57B3ZGg', channel: 'David Bennett Music Theory' },
        ],
      },
    ],
  },
];

// Popular sub-topics listed on the home page ("Popular topics" section).
export const topics: { label: string; course: string }[] = [
  { label: 'Machine Learning', course: 'machine-learning-for-everybody' },
  { label: 'Python', course: 'programming-foundations' },
  { label: 'Data Analysis', course: 'data-analysis-with-python' },
  { label: 'Cloud & DevOps', course: 'cloud-and-devops' },
  { label: 'Cybersecurity', course: 'ethical-hacking' },
  { label: 'Marketing', course: 'digital-marketing' },
  { label: 'Leadership', course: 'leadership-soft-skills' },
  { label: 'Psychology', course: 'intro-psychology' },
  { label: 'Public Health', course: 'public-health' },
  { label: 'Philosophy', course: 'intro-to-philosophy' },
];

export const readersChoice = [
  { year: '2026', book: 'artificial-intelligence', note: 'The most-enrolled subject of the year, by a landslide.' },
  { year: '2025', book: 'data-science', note: 'The subject learners kept coming back to.' },
  { year: '2024', book: 'personal-development', note: 'Most-gifted subject of the year.' },
  { year: '2023', book: 'language-learning', note: 'Our very first learners’ favourite.' },
];

export const byId = (id: string) => books.find((b) => b.id === id)!;

export const allCourses = books.flatMap((b) => b.courses.map((c) => ({ ...c, category: b })));
export const courseById = (id: string) => allCourses.find((c) => c.id === id);
export const lessonCount = books.reduce((n, b) => n + b.courses.reduce((m, c) => m + c.lessons.length, 0), 0);
