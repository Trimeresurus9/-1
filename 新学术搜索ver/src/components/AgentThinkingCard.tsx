import React from 'react';
import { Terminal, FileText, Database, Cpu } from 'lucide-react';

interface AgentStep {
  id: string;
  title: string;
  description: string;
  actions: Array<{
    icon: string;
    text: string;
  }>;
  summary?: string;
}

interface AgentThinkingCardProps {
  message: {
    id: string;
    content: string;
    agentSteps?: AgentStep[];
  };
}

export function AgentThinkingCard({ message }: AgentThinkingCardProps) {
  if (!message.agentSteps || message.agentSteps.length === 0) {
    return null;
  }

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      terminal: Terminal,
      file: FileText,
      database: Database,
      cpu: Cpu,
    };
    return icons[iconName] || Terminal;
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] py-2">
        {/* 顶部内容消息 */}
        <div className="text-sm text-gray-700 mb-5 leading-relaxed">
          {message.content}
        </div>

        {/* 步骤列表 */}
        <div className="space-y-5">
          {message.agentSteps.map((step, stepIndex) => {
            const isLastStep = stepIndex === message.agentSteps!.length - 1;

            return (
              <div key={step.id} className="relative">
                {/* 步骤标题 */}
                <div className="font-semibold text-gray-900 text-sm mb-2.5">
                  步骤 {stepIndex + 1}: {step.title}
                </div>

                {/* 步骤描述 */}
                {step.description && (
                  <div className="text-xs text-gray-600 mb-3 leading-relaxed">
                    {step.description}
                  </div>
                )}

                {/* 操作列表 - 带灰色背景 */}
                {step.actions && step.actions.length > 0 && (
                  <div className="space-y-2.5 mb-3 relative pl-3">
                    {/* 虚线连接器 */}
                    {step.actions.length > 1 && (
                      <div 
                        className="absolute left-[13px] top-9 border-l border-dashed border-gray-300"
                        style={{ height: `${(step.actions.length - 1) * 40}px` }}
                      />
                    )}
                    
                    {step.actions.map((action, actionIndex) => {
                      const Icon = getIconComponent(action.icon);
                      return (
                        <div
                          key={actionIndex}
                          className="flex items-start gap-3 relative"
                        >
                          {/* 图标 */}
                          <div className="w-7 h-7 rounded-full bg-white border border-gray-300 flex items-center justify-center flex-shrink-0 relative z-10">
                            <Icon className="w-3.5 h-3.5 text-gray-600" />
                          </div>
                          
                          {/* 文本内容 - 灰色背景 */}
                          <div className="flex-1 bg-gray-50 px-3.5 py-2.5 rounded-lg text-xs text-gray-700 leading-relaxed border border-gray-200">
                            {action.text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 总结 - 白色背景 */}
                {step.summary && (
                  <div className="text-xs text-gray-700 leading-relaxed mt-3 pl-0">
                    {step.summary}
                  </div>
                )}

                {/* 步骤之间的间距 */}
                {!isLastStep && <div className="h-2" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
