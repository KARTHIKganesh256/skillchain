export type Challenge = {
  title: string;
  description: string;
  code: string;
  language: 'java' | 'python';
};

export type Level = {
  index: number; // 1..10
  label: string; // e.g., "Level 1 — Basics"
  summary: string;
  challenges: Challenge[]; // 5 per level
};

const javaSnippetsByLevel: Record<number, Challenge[]> = {
  1: [
    { title: 'Print Hello', description: 'Print greeting to the console.', language: 'java', code: `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}` },
    { title: 'Variables', description: 'Declare int and String.', language: 'java', code: `public class Main {\n  public static void main(String[] args) {\n    int year = 2025; String name = "SkillChain";\n    System.out.println(name + " " + year);\n  }\n}` },
    { title: 'Sum Two Numbers', description: 'Add two numbers and print sum.', language: 'java', code: `public class Main {\n  public static void main(String[] args) {\n    int a = 2, b = 3;\n    System.out.println(a + b);\n  }\n}` },
    { title: 'If Condition', description: 'Check if number is positive.', language: 'java', code: `public class Main {\n  public static void main(String[] args) {\n    int n = 5;\n    if (n > 0) System.out.println("Positive");\n  }\n}` },
    { title: 'Loop 1..5', description: 'Use for-loop to print 1..5.', language: 'java', code: `public class Main {\n  public static void main(String[] args) {\n    for (int i=1;i<=5;i++) System.out.println(i);\n  }\n}` },
  ],
  2: [
    { title: 'Methods', description: 'Create and call a method.', language: 'java', code: `public class Main {\n  static int square(int n){ return n*n; }\n  public static void main(String[] args){ System.out.println(square(6)); }\n}` },
    { title: 'Arrays', description: 'Iterate an int array.', language: 'java', code: `public class Main {\n  public static void main(String[] args){\n    int[] a = {1,2,3}; int s=0; for(int n:a) s+=n; System.out.println(s);\n  }\n}` },
    { title: 'Switch', description: 'Switch on day number.', language: 'java', code: `public class Main {\n  public static void main(String[] args){\n    int d=3; switch(d){case 3 -> System.out.println("Wed"); default -> System.out.println("?");}\n  }\n}` },
    { title: 'String Ops', description: 'Length and uppercase.', language: 'java', code: `public class Main {\n  public static void main(String[] args){\n    String s = "java"; System.out.println(s.toUpperCase()+" "+s.length());\n  }\n}` },
    { title: 'While Loop', description: 'While until zero.', language: 'java', code: `public class Main {\n  public static void main(String[] args){\n    int n=3; while(n>0){ System.out.println(n); n--; }\n  }\n}` },
  ],
};

// Fill remaining Java levels with progressively harder examples
for (let i = 3; i <= 10; i++) {
  javaSnippetsByLevel[i] = javaSnippetsByLevel[i] || [
    { title: 'OOP Class', description: 'Make a simple class.', language: 'java', code: `class User { String name; User(String n){ name=n; } }\npublic class Main { public static void main(String[] a){ System.out.println(new User("Ada").name); } }` },
    { title: 'Interface', description: 'Implement an interface.', language: 'java', code: `interface A{int x();}\nclass B implements A{ public int x(){return 1;} }\npublic class Main{ public static void main(String[] a){ System.out.println(new B().x()); } }` },
    { title: 'Collections', description: 'Use List and Map.', language: 'java', code: `import java.util.*;\npublic class Main{ public static void main(String[] a){ List<Integer> l=Arrays.asList(1,2,3); Map<String,Integer> m=new HashMap<>(); m.put("a",1); System.out.println(l.size()+m.get("a")); } }` },
    { title: 'Streams', description: 'Map/filter/reduce.', language: 'java', code: `import java.util.*;\npublic class Main{ public static void main(String[] a){ int s = Arrays.asList(1,2,3,4).stream().filter(n->n%2==0).map(n->n*n).reduce(0,Integer::sum); System.out.println(s); } }` },
    { title: 'Concurrency', description: 'Use CompletableFuture.', language: 'java', code: `import java.util.concurrent.*;\npublic class Main{ public static void main(String[] a) throws Exception{ var f=CompletableFuture.supplyAsync(()->42); System.out.println(f.get()); } }` },
  ];
}

const pythonSnippetsByLevel: Record<number, Challenge[]> = {
  1: [
    { title: 'Print Hello', description: 'Print greeting.', language: 'python', code: `print("Hello, Python!")` },
    { title: 'Variables', description: 'Create and print.', language: 'python', code: `year = 2025\nname = 'SkillChain'\nprint(name, year)` },
    { title: 'Sum Two Numbers', description: 'Add numbers.', language: 'python', code: `a, b = 2, 3\nprint(a + b)` },
    { title: 'If Condition', description: 'Positive check.', language: 'python', code: `n = 5\nif n > 0:\n    print('Positive')` },
    { title: 'Loop 1..5', description: 'For loop.', language: 'python', code: `for i in range(1, 6):\n    print(i)` },
  ],
  2: [
    { title: 'Function', description: 'Define and call.', language: 'python', code: `def square(n):\n    return n*n\n\nprint(square(6))` },
    { title: 'List Sum', description: 'Sum list items.', language: 'python', code: `nums = [1,2,3]\nprint(sum(nums))` },
    { title: 'Dict', description: 'Basic dict ops.', language: 'python', code: `user = {'name':'Ada'}\nprint(user['name'])` },
    { title: 'Comprehension', description: 'Squares of even.', language: 'python', code: `print([n*n for n in range(6) if n%2==0])` },
    { title: 'While Loop', description: 'Countdown.', language: 'python', code: `n = 3\nwhile n>0:\n    print(n)\n    n -= 1` },
  ],
};

for (let i = 3; i <= 10; i++) {
  pythonSnippetsByLevel[i] = pythonSnippetsByLevel[i] || [
    { title: 'Class', description: 'Simple class.', language: 'python', code: `class User:\n    def __init__(self, name):\n        self.name = name\n\nprint(User('Ada').name)` },
    { title: 'Dataclass', description: 'Use dataclass.', language: 'python', code: `from dataclasses import dataclass\n\n@dataclass\nclass User:\n    id: int\n    name: str\n\nprint(User(1,'Ada'))` },
    { title: 'Typing', description: 'Type hints.', language: 'python', code: `from typing import List\n\ndef sum_list(nums: List[int]) -> int:\n    return sum(nums)\n\nprint(sum_list([1,2,3]))` },
    { title: 'Async', description: 'async/await.', language: 'python', code: `import asyncio\n\nasync def work(n):\n    await asyncio.sleep(0.05)\n    return n\n\nprint(asyncio.run(work(1)))` },
    { title: 'Context Manager', description: 'with statement.', language: 'python', code: `from contextlib import contextmanager\n\n@contextmanager\ndef temp():\n    print('enter')\n    yield\n    print('exit')\n\nwith temp():\n    print('do')` },
  ];
}

export function getSkillLevels(skill: 'Java' | 'Python'): Level[] {
  const src = skill === 'Java' ? javaSnippetsByLevel : pythonSnippetsByLevel;
  return Array.from({ length: 10 }, (_, i) => i + 1).map((idx) => ({
    index: idx,
    label: `Level ${idx}`,
    summary: idx <= 3
      ? 'Core language practice.'
      : idx <= 6
      ? 'OOP and standard library.'
      : idx <= 8
      ? 'Advanced features and patterns.'
      : 'Frameworks and production skills.',
    challenges: src[idx],
  }));
}


