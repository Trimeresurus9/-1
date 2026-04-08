import React from 'react';
import { DocumentElement } from '../types';
import { Loader2, Image as ImageIcon } from 'lucide-react';

interface DocumentRendererProps {
  elements: DocumentElement[];
  viewMode?: 'dual-vertical' | 'translation-only' | 'dual-horizontal';
}

export function DocumentRenderer({ elements, viewMode = 'dual-vertical' }: DocumentRendererProps) {
  const renderElement = (element: DocumentElement) => {
    const showOriginal = viewMode !== 'translation-only';
    const isHorizontal = viewMode === 'dual-horizontal';

    switch (element.type) {
      case 'title':
        return (
          <div key={element.id} className="mb-8">
            <div className={isHorizontal ? 'grid grid-cols-2 gap-8' : ''}>
              {showOriginal && (
                <h1 className="text-2xl font-semibold text-gray-900 mb-3 leading-tight">
                  {element.content}
                </h1>
              )}
              <div>
                {element.translating && (
                  <div className="flex items-center gap-2 text-blue-600 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Translating...</span>
                  </div>
                )}
                {element.translation && (
                  <h2 className={`text-xl font-semibold text-gray-800 leading-tight ${!isHorizontal && 'mt-2'}`}>
                    {element.translation}
                  </h2>
                )}
              </div>
            </div>
          </div>
        );

      case 'author':
        return (
          <div key={element.id} className="mb-6">
            <div className="text-sm leading-relaxed">
              {element.content.split(', ').map((author, idx) => {
                const shouldHighlight = idx < 3;
                return (
                  <span
                    key={idx}
                    className={shouldHighlight ? 'bg-yellow-200 px-0.5' : ''}
                  >
                    {author}
                    {idx < element.content.split(', ').length - 1 && ', '}
                  </span>
                );
              })}
            </div>
          </div>
        );

      case 'heading':
        const HeadingTag = `h${element.level || 2}` as keyof JSX.IntrinsicElements;
        const headingSize = element.level === 1 ? 'text-lg' : 'text-base';
        const headingTranslationSize = element.level === 1 ? 'text-base' : 'text-sm';
        
        return (
          <div key={element.id} id={element.id} className="mt-8 mb-4">
            <div className={isHorizontal ? 'grid grid-cols-2 gap-8' : ''}>
              {showOriginal && (
                <HeadingTag className={`${headingSize} font-semibold text-gray-900 mb-2 ${!isHorizontal && 'text-center'}`}>
                  {element.content}
                </HeadingTag>
              )}
              <div>
                {element.translating && (
                  <div className={`flex items-center gap-2 text-blue-600 py-1 ${!isHorizontal && 'justify-center'}`}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Translating...</span>
                  </div>
                )}
                {element.translation && (
                  <p className={`${headingTranslationSize} font-semibold text-gray-700 ${!isHorizontal ? 'mt-1 text-center' : ''}`}>
                    {element.translation}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'paragraph':
        return (
          <div key={element.id} className="mb-5">
            <div className={isHorizontal ? 'grid grid-cols-2 gap-8' : ''}>
              {showOriginal && (
                <p className="text-sm text-gray-800 leading-relaxed mb-2 text-justify">
                  {element.content}
                </p>
              )}
              <div>
                {element.translating && (
                  <div className="flex items-center gap-2 text-blue-600 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Translating...</span>
                  </div>
                )}
                {element.translation && !element.translating && (
                  <p className={`text-sm text-gray-700 leading-relaxed text-justify ${!isHorizontal && 'mt-2'}`}>
                    {element.translation}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 'formula':
        return (
          <div key={element.id} className="my-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <code className="text-sm font-mono text-gray-800 block text-center">
              {element.content}
            </code>
          </div>
        );

      case 'image':
        return (
          <div key={element.id} className="my-8">
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-12 flex items-center justify-center">
              <ImageIcon className="w-20 h-20 text-gray-400" />
            </div>
            {element.caption && (
              <>
                {showOriginal && (
                  <p className="text-sm text-gray-600 text-center mt-3">
                    {element.caption}
                  </p>
                )}
                {element.translating && (
                  <div className="flex items-center justify-center gap-2 text-blue-600 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Translating caption...</span>
                  </div>
                )}
                {element.translation && (
                  <p className="text-sm text-gray-600 text-center mt-2">
                    {element.translation}
                  </p>
                )}
              </>
            )}
          </div>
        );

      case 'table':
        return (
          <div key={element.id} className="my-6">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="text-sm text-gray-600">[Table: {element.content}]</p>
            </div>
            {element.caption && (
              <>
                {showOriginal && (
                  <p className="text-sm text-gray-600 text-center mt-2">
                    {element.caption}
                  </p>
                )}
                {element.translation && (
                  <p className="text-sm text-gray-600 text-center mt-1">
                    {element.translation}
                  </p>
                )}
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-1">
      {elements.map(element => renderElement(element))}
    </div>
  );
}