import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, CheckCircle, Lightbulb, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { Button } from '../ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Level, Challenge } from '../../lib/skillLevels.ts';

type Props = {
  skillName: 'Java' | 'Python';
  level: Level;
  challengeIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNextChallenge: () => void;
  onPrevChallenge: () => void;
};

export const LevelChallengeModal: React.FC<Props> = ({
  skillName,
  level,
  challengeIndex,
  isOpen,
  onClose,
  onNextChallenge,
  onPrevChallenge
}) => {
  const [activeTab, setActiveTab] = useState<'statement' | 'submissions' | 'ai-help'>('statement');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const challenge = level.challenges[challengeIndex];
  const isFirstChallenge = challengeIndex === 0;
  const isLastChallenge = challengeIndex === level.challenges.length - 1;

  React.useEffect(() => {
    if (isOpen && challenge) {
      setCode(challenge.code);
      setOutput('');
      setIsCompleted(false);
    }
  }, [isOpen, challenge]);

  const runCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      if (challenge?.language === 'python') {
        setOutput('Hello, Python!\nCode executed successfully!');
      } else {
        setOutput('Hello, Java!\nCode executed successfully!');
      }
      setIsRunning(false);
      setIsCompleted(true);
    }, 1000);
  };

  const commonDoubts = [
    "How to change the name in print()?",
    "What does print() function actually do?",
    "Can I print other types of messages?"
  ];

  if (!challenge) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-7xl mx-auto max-h-[90vh] overflow-hidden"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <Card className="border-0 shadow-2xl bg-gray-900 text-white h-full flex flex-col">
              <CardHeader className="border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {skillName} — {level.label} — Challenge {challengeIndex + 1}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-gray-800">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                {/* Progress Controls */}
                <div className="mt-3 flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={onPrevChallenge}
                    disabled={challengeIndex === 0}
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    Prev
                  </Button>
                  <div className="flex-1 h-2 bg-gray-800 rounded">
                    <div
                      className="h-2 bg-blue-600 rounded"
                      style={{ width: `${((challengeIndex + 1) / level.challenges.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-300 w-24 text-center">
                    {challengeIndex + 1} / {level.challenges.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={onNextChallenge}
                    disabled={challengeIndex === level.challenges.length - 1}
                    className="border-gray-600 text-white hover:bg-gray-800"
                  >
                    Next
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* Left Panel - Problem Statement */}
                <div className="w-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-gray-700 p-6 overflow-y-auto min-h-0">
                  {/* Tabs */}
                  <div className="flex space-x-1 mb-6">
                    {[
                      { id: 'statement', label: 'Statement' },
                      { id: 'submissions', label: 'Submissions' },
                      { id: 'ai-help', label: 'AI Help' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'statement' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-4">{challenge.title}</h2>
                        <p className="text-gray-300 leading-relaxed">{challenge.description}</p>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">Good example:</h3>
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                          <code className="text-green-400">{challenge.code}</code>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3">When executed, the code will output:</h3>
                        <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                          <pre className="text-gray-300">
                            {challenge.language === 'python' 
                              ? 'Hello, Python!' 
                              : 'Hello, Java!'
                            }
                          </pre>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                          <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                          Common doubts
                        </h3>
                        <div className="space-y-2">
                          {commonDoubts.map((doubt, index) => (
                            <button
                              key={index}
                              className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
                            >
                              {doubt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold mb-3">Did you like the problem?</h3>
                        <div className="flex items-center space-x-4">
                          <button className="flex items-center space-x-2 text-green-400 hover:text-green-300">
                            <ThumbsUp className="w-4 h-4" />
                            <span>Helpful</span>
                          </button>
                          <button className="flex items-center space-x-2 text-red-400 hover:text-red-300">
                            <ThumbsDown className="w-4 h-4" />
                            <span>Not helpful</span>
                          </button>
                          <button className="flex items-center space-x-2 text-blue-400 hover:text-blue-300">
                            <MessageCircle className="w-4 h-4" />
                            <span>Comment</span>
                          </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">38 users found this helpful</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'submissions' && (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No submissions yet. Complete the challenge to see your code here!</p>
                    </div>
                  )}

                  {activeTab === 'ai-help' && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">AI Assistant</h3>
                      <div className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                        <p className="text-gray-300">
                          Need help with this challenge? Ask our AI assistant for hints, explanations, or debugging help!
                        </p>
                        <Button className="mt-3 bg-blue-600 hover:bg-blue-700">
                          Ask AI for Help
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Panel - Code Editor */}
                <div className="w-full lg:w-1/2 p-6 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-4">
                    <select className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white">
                      <option value={challenge.language}>
                        {challenge.language === 'python' ? 'Python3' : 'Java'}
                      </option>
                    </select>
                    <div className="flex items-center space-x-2">
                      {isCompleted && (
                        <div className="flex items-center text-green-400">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">Completed!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scrollable content area (editor + output) */}
                  <div className="flex-1 min-h-0 overflow-y-auto space-y-4">
                    <div className="bg-gray-800 rounded-lg border border-gray-600 overflow-hidden min-h-[220px]">
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-[300px] lg:h-[calc(100%-0px)] p-4 bg-transparent text-white font-mono text-sm resize-none focus:outline-none"
                        placeholder="Write your code here..."
                      />
                    </div>

                    {output && (
                      <div className="bg-gray-800 rounded-lg border border-gray-600 p-4">
                        <h4 className="text-sm font-semibold mb-2 text-gray-300">Output:</h4>
                        <pre className="text-green-400 text-sm">{output}</pre>
                      </div>
                    )}

                    {/* Details Pane */}
                    <div className="bg-gray-900 rounded-lg border border-gray-700">
                      <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-800">Details</div>
                      <div className="p-4 text-gray-400 text-sm">No details to show</div>
                    </div>
                  </div>

                  {/* Persistent footer controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={onPrevChallenge}
                        disabled={isFirstChallenge}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={onNextChallenge}
                        disabled={isLastChallenge}
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        Next
                      </Button>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        Visualize Code
                      </Button>
                      <Button
                        onClick={runCode}
                        disabled={isRunning}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isRunning ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Running...
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Submit
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelChallengeModal;
