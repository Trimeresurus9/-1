import React, { useRef, useState } from 'react';
import { DocumentElement } from '../types';
import { mockSentencePairs, SentencePair } from '../data/mockSentences';
import { ChevronLeft, ChevronRight, ArrowLeftRight } from 'lucide-react';
import { ParsingStatus } from './ParsingStatus';

interface DualViewTranslationProps {
  elements: DocumentElement[];
  paperId: string;
  pdfScale: number;
  isParsing?: boolean;
}

export function DualViewTranslation({ elements, paperId, pdfScale, isParsing }: DualViewTranslationProps) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSentenceId, setActiveSentenceId] = useState<string | null>(null);
  const [highlightTimeout, setHighlightTimeout] = useState<NodeJS.Timeout | null>(null);
  const [leftWidth, setLeftWidth] = useState(50); // 左侧面板宽度百分比
  const [isDragging, setIsDragging] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);
  const [isSwapped, setIsSwapped] = useState(false); // 是否交换左右位置

  const handlePdfClick = (sentenceId: string) => {
    // 清除之前的高亮计时器
    if (highlightTimeout) {
      clearTimeout(highlightTimeout);
    }

    // 设置当前激活的句子
    setActiveSentenceId(sentenceId);
    
    if (leftRef.current) {
      // 找到对应的译文句子元素
      const element = leftRef.current.querySelector(`[data-sentence-id="${sentenceId}"]`);
      if (element) {
        // 使用 nearest 确保元素可见但不强制居中，避免源段落滚出视图
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        
        // 高亮效果，2秒后自动移除高亮
        const timeout = setTimeout(() => {
          setActiveSentenceId(null);
        }, 2000);
        setHighlightTimeout(timeout);
      }
    }
  };

  const handleTranslationClick = (sentenceId: string) => {
    // 清除之前的高亮计时器
    if (highlightTimeout) {
      clearTimeout(highlightTimeout);
    }

    // 设置当前激活的句子
    setActiveSentenceId(sentenceId);
    
    if (rightRef.current) {
      // 找到对应的原文句子元素
      const element = rightRef.current.querySelector(`[data-sentence-id="${sentenceId}"]`);
      if (element) {
        // 使用 nearest 确保元素可见但不强制居中，避免源段落滚出视图
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        
        // 高亮效果，2秒后自动移除高亮
        const timeout = setTimeout(() => {
          setActiveSentenceId(null);
        }, 2000);
        setHighlightTimeout(timeout);
      }
    }
  };

  // 处理分割线拖动
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // 限制宽度在 20% 到 80% 之间
    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 添加全局鼠标事件监听
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging]);

  // 监听文本选择
  React.useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      
      if (text && text.length > 0) {
        setSelectedText(text);
        
        // 判断选中文本在哪一侧
        const anchorNode = selection?.anchorNode;
        if (anchorNode) {
          const leftPanel = leftRef.current;
          const rightPanel = rightRef.current;
          
          if (leftPanel?.contains(anchorNode)) {
            setSelectedSide('left');
          } else if (rightPanel?.contains(anchorNode)) {
            setSelectedSide('right');
          }
        }
      } else {
        setSelectedText('');
        setSelectedSide(null);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelection);
    };
  }, []);

  // 从左侧跳转到右侧
  const handleJumpToRight = () => {
    if (!selectedText || selectedSide !== 'left') return;
    
    // 查找包含选中文本的句子
    const sentence = mockSentencePairs.find(s => 
      s.translation.includes(selectedText)
    );
    
    if (sentence) {
      handleTranslationClick(sentence.id);
    }
  };

  // 从右侧跳转到左侧
  const handleJumpToLeft = () => {
    if (!selectedText || selectedSide !== 'right') return;
    
    // 查找包含选中文本的句子
    const sentence = mockSentencePairs.find(s => 
      s.original.includes(selectedText)
    );
    
    if (sentence) {
      handlePdfClick(sentence.id);
    }
  };

  // Group sentences by element for left panel
  const sentencesByElement: Record<string, SentencePair[]> = {};
  mockSentencePairs.forEach(sentence => {
    if (!sentencesByElement[sentence.elementId]) {
      sentencesByElement[sentence.elementId] = [];
    }
    sentencesByElement[sentence.elementId].push(sentence);
  });

  // Group sentences by page for right panel
  const sentencesByPage: Record<number, SentencePair[]> = {};
  mockSentencePairs.forEach(sentence => {
    if (!sentencesByPage[sentence.page]) {
      sentencesByPage[sentence.page] = [];
    }
    sentencesByPage[sentence.page].push(sentence);
  });

  const renderTranslationElement = (element: DocumentElement) => {
    const sentences = sentencesByElement[element.id] || [];
    
    if (sentences.length === 0 && !element.translation && !element.translating) {
      return null;
    }

    switch (element.type) {
      case 'title':
        return (
          <div key={element.id} className="mb-6">
            {sentences.map(sentence => (
              <div
                key={sentence.id}
                data-sentence-id={sentence.id}
                onDoubleClick={() => handlePdfClick(sentence.id)}
                className={`p-2 rounded-md cursor-text transition-all duration-200 select-text ${
                  activeSentenceId === sentence.id
                    ? 'bg-blue-100 ring-2 ring-blue-500 shadow-md'
                    : ''
                }`}
              >
                <h1 className="text-lg font-bold text-gray-900">{sentence.translation}</h1>
              </div>
            ))}
          </div>
        );

      case 'author':
        return (
          <div key={element.id} className="mb-3">
            {sentences.map(sentence => (
              <div
                key={sentence.id}
                data-sentence-id={sentence.id}
                onDoubleClick={() => handlePdfClick(sentence.id)}
                className={`p-2 rounded-md cursor-text transition-all select-text ${
                  activeSentenceId === sentence.id
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : ''
                }`}
              >
                <p className="text-xs text-gray-600">{sentence.translation}</p>
              </div>
            ))}
          </div>
        );

      case 'heading':
        const HeadingTag = `h${element.level || 2}` as keyof JSX.IntrinsicElements;
        const size = element.level === 1 ? 'text-base' : 'text-sm';
        
        return (
          <div key={element.id} className="mt-4 mb-2">
            {sentences.map(sentence => (
              <div
                key={sentence.id}
                data-sentence-id={sentence.id}
                onDoubleClick={() => handlePdfClick(sentence.id)}
                className={`p-2 rounded-md cursor-text transition-all duration-200 select-text ${
                  activeSentenceId === sentence.id
                    ? 'bg-blue-100 ring-2 ring-blue-500 shadow-md'
                    : ''
                }`}
              >
                <HeadingTag className={`${size} font-semibold text-gray-900`}>
                  {sentence.translation}
                </HeadingTag>
              </div>
            ))}
          </div>
        );

      case 'paragraph':
        return (
          <div key={element.id} className="mb-3">
            <div className="space-y-1.5">
              {sentences.map(sentence => (
                <div
                  key={sentence.id}
                  data-sentence-id={sentence.id}
                  onDoubleClick={() => handlePdfClick(sentence.id)}
                  className={`p-2 rounded-md cursor-text transition-all duration-200 select-text ${
                    activeSentenceId === sentence.id
                      ? 'bg-blue-100 ring-2 ring-blue-500 shadow-md'
                      : ''
                  }`}
                >
                  <p className="text-xs text-gray-800 leading-relaxed">{sentence.translation}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'formula':
        return (
          <div
            key={element.id}
            className="my-4 p-4 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <code className="text-sm font-mono text-gray-800 block text-center">
              {element.content}
            </code>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPdfSentence = (sentence: SentencePair) => {
    const isActive = activeSentenceId === sentence.id;
    const element = elements.find(el => el.id === sentence.elementId);
    
    if (!element) return null;

    const baseClasses = `px-2 py-1 rounded cursor-text transition-all duration-200 inline select-text ${
      isActive ? 'bg-yellow-200 ring-2 ring-yellow-400 shadow-lg' : ''
    }`;

    switch (element.type) {
      case 'title':
        return (
          <span
            key={sentence.id}
            data-sentence-id={sentence.id}
            onDoubleClick={() => handlePdfClick(sentence.id)}
            className={`${baseClasses} text-lg font-bold text-gray-900 block text-center mb-2`}
          >
            {sentence.original}
          </span>
        );
      
      case 'author':
        return (
          <span
            key={sentence.id}
            data-sentence-id={sentence.id}
            onDoubleClick={() => handlePdfClick(sentence.id)}
            className={`${baseClasses} text-xs text-gray-700 block text-center mb-2`}
          >
            {sentence.original}
          </span>
        );
      
      case 'heading':
        const size = element.level === 1 ? 'text-sm font-bold' : 'text-xs font-semibold';
        return (
          <span
            key={sentence.id}
            data-sentence-id={sentence.id}
            onDoubleClick={() => handlePdfClick(sentence.id)}
            className={`${baseClasses} ${size} text-gray-900 block mt-3 mb-1`}
          >
            {sentence.original}
          </span>
        );
      
      case 'paragraph':
        return (
          <span
            key={sentence.id}
            data-sentence-id={sentence.id}
            onDoubleClick={() => handlePdfClick(sentence.id)}
            className={`${baseClasses} text-xs text-gray-800 leading-relaxed`}
          >
            {sentence.original}{' '}\n          </span>
        );
      
      default:
        return null;
    }
  };

  const pdfPages = [1, 2, 3, 4, 5];

  // 切换左右位置
  const handleSwap = () => {
    setIsSwapped(!isSwapped);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-white" ref={containerRef}>
      {/* Left Panel - Translation or PDF based on swap state */}
      <div 
        className="border-r border-gray-200 overflow-y-auto" 
        ref={isSwapped ? rightRef : leftRef}
        style={{ width: `${leftWidth}%` }}
      >
        {!isSwapped ? (
          // Translation on left - 显示解析状态或译文
          isParsing ? (
            <ParsingStatus />
          ) : (
            <div className="p-4">
              <div className="mb-3 pb-3 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">译文</h2>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    双击译文来定位至原文对应位置
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                {elements.map(element => renderTranslationElement(element))}
              </div>
            </div>
          )
        ) : (
          // PDF on left when swapped - 总是显示PDF，不受isParsing影响
          <div className="bg-gray-100 overflow-y-auto flex-1" ref={leftRef}>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 z-10 shadow-sm">
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold text-gray-900">原始PDF</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    双击PDF文本来定位至译文对应句子
                  </span>
                </p>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {pdfPages.map((page) => (
                  <div
                    key={page}
                    data-page={page}
                    className="bg-white shadow-md"
                    style={{
                      transform: `scale(${pdfScale})`,
                      transformOrigin: 'top center',
                      marginBottom: `${(pdfScale - 1) * 300}px`,
                    }}
                  >
                    {/* PDF Page with Sentence-level Content */}
                    <div className="aspect-[8.5/11] border border-gray-300 relative overflow-hidden">
                      <div className="absolute inset-0 p-8 overflow-hidden">
                        <div className="space-y-1 text-justify">
                          {sentencesByPage[page]?.map(sentence => renderPdfSentence(sentence))}
                        </div>
                      </div>

                      {/* Page Number */}
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="text-xs text-gray-400">- {page} -</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resizable Divider */}
      <div
        className={`w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors relative ${
          isDragging ? 'bg-blue-500' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator on hover */}
        <div className="absolute inset-y-0 -left-1 -right-1 hover:bg-blue-500 hover:opacity-20 transition-opacity"></div>
      </div>

      {/* Swap Button - Anchored to divider */}
      {!isDragging && (
        <div 
          className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ 
            left: `${leftWidth}%`
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSwap();
            }}
            className="bg-white rounded-lg shadow-lg border border-gray-300 p-2 pointer-events-auto hover:bg-gray-50 transition-colors"
            title="切换左右位置"
          >
            <ArrowLeftRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      )}

      {/* Right Panel - PDF or Translation based on swap state */}
      <div 
        className="bg-gray-100 overflow-y-auto flex-1" 
        ref={isSwapped ? leftRef : rightRef}
      >
        {!isSwapped ? (
          // PDF on right (显示原文，总是可见)
          <>
            <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2 z-10 shadow-sm">
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold text-gray-900">原始PDF</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    双击PDF文本来定位至译文对应句子
                  </span>
                </p>
              </div>
            </div>

            <div className="p-4">
              <div className="space-y-4">
                {pdfPages.map((page) => (
                  <div
                    key={page}
                    data-page={page}
                    className="bg-white shadow-md"
                    style={{
                      transform: `scale(${pdfScale})`,
                      transformOrigin: 'top center',
                      marginBottom: `${(pdfScale - 1) * 300}px`,
                    }}
                  >
                    <div className="aspect-[8.5/11] border border-gray-300 relative overflow-hidden">
                      <div className="absolute inset-0 p-8 overflow-hidden">
                        <div className="space-y-1 text-justify">
                          {sentencesByPage[page]?.map(sentence => renderPdfSentence(sentence))}
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="text-xs text-gray-400">- {page} -</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Translation on right when swapped
          isParsing ? (
            <ParsingStatus />
          ) : (
            <div className="p-4 bg-white">
              <div className="mb-3 pb-3 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">译文</h2>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    双击译文来定位至原文对应位置
                  </span>
                </p>
              </div>
              <div className="space-y-1">
                {elements.map(element => renderTranslationElement(element))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
