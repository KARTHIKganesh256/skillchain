// Lightweight Wikipedia-powered knowledge fetcher with simple structuring
// We fetch a summary and sections, then shape them into a human-friendly overview.

export type SkillOverview = {
  title: string;
  intro: string;
  keyConcepts: string[];
  realWorldExamples: string[];
  learningPath: { level: string; focus: string }[];
  sourceHint?: string; // not shown in UI
  aiEnhanced?: boolean;
};

const CACHE_KEY_PREFIX = 'skill_overview_cache_v1_';

function setCache(name: string, data: SkillOverview) {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + name.toLowerCase(), JSON.stringify({ t: Date.now(), data }));
  } catch {}
}

function getCache(name: string): SkillOverview | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY_PREFIX + name.toLowerCase());
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // 7 days cache
    if (Date.now() - parsed.t > 7 * 24 * 60 * 60 * 1000) return null;
    return parsed.data as SkillOverview;
  } catch {
    return null;
  }
}

function normalizeSkillName(name: string) {
  // Map common aliases to article titles
  const map: Record<string, string> = {
    'java': 'Java (programming language)',
    'python': 'Python (programming language)',
    'javascript': 'JavaScript',
    'js': 'JavaScript',
    'typescript': 'TypeScript',
    'ts': 'TypeScript',
    'node.js': 'Node.js',
    'nodejs': 'Node.js',
    'react': 'React (software)',
    'react.js': 'React (software)',
    'c++': 'C++',
    'c/c++': 'C++',
  };
  const key = name.trim().toLowerCase();
  return map[key] ?? name;
}

async function fetchWikipediaSummary(topic: string) {
  const title = encodeURIComponent(topic);
  // Use REST summary API for concise text
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('summary fetch failed');
  return res.json();
}

async function fetchWikipediaPlainExtract(topic: string) {
  const title = encodeURIComponent(topic);
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&origin=*&titles=${title}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('extract fetch failed');
  const json = await res.json();
  const pages = json?.query?.pages ?? {};
  const firstKey = Object.keys(pages)[0];
  return pages[firstKey]?.extract || '';
}

function splitIntoSentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

function extractKeyConcepts(extract: string, max = 8): string[] {
  // Prefer bullet-like items and section headings; avoid geographic or unrelated terms
  const lines = extract.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const candidates: string[] = [];

  for (const line of lines.slice(0, 200)) {
    if (/^==+\s*.+\s*==+$/.test(line)) {
      const heading = line.replace(/=+/g, '').trim();
      if (/program|language|syntax|history|applications|features|design|typing|library|runtime|ecosystem/i.test(heading)) {
        candidates.push(heading);
      }
      continue;
    }
    if (/^(\*|-|•)\s+/.test(line)) {
      const item = line.replace(/^([*\-•])\s+/, '').trim();
      if (/compiler|interpreter|oop|functional|generics|garbage|module|package|concurrency|thread|async|standard|runtime|vm|jvm|ecosystem|tooling|typing|duck/i.test(item)) {
        candidates.push(item);
      }
    }
    if (candidates.length >= max) break;
  }

  if (candidates.length === 0) {
    // Fallback generic concepts
    return ['Overview', 'Syntax basics', 'Data types', 'Control flow', 'Functions', 'OOP', 'Standard library', 'Use cases'].slice(0, max);
  }
  return Array.from(new Set(candidates)).slice(0, max);
}

function buildLearningPath(skill: string): { level: string; focus: string }[] {
  return [
    { level: 'Level 1', focus: `Basics of ${skill}: syntax and hello world` },
    { level: 'Level 2', focus: 'Control flow and data types' },
    { level: 'Level 3', focus: 'Functions/Methods and modular code' },
    { level: 'Level 4', focus: 'Collections and standard library' },
    { level: 'Level 5', focus: 'Error handling and testing' },
    { level: 'Level 6', focus: 'OOP or core paradigms' },
    { level: 'Level 7', focus: 'Concurrency/async and performance' },
    { level: 'Level 8', focus: 'Ecosystem tooling and packaging' },
    { level: 'Level 9', focus: 'Frameworks and real projects' },
    { level: 'Level 10', focus: 'Best practices and deployment' },
  ];
}

function craftExamples(skill: string): string[] {
  switch (skill.toLowerCase()) {
    case 'java':
      return [
        'Build a REST API for a bookstore (CRUD) using a popular framework',
        'Process CSV sales data and generate monthly reports',
        'Create a multithreaded image downloader',
      ];
    case 'python':
      return [
        'Automate renaming files and generating image thumbnails',
        'Analyze a CSV dataset and visualize charts',
        'Build a small FastAPI service to serve predictions',
      ];
    default:
      return [
        `Create a small project showcasing ${skill} in a real scenario`,
        'Solve 10 practical exercises increasing in difficulty',
        'Document what you learned with code snippets and tips',
      ];
  }
}

function curatedConcepts(skill: string): string[] | null {
  const s = skill.toLowerCase();
  if (s === 'python') {
    return [
      'Syntax basics',
      'Numbers & strings',
      'Lists, tuples, sets',
      'Dictionaries',
      'Control flow',
      'Functions & modules',
      'Classes & OOP',
      'Virtual environments & packages',
    ];
  }
  if (s === 'java') {
    return [
      'Syntax & primitives',
      'Strings & arrays',
      'OOP (classes, interfaces)',
      'Collections & generics',
      'Exceptions',
      'Streams & lambdas',
      'Concurrency & threads',
      'JVM & garbage collection',
    ];
  }
  if (s === 'javascript' || s === 'typescript') {
    return [
      'Syntax & types',
      'Strings & arrays',
      'Objects & prototypes',
      'Functions & closures',
      'Promises & async/await',
      'Modules & tooling',
      'DOM & events (JS)',
      'Generics & utility types (TS)',
    ];
  }
  return null;
}

export async function fetchSkillOverview(skillName: string): Promise<SkillOverview> {
  const cached = getCache(skillName);
  if (cached) return cached;

  let topic = normalizeSkillName(skillName);
  try {
    let [summary, extract] = await Promise.all([
      fetchWikipediaSummary(topic),
      fetchWikipediaPlainExtract(topic),
    ]);

    // If Wikipedia returned a disambiguation or generic page, force programming article
    const looksLikeDisambiguation =
      (summary as any)?.type === 'disambiguation' ||
      /may refer to/i.test(summary?.extract || '') ||
      /may refer to/i.test(extract || '');
    if (looksLikeDisambiguation && !/\(programming language\)/i.test(topic)) {
      topic = `${topic} (programming language)`;
      [summary, extract] = await Promise.all([
        fetchWikipediaSummary(topic),
        fetchWikipediaPlainExtract(topic),
      ]);
    }

    // Optional AI agent to structure content if provided via env (VITE_AI_STRUCTURER_URL)
    let overview: SkillOverview | null = null;
    const aiUrl = (import.meta as any)?.env?.VITE_AI_STRUCTURER_URL as string | undefined;
    if (aiUrl) {
      try {
        const aiRes = await fetch(aiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skill: skillName, title: summary?.title || topic, summary: summary?.extract || '', extract }),
        });
        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          if (aiJson?.intro && aiJson?.keyConcepts && aiJson?.learningPath) {
            overview = {
              title: aiJson.title || summary?.title || topic,
              intro: aiJson.intro,
              keyConcepts: aiJson.keyConcepts,
              realWorldExamples: aiJson.realWorldExamples?.length ? aiJson.realWorldExamples : craftExamples(skillName),
              learningPath: aiJson.learningPath,
              sourceHint: 'wikipedia+ai',
              aiEnhanced: true,
            };
          }
        }
      } catch {}
    }

    if (!overview) {
      const intro = summary?.extract || splitIntoSentences(extract).slice(0, 3).join(' ');
      // Extract and filter key concepts strictly to programming-related phrases
      const rawConcepts = extractKeyConcepts(extract, 16);
      const allow = /(program|language|syntax|types?|data|control flow|function|method|class|object|oop|module|package|library|runtime|ecosystem|tooling|compiler|interpreter|vm|jvm|garbage|memory|concurrency|thread|async|testing|best practices|framework)/i;
      const block = /(snake|reptile|island|africa|asia|australia|sunda|species|genus|geography|music|film|ship|tv|aircraft)/i;
      const keyConcepts = rawConcepts
        .filter(c => allow.test(c) && !block.test(c))
        .slice(0, 8);
      const curated = curatedConcepts(skillName);
      if (keyConcepts.length < 6 || block.test(rawConcepts.join(' '))) {
        if (curated) {
          keyConcepts.splice(0, keyConcepts.length, ...curated);
        } else if (keyConcepts.length === 0) {
          keyConcepts.push(
            'Syntax basics',
            'Data types',
            'Control flow',
            'Functions/Methods',
            'OOP & classes',
            'Standard library',
            'Ecosystem & tooling',
            'Use cases'
          );
        }
      }
      const realWorldExamples = craftExamples(skillName);
      const learningPath = buildLearningPath(skillName);
      overview = {
        title: summary?.title || topic,
        intro,
        keyConcepts,
        realWorldExamples,
        learningPath,
        sourceHint: 'wikipedia',
        aiEnhanced: false,
      };
    }
    setCache(skillName, overview);
    return overview;
  } catch (e) {
    // Fallback minimal overview
    const fallback: SkillOverview = {
      title: topic,
      intro: `${topic} — key ideas and practical use-cases.`,
      keyConcepts: ['Overview', 'Syntax basics', 'Data types', 'Control flow', 'Functions', 'OOP', 'Standard library', 'Use cases'],
      realWorldExamples: craftExamples(skillName),
      learningPath: buildLearningPath(skillName),
      aiEnhanced: false,
    };
    return fallback;
  }
}


