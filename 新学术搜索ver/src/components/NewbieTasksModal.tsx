import React from 'react';
import { X, ChevronRight, Mail } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  credits: number;
  completed: boolean;
  action: string;
  onAction: () => void;
}

interface NewbieTasksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onOpenInvite: () => void;
  onTriggerDeepSearchTooltip: () => void;
}

export function NewbieTasksModal({ isOpen, onClose, onNavigate, onOpenInvite, onTriggerDeepSearchTooltip }: NewbieTasksModalProps) {
  if (!isOpen) return null;

  const tasks: Task[] = [
    {
      id: '1',
      title: 'Experience Deep Search',
      description: 'AI reads 100 papers for you, generating a review.',
      credits: 100,
      completed: false,
      action: 'Go Experience',
      onAction: () => {
        onNavigate('list');
        onTriggerDeepSearchTooltip();
        onClose();
      }
    },
    {
      id: '2',
      title: 'Subscribe to AI Feeds',
      description: 'Never miss an important new paper.',
      credits: 50,
      completed: false,
      action: 'Go Subscribe',
      onAction: () => {
        onNavigate('list');
        onClose();
      }
    },
    {
      id: '3',
      title: 'Chat with AI',
      description: 'Ask AI assistant about research topics.',
      credits: 50,
      completed: false,
      action: 'Go Chat',
      onAction: () => {
        onNavigate('chat');
        onClose();
      }
    },
    {
      id: '4',
      title: 'Build Your Library',
      description: 'Save your first paper to library.',
      credits: 30,
      completed: false,
      action: 'Go Library',
      onAction: () => {
        onNavigate('library');
        onClose();
      }
    },
    {
      id: '5',
      title: 'Read a Paper',
      description: 'Open and read a paper with translation.',
      credits: 50,
      completed: true,
      action: 'Completed',
      onAction: () => {}
    },
    {
      id: '6',
      title: 'Add Notes',
      description: 'Write your first note on a paper.',
      credits: 40,
      completed: false,
      action: 'Go Try',
      onAction: () => {
        onNavigate('list');
        onClose();
      }
    },
    {
      id: '7',
      title: 'Share Insights',
      description: 'Share a paper or insight with others.',
      credits: 60,
      completed: false,
      action: 'Go Share',
      onAction: () => {
        onNavigate('list');
        onClose();
      }
    }
  ];

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const fundedCredits = tasks.filter(t => t.completed).reduce((sum, t) => sum + t.credits, 0);
  const progressPercentage = (completedTasks / totalTasks) * 100;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl z-50 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">New Researcher Grant</h2>
          <p className="text-center text-gray-600 mb-4">Time Remaining: 6d 23h 15m</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Progress:</span>
              <div className="relative w-48 h-6 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-gray-700 to-gray-900 transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-gray-700 mix-blend-difference">{completedTasks}/{totalTasks}</span>
                </div>
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Funded: </span>
              <span className="font-semibold text-gray-900">{fundedCredits} Credits</span>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="overflow-y-auto max-h-[calc(80vh-280px)] px-8 py-4">
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`border-2 rounded-lg p-5 transition-all ${
                  task.completed 
                    ? 'border-gray-400 bg-gray-50' 
                    : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-16 h-16 flex-shrink-0 rounded border-2 flex items-center justify-center ${
                    task.completed ? 'border-gray-600 bg-gray-200' : 'border-gray-300 bg-gray-50'
                  }`}>
                    {task.completed ? (
                      <svg className="w-8 h-8 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 border-2 border-gray-400" style={{ 
                          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' 
                        }} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-gray-900 text-base">{task.title}</h3>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        +{task.credits} Credits
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    
                    <button
                      onClick={task.onAction}
                      disabled={task.completed}
                      className={`inline-flex items-center gap-2 px-4 py-2 border-2 rounded transition-colors ${
                        task.completed
                          ? 'border-gray-600 text-gray-700 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-medium">{task.action}</span>
                      {!task.completed && <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - Invite Banner */}
        <div className="border-t-2 border-gray-200 px-8 py-4 bg-gray-50">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">
              Invite friends to research, each gets 50 Credits
            </span>
            <button className="ml-2 px-3 py-1 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors font-medium" onClick={onOpenInvite}>
              [ Invite Now ]
            </button>
          </div>
        </div>
      </div>
    </>
  );
}