import React, { useState } from 'react';
import { Send, HelpCircle, Database, Sparkles } from 'lucide-react';
import { ScholarQAResults } from './ScholarQAResults';
import { ResourcesPanel } from './ResourcesPanel';

interface ScholarQAProps {
  papersCount?: number;
  onReset?: () => void;
}

export function ScholarQA({ papersCount = 9, onReset }: ScholarQAProps) {
  const [question, setQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [submittedQuestion, setSubmittedQuestion] = useState('');

  const handleSubmit = () => {
    if (question.trim()) {
      setSubmittedQuestion(question);
      setHasResults(true);
      console.log('Question submitted:', question);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setSubmittedQuestion('');
    setHasResults(false);
    setIsTyping(false);
    if (onReset) {
      onReset();
    }
  };

  // Expose reset function through ref or callback
  React.useEffect(() => {
    if (onReset) {
      // Store the reset function reference
      (window as any).__scholarQAReset = handleReset;
    }
    return () => {
      delete (window as any).__scholarQAReset;
    };
  }, [onReset]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Show results view if there are results
  if (hasResults) {
    return (
      <div className="flex-1 flex overflow-hidden">
        <ScholarQAResults question={submittedQuestion} papersCount={papersCount} />
        <ResourcesPanel />
      </div>
    );
  }

  // Show initial empty state
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
              <HelpCircle className="w-6 h-6 text-gray-400" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900 mb-2">
              Hi, Ask anything based on your own library.
            </h1>
            <p className="text-sm text-gray-500">
              提示：对话中输入"2"可生成表格对比模式
            </p>
          </div>

          {/* Question Input */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                  setIsTyping(e.target.value.length > 0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                rows={3}
                className="w-full px-5 py-4 pr-16 text-base border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400"
              />
              <button
                onClick={handleSubmit}
                disabled={!question.trim()}
                className="absolute right-4 bottom-4 p-2.5 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Library Info */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
              <Database className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                Your Library ({papersCount} papers with full text)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
          <Sparkles className="w-4 h-4" />
          <span>Unrestricted Scholar QA</span>
        </div>
      </div>
    </div>
  );
}