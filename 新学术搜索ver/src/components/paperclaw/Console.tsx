import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ChevronUp, ChevronDown, X, AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

interface ConsoleProps {
  logs?: LogEntry[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function Console({ logs = [], isExpanded = true, onToggle }: ConsoleProps) {
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Mock logs if none provided
  const defaultLogs: LogEntry[] = [
    { id: '1', timestamp: new Date(), level: 'info', message: '开始加载实验环境...' },
    { id: '2', timestamp: new Date(), level: 'success', message: '成功加载论文: Attention Is All You Need' },
    { id: '3', timestamp: new Date(), level: 'info', message: '正在解析实验方案...' },
    { id: '4', timestamp: new Date(), level: 'warning', message: '检测到数据集缺失，请上传 WMT 2014 数据集' },
    { id: '5', timestamp: new Date(), level: 'info', message: '等待用户输入...' },
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  const filteredLogs = filter === 'all' 
    ? displayLogs 
    : displayLogs.filter(log => log.level === filter);

  useEffect(() => {
    if (autoScroll && consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredLogs, autoScroll]);

  const getLevelIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return <CheckCircle className="w-3.5 h-3.5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-3.5 h-3.5 text-orange-500" />;
      case 'error': return <XCircle className="w-3.5 h-3.5 text-red-600" />;
      default: return <Info className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'success': return 'text-green-700';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold">Console</h3>
          <span className="text-xs text-gray-400">({filteredLogs.length} logs)</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Filter Buttons */}
          <div className="flex items-center gap-1 mr-2">
            {(['all', 'info', 'success', 'warning', 'error'] as const).map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  filter === level
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                {level === 'all' ? 'All' : level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          {/* Auto-scroll toggle */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 text-xs rounded transition-colors ${
              autoScroll ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Auto-scroll
          </button>

          {/* Clear button */}
          <button
            className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title="Clear console"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Toggle expand/collapse */}
          {onToggle && (
            <button
              onClick={onToggle}
              className="p-1 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Logs */}
      <div className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <TerminalIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No logs to display</p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredLogs.map(log => (
              <div key={log.id} className="flex items-start gap-2 py-1 hover:bg-gray-800/50 rounded px-2 -mx-2">
                <span className="text-gray-500 flex-shrink-0 select-none">
                  [{formatTime(log.timestamp)}]
                </span>
                <div className="flex-shrink-0 mt-0.5">
                  {getLevelIcon(log.level)}
                </div>
                <div className="flex-1">
                  <span className={getLevelColor(log.level)}>{log.message}</span>
                  {log.details && (
                    <div className="text-gray-500 mt-0.5 text-xs pl-2 border-l border-gray-700">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
