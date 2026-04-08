import React from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, X } from 'lucide-react';
import { Paper } from '../types';

interface RightPanelProps {
  selectedPaper: Paper | null;
}

interface WorkflowStep {
  id: number;
  title: string;
  items: string[];
  completed: boolean;
  expanded: boolean;
}

export function RightPanel({ selectedPaper }: RightPanelProps) {
  const [steps, setSteps] = React.useState<WorkflowStep[]>([
    {
      id: 1,
      title: 'Analysing Questions',
      items: [
        '"Colive Voice" AND "type 2 diabetes" AND "prediction"',
        '"Colive Voice" voice-based prediction diabetes',
        'Colive Voice type 2 diabetes prediction',
        'A voice-based algorithm can predict type 2 diabetes status in USA adults: Findings from the...',
      ],
      completed: true,
      expanded: true,
    },
    {
      id: 2,
      title: 'Validating Criteria',
      items: [
        'The paper is related to the Colive Voice study',
        'The paper presents a voice-based algorithm for predicting type 2 diabetes status in adults',
        'A voice-based algorithm can predict type 2 diabetes status in USA adults: Findings from the...',
      ],
      completed: true,
      expanded: true,
    },
    {
      id: 3,
      title: 'Searching & Validating',
      items: [
        'Culturally tailored self-management interventions for South Asians with type 2 diabetes: A systematic...',
        'Plasma lipidomic profiling and risk of type 2 diabetes in the PREDIMED trial',
      ],
      completed: false,
      expanded: true,
    },
  ]);

  const toggleStep = (id: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, expanded: !step.expanded } : step
      )
    );
  };

  const stats = {
    searched: 198,
    verified: 198,
    tokens: 344367,
  };

  return (
    <aside className="w-72 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">Working Flow</h2>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="text-xl font-semibold text-blue-600">{stats.searched}</div>
            <div className="text-xs text-gray-500 mt-0.5">Searched</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-blue-600">{stats.verified}</div>
            <div className="text-xs text-gray-500 mt-0.5">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-blue-600">
              {(stats.tokens / 1000).toFixed(0)}k
            </div>
            <div className="text-xs text-gray-500 mt-0.5">Tokens</div>
          </div>
        </div>
      </div>

      {/* Task Execution Details Toggle */}
      <div className="px-4 py-3 border-b border-gray-100">
        <button className="w-full flex items-center justify-between text-left">
          <span className="text-sm font-medium text-gray-900">Task Execution Details</span>
          <ChevronUp className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Workflow Steps */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              <button
                onClick={() => toggleStep(step.id)}
                className="w-full flex items-start gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors"
              >
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-900">
                      {step.id} {step.title}
                    </span>
                    {step.expanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {step.expanded && (
                <div className="px-3 pb-2.5 bg-gray-50/50">
                  <div className="space-y-1.5">
                    {step.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-xs text-gray-700 bg-white px-2.5 py-2 rounded border border-gray-100"
                      >
                        <span className="text-blue-600 flex-shrink-0 text-xs">■</span>
                        <span className="flex-1 leading-relaxed">{item}</span>
                        {step.id === 3 && index < 2 && (
                          <button className="flex-shrink-0 text-red-500 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Search */}
      <div className="px-4 py-3 border-t border-gray-100">
        <input
          type="text"
          placeholder="Re-Search"
          className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </aside>
  );
}