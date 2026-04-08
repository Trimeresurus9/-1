import React from 'react';
import { CheckCircle2, Circle, Loader2, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  startTime?: Date;
  endTime?: Date;
  details?: string;
}

interface ProcessPanelProps {
  tasks?: Task[];
  currentTaskIndex?: number;
  experimentStatus?: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
}

export function ProcessPanel({ 
  tasks = [], 
  currentTaskIndex = -1,
  experimentStatus = 'idle' 
}: ProcessPanelProps) {
  
  // 默认任务列表
  const defaultTasks: Task[] = [
    { id: '1', name: '生成计划（Planning）', status: 'pending', details: '分析论文并制定实验方案' },
    { id: '2', name: '配置实验（SettingUp）', status: 'pending', details: '安装依赖库和配置实验环境' },
    { id: '3', name: '进行实验（Running）', status: 'pending', details: '执行实验任务' },
    { id: '4', name: '完成实验（Finished）', status: 'pending', details: '生成实验报告和评估结果' },
  ];

  const displayTasks = tasks.length > 0 ? tasks : defaultTasks;
  
  // 计算整体进度
  const completedCount = displayTasks.filter(t => t.status === 'completed').length;
  const overallProgress = (completedCount / displayTasks.length) * 100;

  const getStatusIcon = (status: Task['status'], index: number) => {
    if (status === 'completed') {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
    if (status === 'running' || currentTaskIndex === index) {
      return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
    }
    if (status === 'failed') {
      return <Circle className="w-4 h-4 text-red-600 fill-red-100" />;
    }
    return <Circle className="w-4 h-4 text-gray-300" />;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Compact Header with Progress */}
      <div className="px-5 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs text-gray-900 uppercase tracking-wide" style={{ fontWeight: 600 }}>实验流程</h2>
          <span className="text-xs text-gray-400" style={{ fontWeight: 500 }}>
            {completedCount} / {displayTasks.length}
          </span>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Compact Tasks List */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        <div className="space-y-0.5">
          {displayTasks.map((task, index) => {
            const isActive = currentTaskIndex === index;
            const isCompleted = task.status === 'completed';
            const isPending = task.status === 'pending' && currentTaskIndex < index;
            const isFailed = task.status === 'failed';

            return (
              <div 
                key={task.id} 
                className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-50 border border-blue-200' 
                    : isCompleted 
                    ? 'bg-green-50/50 hover:bg-green-50' 
                    : isFailed
                    ? 'bg-red-50/50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {getStatusIcon(task.status, index)}
                </div>

                {/* Task Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    isPending ? 'text-gray-400' : 
                    isCompleted ? 'text-green-900' :
                    isFailed ? 'text-red-900' :
                    'text-gray-900'
                  }`}>
                    {task.name}
                  </p>
                </div>

                {/* Progress Indicator for Active Task */}
                {isActive && task.progress !== undefined && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-blue-600 w-9 text-right">
                      {Math.round(task.progress)}%
                    </span>
                  </div>
                )}

                {/* Status Badge */}
                {!isActive && (
                  <ChevronRight className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isPending ? 'text-gray-300' : 'text-gray-400'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {displayTasks.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <Circle className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs">等待任务开始...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}