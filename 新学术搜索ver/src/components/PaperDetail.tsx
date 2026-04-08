import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize, Globe, ChevronDown } from 'lucide-react';
import { Paper } from '../types';
import { TableOfContents } from './TableOfContents';
import { PageThumbnails } from './PageThumbnails';
import { BlogView } from './BlogView';
import { PaperView } from './PaperView';
import { TranslationView } from './TranslationView';
import { CommentsPanel } from './CommentsPanel';
import { UserPanel } from './UserPanel';
import { ParsingStatus } from './ParsingStatus';

interface PaperDetailProps {
  paper: Paper;
  onBack: () => void;
}

type TabType = 'blog' | 'paper' | 'translation';
type SidebarTab = 'preview' | 'structure';

export function PaperDetail({ paper, onBack }: PaperDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('blog');
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('preview');
  const [pdfScale, setPdfScale] = useState(0.5);
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 15;
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [blogLanguage, setBlogLanguage] = useState<'en' | 'zh' | 'ja' | 'ko' | 'id'>('en');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [blogScale, setBlogScale] = useState(1);
  const [isParsing, setIsParsing] = useState(true);
  const [isFirstBlogVisit, setIsFirstBlogVisit] = useState(true);

  const paperId = paper?.id;

  // Simulate parsing process for 10 seconds on first load (only for Translation tab)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsParsing(false);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [paperId]); // Reset when paper changes
  
  // Track first visit to paper for Blog tab
  useEffect(() => {
    setIsFirstBlogVisit(true);
  }, [paperId]);

  if (!paper) {
    return null;
  }

  const languageLabels = {
    'en': 'English',
    'zh': '中文',
    'ja': '日本語',
    'ko': '한국어',
    'id': 'Indonesia'
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Top Toolbar */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex items-center justify-between flex-shrink-0">
        {/* Left Section - Navigation */}
        <div className="flex items-center gap-1">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="返回"
          >
            <ArrowLeft className="w-4 h-4 text-gray-700" />
          </button>
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          
          {/* 单页阅读 */}
          <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="单页阅读">
            <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="5" y="4" width="14" height="16" rx="1" strokeWidth="2"/>
            </svg>
          </button>
          
          {/* 双页阅读 */}
          <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors" title="双页阅读">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="4" width="8" height="16" rx="1"/>
              <rect x="13" y="4" width="8" height="16" rx="1"/>
            </svg>
          </button>
          
          {/* 翻转 */}
          <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="翻转">
            <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="w-px h-5 bg-gray-300 mx-1"></div>
          
          {/* 鼠标指针 */}
          <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors" title="鼠标指针">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
            </svg>
          </button>
          
          {/* 抓手 */}
          <button className="p-2 hover:bg-gray-200 rounded transition-colors" title="抓手">
            <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18 8a2 2 0 0 1 2 2v6a4 4 0 0 1-4 4h-2a4 4 0 0 1-4-4v-1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Center Section - Page Navigation or Language Selector */}
        <div className="flex items-center gap-3">
          {activeTab === 'blog' ? (
            // Language Selector and Zoom for Blog tab
            <>
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  <Globe className="w-4 h-4 text-gray-700" />
                  <span className="text-sm text-gray-700">{languageLabels[blogLanguage]}</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </button>
                
                {showLanguageMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowLanguageMenu(false)}
                    />
                    <div className="absolute top-full mt-1 left-0 bg-white border border-gray-300 rounded shadow-lg z-20 py-1 min-w-[140px]">
                      {(Object.keys(languageLabels) as Array<keyof typeof languageLabels>).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => {
                            setBlogLanguage(lang);
                            setShowLanguageMenu(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                            blogLanguage === lang ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                        >
                          {languageLabels[lang]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded">
                <button
                  onClick={() => setBlogScale(Math.max(0.5, blogScale - 0.1))}
                  className="hover:bg-gray-200 rounded p-0.5"
                >
                  <ZoomOut className="w-3 h-3 text-gray-700" />
                </button>
                <select
                  value={Math.round(blogScale * 100)}
                  onChange={(e) => setBlogScale(parseInt(e.target.value) / 100)}
                  className="text-xs border-none bg-transparent outline-none cursor-pointer px-1"
                >
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="90">90%</option>
                  <option value="100">100%</option>
                  <option value="110">110%</option>
                  <option value="125">125%</option>
                  <option value="150">150%</option>
                </select>
                <button
                  onClick={() => setBlogScale(Math.min(2, blogScale + 0.1))}
                  className="hover:bg-gray-200 rounded p-0.5"
                >
                  <ZoomIn className="w-3 h-3 text-gray-700" />
                </button>
              </div>
            </>
          ) : (
            // Page Navigation for Paper and Translation tabs
            <>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val >= 1 && val <= totalPages) setCurrentPage(val);
                  }}
                  className="w-12 text-center text-sm border border-gray-300 rounded px-1 py-0.5"
                />
                <span className="text-sm text-gray-600">/ {totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
              
              <div className="w-px h-5 bg-gray-300 mx-2"></div>
              
              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              
              <div className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded">
                <button
                  onClick={() => setPdfScale(Math.max(0.25, pdfScale - 0.1))}
                  className="hover:bg-gray-200 rounded p-0.5"
                >
                  <ZoomOut className="w-3 h-3 text-gray-700" />
                </button>
                <select
                  value={Math.round(pdfScale * 100)}
                  onChange={(e) => setPdfScale(parseInt(e.target.value) / 100)}
                  className="text-xs border-none bg-transparent outline-none cursor-pointer px-1"
                >
                  <option value="25">25%</option>
                  <option value="50">50%</option>
                  <option value="75">75%</option>
                  <option value="100">100%</option>
                  <option value="125">125%</option>
                  <option value="150">150%</option>
                </select>
                <button
                  onClick={() => setPdfScale(Math.min(2, pdfScale + 0.1))}
                  className="hover:bg-gray-200 rounded p-0.5"
                >
                  <ZoomIn className="w-3 h-3 text-gray-700" />
                </button>
              </div>
              
              <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <button 
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="全屏显示"
          >
            <Maximize className="w-4 h-4 text-gray-700" />
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Download
          </button>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar - Preview and Structure */}
        <div className={`w-56 border-r border-gray-200 bg-gray-50 flex flex-col flex-shrink-0 transition-all duration-300 ${leftSidebarCollapsed ? 'hidden' : ''}`}>
          {/* Tab Switcher */}
          <div className="flex border-b border-gray-300">
            <button 
              onClick={() => setSidebarTab('preview')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                sidebarTab === 'preview'
                  ? 'text-gray-900 bg-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
            <button 
              onClick={() => setSidebarTab('structure')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
                sidebarTab === 'structure'
                  ? 'text-gray-900 bg-white border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Structure
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {sidebarTab === 'preview' && (
              <PageThumbnails 
                currentPage={currentPage} 
                totalPages={totalPages}
                onPageClick={setCurrentPage}
              />
            )}
            {sidebarTab === 'structure' && (
              <TableOfContents elements={[]} paperId={paperId} />
            )}
          </div>

          {/* User Panel at Bottom */}
          <UserPanel />
        </div>

        {/* Left Sidebar Toggle Button */}
        <button
          onClick={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
          className="fixed top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-r-md shadow-sm hover:bg-gray-50 transition-all px-1 py-3"
          style={{ left: leftSidebarCollapsed ? '0' : '224px' }}
          title={leftSidebarCollapsed ? 'Show left sidebar' : 'Hide left sidebar'}
        >
          {leftSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Middle Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 flex items-center justify-center gap-6 px-6 flex-shrink-0">
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'blog'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Blog
            </button>
            <button
              onClick={() => setActiveTab('paper')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'paper'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Paper
            </button>
            <button
              onClick={() => setActiveTab('translation')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'translation'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Translation
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'blog' && <BlogView paper={paper} language={blogLanguage} scale={blogScale} isFirstVisit={isFirstBlogVisit} />}
            {activeTab === 'paper' && <PaperView paper={paper} currentPage={currentPage} pdfScale={pdfScale} />}
            {activeTab === 'translation' && <TranslationView paper={paper} pdfScale={pdfScale} isParsing={isParsing} />}
          </div>
        </div>

        {/* Right Sidebar Toggle Button */}
        <button
          onClick={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          className="fixed top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-l-md shadow-sm hover:bg-gray-50 transition-all px-1 py-3"
          style={{ right: rightSidebarCollapsed ? '0' : '320px' }}
          title={rightSidebarCollapsed ? 'Show right sidebar' : 'Hide right sidebar'}
        >
          {rightSidebarCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Right Sidebar - Comments & Notes */}
        <div className={`w-80 border-l border-gray-200 bg-white flex-shrink-0 transition-all duration-300 ${rightSidebarCollapsed ? 'hidden' : ''}`}>
          <CommentsPanel paperId={paperId} />
        </div>
      </div>
    </div>
  );
}