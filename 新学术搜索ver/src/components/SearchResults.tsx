import React, { useState } from 'react';
import { PaperList } from './PaperList';
import { BookList } from './BookList';
import { ThesisList } from './ThesisList';
import { FileText, BookOpen, GraduationCap, Library, Award } from 'lucide-react';
import { Paper } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SearchResultsProps {
  papers: Paper[];
  books: any[];
  theses: any[];
  selectedPaper: Paper | null;
  onSelectPaper: (paper: Paper) => void;
  searchQuery: string;
}

type TabType = 'papers' | 'books' | 'theses' | 'fudan-library' | 'fudan-research';

export function SearchResults({ 
  papers, 
  books, 
  theses, 
  selectedPaper, 
  onSelectPaper,
  searchQuery 
}: SearchResultsProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('papers');
  
  // Filter papers by type for Fudan tabs
  const fudanLibraryResources = papers.filter(
    paper => paper.type === 'book' || paper.type === 'special' || paper.type === 'thesis'
  );
  
  const fudanResearchOutputs = papers.filter(
    paper => paper.type === 'thesis' || (paper.venue && paper.venue.includes('复旦'))
  );

  const tabs = [
    { 
      id: 'papers' as TabType, 
      label: t('search.tab.papers'), 
      icon: FileText,
      count: papers.length 
    },
    { 
      id: 'fudan-library' as TabType, 
      label: t('search.tab.fudanLibrary'), 
      icon: Library,
      count: fudanLibraryResources.length 
    },
    { 
      id: 'fudan-research' as TabType, 
      label: t('search.tab.fudanResearch'), 
      icon: Award,
      count: fudanResearchOutputs.length 
    },
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all text-sm font-medium ${
                  isActive
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                  isActive 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {activeTab === 'papers' && (
          <PaperList
            papers={papers}
            selectedPaper={selectedPaper}
            onSelectPaper={onSelectPaper}
          />
        )}
        
        {activeTab === 'books' && (
          <BookList books={books} />
        )}
        
        {activeTab === 'theses' && (
          <ThesisList theses={theses} />
        )}
        
        {activeTab === 'fudan-library' && (
          <PaperList
            papers={fudanLibraryResources}
            selectedPaper={selectedPaper}
            onSelectPaper={onSelectPaper}
          />
        )}
        
        {activeTab === 'fudan-research' && (
          <PaperList
            papers={fudanResearchOutputs}
            selectedPaper={selectedPaper}
            onSelectPaper={onSelectPaper}
          />
        )}
      </div>
    </div>
  );
}