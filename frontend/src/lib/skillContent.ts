// Centralized content for skill levels and examples for Java and Python
// Each level includes title, summary, bullets, and code samples

export type CodeSample = {
  language: 'java' | 'python';
  title: string;
  code: string;
  runnableNote?: string;
};

export type LevelContent = {
  id: string; // 'basic' | 'beginner' | 'intermediate' | 'advanced' | 'expert'
  title: string;
  summary: string;
  bullets: string[];
  samples: CodeSample[];
  resources?: { label: string; url: string }[];
};

export type SkillContentMap = Record<string, LevelContent[]>;

export const skillContent: SkillContentMap = {
  Java: [
    {
      id: 'basic',
      title: 'Basic — Getting Started',
      summary:
        'Install JDK, print output, variables, and simple input. Understand how to compile and run.',
      bullets: [
        'Install Java (JDK 17+ recommended)',
        'Use javac to compile and java to run',
        'Understand classes, main method, and System.out.println',
        'Primitive types and simple operators',
      ],
      samples: [
        {
          language: 'java',
          title: 'Hello World',
          code: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}`,
          runnableNote: 'Compile: javac Main.java → Run: java Main',
        },
      ],
      resources: [
        { label: 'Download JDK', url: 'https://adoptium.net' },
        { label: 'Java Tutorials', url: 'https://docs.oracle.com/javase/tutorial/' },
      ],
    },
    {
      id: 'beginner',
      title: 'Beginner — Control Flow & Methods',
      summary: 'If/else, loops, arrays, and methods. Practice small programs.',
      bullets: [
        'Conditionals: if/else, switch',
        'Loops: for, while, enhanced for',
        'Arrays and simple collections',
        'Methods: parameters, return values, overloading',
      ],
      samples: [
        {
          language: 'java',
          title: 'Sum Array',
          code: `public class SumArray {\n  static int sum(int[] nums) {\n    int total = 0;\n    for (int n : nums) total += n;\n    return total;\n  }\n  public static void main(String[] args) {\n    System.out.println(sum(new int[]{1,2,3,4}));\n  }\n}`,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate — OOP & Collections',
      summary: 'Classes, objects, inheritance, interfaces, and Java Collections Framework.',
      bullets: [
        'Encapsulation, inheritance, polymorphism',
        'Interfaces and abstract classes',
        'List, Set, Map basics',
        'Exceptions and try-with-resources',
      ],
      samples: [
        {
          language: 'java',
          title: 'Interface Example',
          code: `interface Greeter { String greet(String name); }\nclass FriendlyGreeter implements Greeter {\n  public String greet(String name) { return "Hello, " + name; }\n}\npublic class Demo {\n  public static void main(String[] args) {\n    Greeter g = new FriendlyGreeter();\n    System.out.println(g.greet("World"));\n  }\n}`,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced — Streams, Generics, Concurrency',
      summary: 'Write expressive code with streams and manage threads safely.',
      bullets: [
        'Generics basics and bounded types',
        'Streams: map, filter, reduce',
        'CompletableFuture and Executors',
        'Immutability and thread safety basics',
      ],
      samples: [
        {
          language: 'java',
          title: 'Streams Demo',
          code: `import java.util.*;\nimport java.util.stream.*;\npublic class StreamsDemo {\n  public static void main(String[] args) {\n    List<Integer> nums = Arrays.asList(1,2,3,4,5);\n    int sumSquares = nums.stream().map(n -> n*n).reduce(0, Integer::sum);\n    System.out.println(sumSquares);\n  }\n}`,
        },
      ],
    },
    {
      id: 'expert',
      title: 'Expert — Spring Boot & Best Practices',
      summary: 'Build REST APIs with Spring Boot, test thoroughly, and deploy.',
      bullets: [
        'Spring Boot controllers, services, repositories',
        'Validation, error handling, logging',
        'Testing with JUnit and Mockito',
        'Packaging and containerization basics',
      ],
      samples: [
        {
          language: 'java',
          title: 'Spring Boot Controller (snippet)',
          code: `@RestController\nclass HelloController {\n  @GetMapping("/hello")\n  String hello() { return "Hello"; }\n}`,
        },
      ],
      resources: [
        { label: 'Spring Boot Guide', url: 'https://spring.io/guides' },
      ],
    },
  ],
  Python: [
    {
      id: 'basic',
      title: 'Basic — Getting Started',
      summary: 'Install Python, run scripts, print, variables, and input.',
      bullets: [
        'Install Python 3.11+',
        'Use python to run and pip to install',
        'Numbers, strings, booleans',
        'Input/output and f-strings',
      ],
      samples: [
        {
          language: 'python',
          title: 'Hello World',
          code: `print("Hello, Python!")`,
        },
      ],
      resources: [
        { label: 'Download Python', url: 'https://www.python.org/downloads/' },
        { label: 'Official Tutorial', url: 'https://docs.python.org/3/tutorial/' },
      ],
    },
    {
      id: 'beginner',
      title: 'Beginner — Control Flow & Functions',
      summary: 'If/elif, loops, lists, dicts, and functions.',
      bullets: [
        'if/elif/else and truthy/falsy',
        'for, while loops and comprehensions',
        'Lists, dicts, sets, tuples',
        'Functions and default/keyword args',
      ],
      samples: [
        {
          language: 'python',
          title: 'Sum List',
          code: `def sum_list(nums):\n    return sum(nums)\n\nprint(sum_list([1,2,3,4]))`,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate — OOP & Modules',
      summary: 'Classes, imports, virtual environments, and packaging basics.',
      bullets: [
        'Classes and dataclasses',
        'Modules and packages',
        'venv basics',
        'Error handling with try/except',
      ],
      samples: [
        {
          language: 'python',
          title: 'Dataclass',
          code: `from dataclasses import dataclass\n\n@dataclass\nclass User:\n    id: int\n    name: str\n\nprint(User(1, 'Ada'))`,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced — Async & Typing',
      summary: 'Asyncio, type hints, and helpful tooling.',
      bullets: [
        'Type hints and mypy basics',
        'Asyncio async/await',
        'Generators and context managers',
        'Testing with pytest',
      ],
      samples: [
        {
          language: 'python',
          title: 'Async Example',
          code: `import asyncio\n\nasync def work(n):\n    await asyncio.sleep(0.1)\n    return n * 2\n\nasync def main():\n    results = await asyncio.gather(*(work(i) for i in range(5)))\n    print(results)\n\nasyncio.run(main())`,
        },
      ],
    },
    {
      id: 'expert',
      title: 'Expert — FastAPI & Best Practices',
      summary: 'Build APIs with FastAPI, validate with Pydantic, and test.',
      bullets: [
        'FastAPI routes and dependencies',
        'Pydantic models and validation',
        'Dockerizing and CI basics',
        'Observability: logging and tracing basics',
      ],
      samples: [
        {
          language: 'python',
          title: 'FastAPI Hello (snippet)',
          code: `from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/hello')\ndef hello():\n    return {'msg': 'Hello'}\n`,
        },
      ],
      resources: [
        { label: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com/' },
      ],
    },
  ],
};


