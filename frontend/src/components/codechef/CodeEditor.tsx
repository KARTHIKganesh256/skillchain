import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Settings, 
  Terminal, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Copy,
  RotateCcw,
  Maximize2,
  Minimize2,
  Code,
  FileText,
  Zap,
  Target,
  BarChart3,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';

interface TestCase {
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'error';
  executionTime?: number;
  memoryUsed?: number;
}

interface Submission {
  id: string;
  code: string;
  language: string;
  status: 'pending' | 'running' | 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error';
  verdict: string;
  executionTime: number;
  memoryUsed: number;
  testCases: TestCase[];
  submittedAt: string;
  problemCode: string;
}

interface CodeEditorProps {
  problemCode: string;
  problemName: string;
  onSubmission?: (submission: Submission) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  problemCode, 
  problemName, 
  onSubmission 
}) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState(14);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTestCases, setShowTestCases] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [customOutput, setCustomOutput] = useState('');
  const [isCustomRunning, setIsCustomRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState('');

  const editorRef = useRef<HTMLTextAreaElement>(null);

  const languages = [
    { value: 'cpp', label: 'C++', extension: '.cpp' },
    { value: 'java', label: 'Java', extension: '.java' },
    { value: 'python', label: 'Python', extension: '.py' },
    { value: 'c', label: 'C', extension: '.c' },
    { value: 'javascript', label: 'JavaScript', extension: '.js' },
    { value: 'go', label: 'Go', extension: '.go' },
    { value: 'rust', label: 'Rust', extension: '.rs' }
  ];

  const themes = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'monokai', label: 'Monokai' },
    { value: 'github', label: 'GitHub' }
  ];

  // Sample test cases
  useEffect(() => {
    const sampleTestCases: TestCase[] = [
      {
        input: '5\n1 2 3 4 5',
        expectedOutput: '15',
        status: 'pending'
      },
      {
        input: '3\n10 20 30',
        expectedOutput: '60',
        status: 'pending'
      },
      {
        input: '1\n42',
        expectedOutput: '42',
        status: 'pending'
      }
    ];
    setTestCases(sampleTestCases);
  }, [problemCode]);

  // Sample code templates
  useEffect(() => {
    const templates: { [key: string]: string } = {
      cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Your code here
        
        sc.close();
    }
}`,
      python: `# Read input
n = int(input())
arr = list(map(int, input().split()))

# Your code here

# Print output
print(result)`,
      c: `#include <stdio.h>

int main() {
    // Your code here
    
    return 0;
}`,
      javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (line) => {
    // Your code here
});`,
      go: `package main

import (
    "fmt"
    "bufio"
    "os"
)

func main() {
    scanner := bufio.NewScanner(os.Stdin)
    
    // Your code here
}`,
      rust: `use std::io;

fn main() {
    let mut input = String::new();
    io::stdin().read_line(&mut input).unwrap();
    
    // Your code here
}`
    };

    if (templates[language]) {
      setCode(templates[language]);
    }
  }, [language]);

  const handleRun = async () => {
    setIsRunning(true);
    setTerminalOutput('Running code...\n');
    
    // Simulate code execution
    setTimeout(() => {
      setTerminalOutput(prev => prev + 'Code executed successfully!\n');
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate submission
    const submission: Submission = {
      id: Date.now().toString(),
      code,
      language,
      status: 'running',
      verdict: 'Running...',
      executionTime: 0,
      memoryUsed: 0,
      testCases: testCases.map(tc => ({ ...tc, status: 'running' })),
      submittedAt: new Date().toISOString(),
      problemCode
    };

    setCurrentSubmission(submission);
    setSubmissions(prev => [submission, ...prev]);

    // Simulate test case execution
    setTimeout(() => {
      const updatedSubmission: Submission = {
        ...submission,
        status: 'accepted',
        verdict: 'Accepted',
        executionTime: 125,
        memoryUsed: 1024,
        testCases: testCases.map(tc => ({
          ...tc,
          status: 'passed',
          actualOutput: tc.expectedOutput,
          executionTime: Math.random() * 100,
          memoryUsed: Math.random() * 500
        }))
      };

      setCurrentSubmission(updatedSubmission);
      setSubmissions(prev => prev.map(s => s.id === submission.id ? updatedSubmission : s));
      setIsSubmitting(false);

      if (onSubmission) {
        onSubmission(updatedSubmission);
      }
    }, 3000);
  };

  const handleCustomRun = async () => {
    setIsCustomRunning(true);
    setCustomOutput('Running with custom input...\n');
    
    // Simulate custom execution
    setTimeout(() => {
      setCustomOutput(prev => prev + `Input: ${customInput}\nOutput: ${customInput.split(' ').length}\n`);
      setIsCustomRunning(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-gray-500',
      running: 'text-blue-500',
      passed: 'text-green-500',
      failed: 'text-red-500',
      error: 'text-red-500',
      accepted: 'text-green-500',
      wrong_answer: 'text-red-500',
      time_limit_exceeded: 'text-yellow-500',
      runtime_error: 'text-red-500',
      compilation_error: 'text-red-500'
    };
    return colors[status as keyof typeof colors] || 'text-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
      case 'wrong_answer':
      case 'runtime_error':
      case 'compilation_error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`h-screen flex flex-col bg-gray-50 dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {problemName} ({problemCode})
              </h2>
            </div>
            <Badge variant="outline" className="font-mono">
              {language.toUpperCase()}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  >
                    {themes.map(th => (
                      <option key={th.value} value={th.value}>
                        {th.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    {fontSize}px
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Toolbar */}
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRun}
                disabled={isRunning}
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running...' : 'Run'}
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || !code.trim()}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTerminal(!showTerminal)}
              >
                <Terminal className="w-4 h-4 mr-2" />
                Terminal
              </Button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-0 resize-none focus:outline-none"
              style={{ fontSize: `${fontSize}px` }}
              placeholder="Enter your code here..."
              spellCheck={false}
            />
            <div className="absolute top-4 right-4 text-xs text-gray-500">
              {code.split('\n').length} lines
            </div>
          </div>

          {/* Terminal */}
          <AnimatePresence>
            {showTerminal && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 200 }}
                exit={{ height: 0 }}
                className="bg-gray-900 text-green-400 p-4 font-mono text-sm border-t border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400">Terminal Output</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTerminalOutput('')}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel */}
        <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Panel Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowTestCases(true)}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                showTestCases
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setShowTestCases(false)}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                !showTestCases
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              Submissions
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto">
            {showTestCases ? (
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Test Cases
                </h3>
                
                {/* Custom Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Custom Input
                  </label>
                  <textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full h-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                    placeholder="Enter custom input..."
                  />
                  <Button
                    size="sm"
                    onClick={handleCustomRun}
                    disabled={isCustomRunning || !customInput.trim()}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isCustomRunning ? 'Running...' : 'Run Custom'}
                  </Button>
                </div>

                {/* Custom Output */}
                {customOutput && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Output
                    </label>
                    <pre className="w-full p-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-mono text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {customOutput}
                    </pre>
                  </div>
                )}

                {/* Test Cases */}
                <div className="space-y-3">
                  {testCases.map((testCase, index) => (
                    <Card key={index} className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Test Case {index + 1}
                        </span>
                        {getStatusIcon(testCase.status)}
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Input:</span>
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-gray-500 dark:text-gray-400">Expected:</span>
                          <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                            {testCase.expectedOutput}
                          </pre>
                        </div>
                        {testCase.actualOutput && (
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Actual:</span>
                            <pre className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                              {testCase.actualOutput}
                            </pre>
                          </div>
                        )}
                        {testCase.executionTime && (
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Time: {testCase.executionTime.toFixed(2)}ms</span>
                            <span>Memory: {testCase.memoryUsed}KB</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Submissions
                </h3>
                
                {submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No submissions yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {submissions.map((submission) => (
                      <Card key={submission.id} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(submission.status)}
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {submission.verdict}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(submission.submittedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{submission.language.toUpperCase()}</span>
                          <span>{submission.executionTime}ms</span>
                          <span>{submission.memoryUsed}KB</span>
                        </div>
                        <div className="mt-2">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Test Cases: {submission.testCases.filter(tc => tc.status === 'passed').length}/{submission.testCases.length}
                          </div>
                          <Progress 
                            value={(submission.testCases.filter(tc => tc.status === 'passed').length / submission.testCases.length) * 100}
                            className="h-1"
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
