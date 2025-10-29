import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '../ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { skillContent, LevelContent } from '../../lib/skillContent.ts';
import { getSkillLevels, Level } from '../../lib/skillLevels.ts';
import LevelChallengeModal from './LevelChallengeModal.tsx';

import type { SkillOverview } from '../../lib/knowledge.ts';

type Props = {
  skillName: 'Java' | 'Python';
  isOpen: boolean;
  onClose: () => void;
  overview?: SkillOverview;
};

const tabs: { id: LevelContent['id']; label: string }[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'expert', label: 'Expert' },
];

export const SkillDetailModal: React.FC<Props> = ({ skillName, isOpen, onClose, overview }) => {
  const [activeTab, setActiveTab] = React.useState<LevelContent['id']>('basic');
  const [activeLevel, setActiveLevel] = React.useState<Level | null>(null);
  const [isFull, setIsFull] = React.useState(false);
  const [challengeModal, setChallengeModal] = React.useState<{
    isOpen: boolean;
    level: Level | null;
    challengeIndex: number;
  }>({ isOpen: false, level: null, challengeIndex: 0 });

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab('basic');
      setActiveLevel(null);
      setIsFull(false);
      setChallengeModal({ isOpen: false, level: null, challengeIndex: 0 });
    }
  }, [isOpen]);

  const levels = skillContent[skillName] ?? [];
  const current = levels.find((l) => l.id === activeTab) ?? levels[0];
  const ladder = getSkillLevels(skillName);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 z-50 ${isFull ? 'p-0' : 'p-4'} flex items-center justify-center`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            className={`relative w-full ${isFull ? 'max-w-none h-screen mx-0' : 'max-w-6xl mx-auto max-h-[90vh]'} overflow-hidden`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <Card className="border-0 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">
                  {skillName} — Guided Track (Basic → Expert)
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setIsFull(!isFull)}>
                    {isFull ? 'Exit full page' : 'Full page'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                {/* Overview (neat, structured from knowledge service) */}
                {overview && (
                  <div className="mb-6 p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70">
                    <h3 className="text-xl font-semibold mb-2">What is {overview.title}?</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{overview.intro}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Real-world examples</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                          {overview.realWorldExamples.map((c) => (<li key={c}>{c}</li>))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Learning path</h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                          {overview.learningPath.map((c) => (<li key={c.level}><span className="font-medium">{c.level}:</span> {c.focus}</li>))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {tabs.map((t) => (
                    <Button
                      key={t.id}
                      variant={activeTab === t.id ? 'default' : 'outline'}
                      onClick={() => setActiveTab(t.id)}
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>

                {/* Level ladder toggle */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">Progressive Levels (1–10)</h4>
                    <Button variant={activeLevel ? 'outline' : 'secondary'} onClick={() => setActiveLevel(activeLevel ? null : ladder[0])}>
                      {activeLevel ? 'Hide Levels' : 'Show Levels'}
                    </Button>
                  </div>
                  {activeLevel && (
                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {ladder.map((lv) => (
                        <button
                          key={lv.index}
                          className={`px-3 py-2 text-sm rounded border transition ${
                            lv.index === activeLevel.index ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                          onClick={() => setActiveLevel(lv)}
                        >
                          {lv.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={(activeLevel ? `level-${activeLevel.index}` : current?.id) as string}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    {activeLevel ? (
                      <>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{skillName} — {activeLevel.label}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{activeLevel.summary}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Complete the 5 mini challenges below. Start from the top and go in order. Each one builds to the next.</p>
                        </div>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {activeLevel.challenges.map((c, i) => (
                            <div 
                              key={c.title} 
                              className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-blue-500"
                              onClick={() => setChallengeModal({ isOpen: true, level: activeLevel, challengeIndex: i })}
                            >
                              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                                <span className="text-sm font-semibold">{i + 1}. {c.title}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">{c.language.toUpperCase()}</span>
                                  <span className="text-xs text-blue-600 dark:text-blue-400">Click to practice →</span>
                                </div>
                              </div>
                              <div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                {c.description}
                              </div>
                              <pre className="p-3 text-sm overflow-auto bg-white dark:bg-gray-900 max-h-32">{c.code}</pre>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{current?.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">{current?.summary}</p>
                          <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                            {current?.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>

                          {current?.resources && (
                            <div className="mt-4">
                              <h4 className="font-semibold mb-1">Further reading</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {current.resources.map((r) => (
                                  <li key={r.url}>
                                    <a className="text-blue-600 hover:underline" href={r.url} target="_blank" rel="noreferrer">
                                      {r.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {current?.samples.map((s) => (
                            <div key={s.title} className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                              <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                                <span className="text-sm font-semibold">{s.title}</span>
                                <span className="text-xs px-2 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
                                  {s.language.toUpperCase()}
                                </span>
                              </div>
                              <pre className="p-3 text-sm overflow-auto bg-white dark:bg-gray-900 max-h-32">{s.code}</pre>
                              {s.runnableNote && (
                                <div className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">{s.runnableNote}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
      
      {/* Level Challenge Modal */}
      {challengeModal.level && (
        <LevelChallengeModal
          skillName={skillName}
          level={challengeModal.level}
          challengeIndex={challengeModal.challengeIndex}
          isOpen={challengeModal.isOpen}
          onClose={() => setChallengeModal({ isOpen: false, level: null, challengeIndex: 0 })}
          onNextChallenge={() => {
            if (challengeModal.level && challengeModal.challengeIndex < challengeModal.level.challenges.length - 1) {
              setChallengeModal(prev => ({ ...prev, challengeIndex: prev.challengeIndex + 1 }));
            }
          }}
          onPrevChallenge={() => {
            if (challengeModal.challengeIndex > 0) {
              setChallengeModal(prev => ({ ...prev, challengeIndex: prev.challengeIndex - 1 }));
            }
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default SkillDetailModal;


