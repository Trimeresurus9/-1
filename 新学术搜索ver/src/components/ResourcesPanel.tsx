import React, { useState } from 'react';
import { ExternalLink, ChevronRight, ChevronLeft } from 'lucide-react';

interface Resource {
  id: string;
  number: number;
  title: string;
  content: string;
}

interface ResourcesPanelProps {
  resources?: Resource[];
}

const defaultResources: Resource[] = [
  {
    id: '1',
    number: 1,
    title: 'GRPO-xxxxxx',
    content: 'GRPO 以义 Critic 架构，组内排排序估算完整换优化呈，成功地，落写 LLM 损排性化深度攻诚写，龙天堂有关学学。代换别算验输能，责士排有天 GRPO 以无 Critic 架构，组内排排序完整换优化呈，成功地 LLM 损排性化攻更系统件，先其恰左医学。代换穷寄验质画，责士排有关学学，以服不代学平等， GRPO 以无 Critic 架构，组内排排序完整换优化呈，成功地 LLM 语排性化的高效队列，先其恰左医学。'
  },
  {
    id: '2',
    number: 2,
    title: 'GRPO-xxxxxx',
    content: 'GRPO 以义 Critic 架构，组内排排序估算完整换优化呈，成功地 LLM 损排性化攻更系统件，先其恰左医学。代换穷寄验质画，责士排有关学学，以服不代学平等， GRPO 以无 Critic 架构，组内排排序完整换优化呈，成功地 LLM 语排性化的高效队列，先其恰左医学。代换寄寄验质画，以堂不代换平等， GRPO 以无 Critic 架构，组内排排序完整换优化呈，成功地 LLM 语排性化的高效队列，先其恰左医学。'
  }
];

export function ResourcesPanel({ resources = defaultResources }: ResourcesPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="relative">
        {/* Collapsed State - Vertical Tab */}
        <button
          onClick={() => setIsCollapsed(false)}
          className="fixed right-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-6 bg-gray-100 hover:bg-gray-200 border-l border-t border-b border-gray-200 rounded-l-lg transition-colors shadow-sm z-10"
          style={{ writingMode: 'vertical-rl' }}
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" style={{ writingMode: 'horizontal-tb' }} />
          <span className="text-sm font-medium text-gray-700">资源</span>
        </button>
      </div>
    );
  }

  return (
    <aside className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">资源</h2>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          title="折叠资源栏"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Resources List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {resources.map((resource) => (
          <div 
            key={resource.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow"
          >
            {/* Resource Header */}
            <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
              <h3 className="text-sm font-medium text-gray-900">
                [{resource.number}] {resource.title}
              </h3>
            </div>

            {/* Resource Content */}
            <div className="px-4 py-3">
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-6">
                {resource.content}
              </p>
            </div>

            {/* Resource Footer */}
            <div className="px-4 py-3 border-t border-gray-100">
              <button className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium transition-colors">
                <ExternalLink className="w-3 h-3" />
                <span>在项目库中打开</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}