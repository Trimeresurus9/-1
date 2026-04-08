import React, { useRef, useEffect } from 'react';
import { Paperclip, Send, AlertTriangle, CheckCircle, CheckCircle2, FileBarChart, Download, Eye, Clock, Zap, RefreshCw, Archive, FileDown, Lightbulb, Play, Sparkles, FileText, Database, Cpu, Info, XCircle, Terminal } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

// 定义消息类型
type MessageType = 'user' | 'system' | 'warning' | 'dataset-success' | 'question' | 'report-ready' | 'agent-thinking' | 'next-actions' | 'start-experiment-confirm' | 'stop-confirm';

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

interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  isConfigModified?: boolean;  // 标识配置是否被修改
  gpuPowerUsed?: number;  // 已使用的Credits
  questionData?: {
    title: string;
    description: string;
    options: Array<{
      id: string;
      label: string;
      description: string;
      recommended?: boolean;
    }>;
  };
  agentSteps?: AgentStep[];
}

interface ChatboxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onUploadDataset?: () => void;
  onQuestionResponse?: (messageId: string, optionId: string) => void;
  onStopConfirmed?: (messageId: string) => void;
  onStopCancelled?: (messageId: string) => void;
}

export function Chatbox({ messages, onSendMessage, onUploadDataset, onQuestionResponse, onStopConfirmed, onStopCancelled }: ChatboxProps) {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = React.useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = '44px';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = '44px';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const getMessageIcon = (type: MessageType) => {
    switch (type) {
      case 'system': return <Info className="w-3.5 h-3.5 text-blue-500" />;
      case 'warning': return <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />;
      case 'dataset-success': return <CheckCircle className="w-3.5 h-3.5 text-green-600" />;
      case 'agent-thinking': return <Terminal className="w-3.5 h-3.5 text-purple-500" />;
      case 'report-ready': return <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />;
      default: return <Info className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  const getMessageColor = (type: MessageType) => {
    switch (type) {
      case 'system': return 'text-blue-700';
      case 'warning': return 'text-orange-600';
      case 'dataset-success': return 'text-green-700';
      case 'agent-thinking': return 'text-purple-700';
      case 'report-ready': return 'text-green-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-3">
          {messages.map((message) => {
            // User message - keep as bubble
            if (message.type === 'user') {
              return (
                <div key={message.id} className="flex justify-end">
                  <div className="max-w-[70%] bg-blue-500 text-white px-4 py-2.5 rounded-xl rounded-tr-md">
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              );
            }

            // Simple message types - console style
            if (message.type === 'system' || message.type === 'dataset-success') {
              return (
                <div key={message.id} className="flex items-start gap-3 py-1 px-2 -mx-2 hover:bg-gray-50 rounded">
                  <span className="text-gray-400 text-xs flex-shrink-0 select-none font-mono w-16 pt-0.5">
                    {formatTime(message.timestamp)}
                  </span>
                  <div className="flex-shrink-0 mt-0.5">
                    {getMessageIcon(message.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm leading-relaxed ${getMessageColor(message.type)}`}>{message.content}</span>
                  </div>
                </div>
              );
            }

            // Agent thinking - simplified
            if (message.type === 'agent-thinking' && message.agentSteps) {
              return (
                <div key={message.id} className="py-1">
                  {/* Main message */}
                  <div className="flex items-start gap-3 py-1 px-2 -mx-2 hover:bg-gray-50 rounded">
                    <span className="text-gray-400 text-xs flex-shrink-0 select-none font-mono w-16 pt-0.5">
                      {formatTime(message.timestamp)}
                    </span>
                    <div className="flex-shrink-0 mt-0.5">
                      {getMessageIcon(message.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium leading-relaxed ${getMessageColor(message.type)}`}>{message.content}</span>
                    </div>
                  </div>
                  
                  {/* Agent steps */}
                  <div className="ml-[76px] mt-2 space-y-3 border-l-2 border-purple-200 pl-4 pb-1">
                    {message.agentSteps.map((step, index) => (
                      <div key={step.id} className="space-y-1.5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-purple-600 font-bold">{index + 1}.</span>
                          <span className="text-xs font-semibold text-gray-900">{step.title}</span>
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed pl-4">{step.description}</div>
                        {step.actions && step.actions.length > 0 && (
                          <div className="space-y-0.5 mt-1.5 pl-4">
                            {step.actions.map((action, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-gray-500">
                                <span className="text-purple-400 mt-0.5">▸</span>
                                <span className="leading-relaxed">{action.text}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {step.summary && (
                          <div className="text-xs text-green-600 font-medium mt-1.5 pl-4 flex items-start gap-1.5">
                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="leading-relaxed">{step.summary}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Warning message
            if (message.type === 'warning') {
              return (
                <div key={message.id} className="flex justify-start ml-[76px]">
                  <div className="max-w-[80%] bg-white border border-orange-300 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-orange-50 border-b border-orange-200 flex items-start gap-3">
                      <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">缺少训练数据集</p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex gap-2">
                      <button
                        onClick={onUploadDataset}
                        className="flex-1 px-3 py-2 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        上传数据集
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
                        使用模拟数据
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Question card
            if (message.type === 'question' && message.questionData) {
              return (
                <div key={message.id} className="flex justify-start ml-[76px]">
                  <div className="max-w-[85%] bg-white border border-blue-300 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-blue-50 border-b border-blue-200">
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {message.questionData.title}
                          </h3>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {message.questionData.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-2.5">
                        {message.questionData.options.map((option, index) => (
                          <button
                            key={option.id}
                            onClick={() => onQuestionResponse?.(message.id, option.id)}
                            className={`relative p-3 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                              option.recommended
                                ? 'border-blue-400 bg-blue-50 hover:bg-blue-100'
                                : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-gray-50'
                            }`}
                          >
                            {option.recommended && (
                              <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded-full shadow-sm">
                                推荐
                              </div>
                            )}
                            
                            <div className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold mb-1.5 ${
                              option.recommended
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            
                            <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-tight">
                              {option.label}
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {option.description}
                            </p>
                          </button>
                        ))}
                      </div>
                      
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        {t('question.selectOption')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            // Report ready
            if (message.type === 'report-ready') {
              return (
                <div key={message.id} className="flex justify-start ml-[76px]">
                  <div className="max-w-[80%] bg-white border-2 border-gray-900 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-white mb-0.5">{t('report.title')}</h3>
                          <p className="text-xs text-gray-300 leading-relaxed">
                            {t('report.subtitle')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 py-3 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3 p-2.5 bg-white rounded-lg border border-gray-200">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-200">
                          <FileBarChart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 mb-0.5 truncate">Transformer_Reproduction_Report.pdf</p>
                          <div className="flex items-center gap-2.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTime(message.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              3.2{t('report.duration').includes('小时') ? '小时' : 'h'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                          {t('report.downloadPDF')}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-300">
                          <Eye className="w-3.5 h-3.5" />
                          {t('report.viewOnline')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Next Actions Card
            if (message.type === 'next-actions') {
              return (
                <div key={message.id} className="flex justify-start ml-[76px]">
                  <div className="max-w-[85%]">
                    <div className="text-sm text-gray-900 space-y-2.5">
                      <p className="text-sm font-medium text-gray-700 px-1">实验已完成！你可以继续探索以下操作：</p>
                      <div className="space-y-1.5">
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group flex items-start gap-2.5">
                          <span className="text-gray-400 text-sm mt-0.5 flex-shrink-0">•</span>
                          <span className="flex-1 text-gray-700 text-sm leading-relaxed">
                            <span className="font-medium text-gray-900">上传新数据集重新运行</span> — 使用不同的数据集重新训练模型，探索更多实验可能性
                          </span>
                          <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">→</span>
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group flex items-start gap-2.5">
                          <span className="text-gray-400 text-sm mt-0.5 flex-shrink-0">•</span>
                          <span className="flex-1 text-gray-700 text-sm leading-relaxed">
                            <span className="font-medium text-gray-900">保存实验镜像到目录</span> — 将完整的实验环境、代码和模型保存为快照
                          </span>
                          <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">→</span>
                        </button>
                        <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors group flex items-start gap-2.5">
                          <span className="text-gray-400 text-sm mt-0.5 flex-shrink-0">•</span>
                          <span className="flex-1 text-gray-700 text-sm leading-relaxed">
                            <span className="font-medium text-gray-900">下载聊天记录和日志</span> — 导出完整的对话记录和实验日志
                          </span>
                          <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">→</span>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 pt-1 px-3">
                        💡 提示：你也可以在左侧Explorer中查看历史实验记录
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            // Start Experiment Confirmation Card
            if (message.type === 'start-experiment-confirm') {
              const isModified = message.isConfigModified;
              
              return (
                <div key={message.id} className="flex justify-start ml-[76px]">
                  <div className={`max-w-[80%] bg-white border rounded-lg shadow-sm overflow-hidden ${
                    isModified ? 'border-orange-300' : 'border-green-300'
                  }`}>
                    <div className={`px-4 py-3 border-b flex items-start gap-3 ${
                      isModified 
                        ? 'bg-orange-50 border-orange-200' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isModified ? 'bg-orange-100' : 'bg-green-100'
                      }`}>
                        {isModified ? (
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          {isModified ? '确认实验计划' : '实验方案已准备就绪'}
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {isModified 
                            ? '自定义实验计划可能导致复现失败，请仔细审阅。'
                            : 'AI已为你生成完整的实验计划，请确认配置后开始执行'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors">
                        修改配置
                      </button>
                      <button 
                        onClick={() => onQuestionResponse?.(message.id, 'start')}
                        className={`flex-1 px-3 py-2 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                          isModified
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        开始实验
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Stop Experiment Confirmation Card
            if (message.type === 'stop-confirm') {
              const gpuPowerUsed = message.gpuPowerUsed || 0;
              
              return (
                <div key={message.id} className="flex justify-start ml-[76px]">
                  <div className="max-w-[80%] bg-white border rounded-lg shadow-sm overflow-hidden border-red-300">
                    <div className="px-4 py-3 border-b flex items-start gap-3 bg-red-50 border-red-200">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-100">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1">
                          确认停止实验？
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">
                          停止实验后，当前任务将立即终止，所有进度将丢失。
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-red-700 bg-red-100 px-2.5 py-1 rounded-md">
                          <AlertTriangle className="w-3 h-3" />
                          <span className="font-medium">已消耗 {gpuPowerUsed} Credits 不予退还</span>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => onStopCancelled?.(message.id)}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => onStopConfirmed?.(message.id)}
                        className="flex-1 px-3 py-2 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                      >
                        确认停止
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 py-4 border-t border-gray-100 bg-white">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              placeholder="向AI提问或提供指令..."
              className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-300 focus:border-blue-400 resize-none"
              rows={1}
              style={{
                minHeight: '44px',
                maxHeight: '120px',
              }}
            />
            <button
              type="button"
              className="absolute right-2 bottom-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Paperclip className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
      </div>
    </div>
  );
}