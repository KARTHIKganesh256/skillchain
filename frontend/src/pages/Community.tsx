import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.tsx';
import { Button } from '../components/ui/button.tsx';
import { Input } from '../components/ui/input.tsx';
import { Textarea } from '../components/ui/textarea.tsx';
import { Badge } from '../components/ui/badge.tsx';

type Post = {
  id: string;
  author: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
  comments: Comment[];
};

type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  aiVerdict?: 'correct' | 'needs-review' | 'unclear';
  aiReason?: string;
};

const samplePosts: Post[] = [
  {
    id: '1',
    author: 'Alice',
    title: 'How to optimize a Python loop?',
    body: 'I have a loop processing 1M rows; what are the best practices?',
    tags: ['python', 'performance'],
    createdAt: new Date().toISOString(),
    comments: [],
  },
  {
    id: '2',
    author: 'Bob',
    title: 'Java Streams vs loops',
    body: 'When should I use streams over traditional for loops?',
    tags: ['java', 'streams'],
    createdAt: new Date().toISOString(),
    comments: [],
  },
];

async function aiEvaluate(message: string): Promise<{ verdict: Comment['aiVerdict']; reason: string } | null> {
  const url = (import.meta as any)?.env?.VITE_AI_EVALUATOR_URL as string | undefined;
  if (!url) return null;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      verdict: (data?.verdict as any) || 'unclear',
      reason: data?.reason || 'No reason provided',
    };
  } catch {
    return null;
  }
}

const Community: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [filter, setFilter] = useState('');

  const filtered = useMemo(() => {
    const f = filter.trim().toLowerCase();
    if (!f) return posts;
    return posts.filter(p => p.title.toLowerCase().includes(f) || p.tags.some(t => t.includes(f)));
  }, [posts, filter]);

  const addPost = () => {
    if (!title || !body) return;
    const p: Post = {
      id: String(Date.now()),
      author: localStorage.getItem('userName') || 'Anonymous',
      title,
      body,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
      comments: [],
    };
    setPosts([p, ...posts]);
    setTitle('');
    setBody('');
    setTags('');
  };

  const addComment = async (postId: string, text: string) => {
    if (!text) return;
    const c: Comment = {
      id: String(Date.now()),
      author: localStorage.getItem('userName') || 'Anonymous',
      body: text,
      createdAt: new Date().toISOString(),
    };
    const verdict = await aiEvaluate(text);
    if (verdict) {
      c.aiVerdict = verdict.verdict;
      c.aiReason = verdict.reason;
    }
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...p.comments, c] } : p));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold">Community</h1>
          <div className="w-64">
            <Input placeholder="Search topics or tags..." value={filter} onChange={e => setFilter(e.target.value)} />
          </div>
        </div>

        <Card className="mb-8 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Start a Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
            <Textarea rows={3} placeholder="Describe your problem or idea..." value={body} onChange={e => setBody(e.target.value)} />
            <Input placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
            <div className="text-right">
              <Button onClick={addPost} className="bg-gradient-to-r from-blue-500 to-purple-600">Post</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {filtered.map((p) => (
            <Card key={p.id} className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold">{p.title}</h3>
                  <div className="flex gap-2">
                    {p.tags.map(t => (<Badge key={t}>{t}</Badge>))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{p.body}</p>
                <div className="text-sm text-gray-500 mb-4">by {p.author}</div>

                {/* Comments */}
                <div className="space-y-3">
                  {p.comments.map(c => (
                    <div key={c.id} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                      <div className="flex items-center justify-between mb-1 text-sm text-gray-500">
                        <span>{c.author}</span>
                        <span>{new Date(c.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-gray-800 dark:text-gray-200">{c.body}</div>
                      {c.aiVerdict && (
                        <div className="mt-2 text-xs">
                          <Badge className={c.aiVerdict === 'correct' ? 'bg-green-600' : c.aiVerdict === 'needs-review' ? 'bg-yellow-600' : 'bg-gray-600'}>
                            {c.aiVerdict === 'correct' ? 'AI: Likely Correct' : c.aiVerdict === 'needs-review' ? 'AI: Needs Review' : 'AI: Unclear'}
                          </Badge>
                          {c.aiReason && <span className="ml-2 text-gray-400">{c.aiReason}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <AddComment onSubmit={(text) => addComment(p.id, text)} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddComment: React.FC<{ onSubmit: (text: string) => void }> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  return (
    <div className="mt-4 flex gap-2">
      <Input placeholder="Write a reply..." value={text} onChange={e => setText(e.target.value)} />
      <Button
        onClick={() => {
          if (!text.trim()) return;
          onSubmit(text.trim());
          setText('');
        }}
      >
        Reply
      </Button>
    </div>
  );
};

export default Community;





