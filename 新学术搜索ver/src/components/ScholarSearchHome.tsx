import React, { useState } from 'react';
import { Search, ArrowRight, ChevronRight, ChevronLeft, BookOpen, GraduationCap, Infinity, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ScholarSearchHomeProps {
  onSearch: (query: string) => void;
  showDeepSearchTooltip?: boolean;
  onTooltipDismiss?: () => void;
}

// Category keys for translation
const categoryKeys = [
  'libraryCollections',
  'undergraduateTheses',
  'computerScience',
  'medicine',
  'biology',
  'chemistry',
  'finance',
  'environmentalScience',
  'math',
  'engineering',
  'physics',
  'psychology'
];

const bookCategoryKeys = ['literature', 'design', 'journalism'];
const thesesCategoryKeys = ['cs', 'socialScience', 'naturalScience'];

// Get example query keys for each category
const getCategoryExamples = (categoryKey: string): string[] => {
  const exampleMap: { [key: string]: string[] } = {
    'libraryCollections': ['example.library.1', 'example.library.2', 'example.library.3'],
    'undergraduateTheses': ['example.undergrad.1', 'example.undergrad.2', 'example.undergrad.3'],
    'computerScience': ['example.cs.1', 'example.cs.2', 'example.cs.3'],
    'medicine': ['example.medicine.1', 'example.medicine.2', 'example.medicine.3'],
    'biology': ['example.biology.1', 'example.biology.2', 'example.biology.3'],
    'chemistry': ['example.chemistry.1', 'example.chemistry.2', 'example.chemistry.3'],
    'finance': ['example.finance.1', 'example.finance.2', 'example.finance.3'],
    'environmentalScience': ['example.envScience.1', 'example.envScience.2', 'example.envScience.3'],
    'math': ['example.math.1', 'example.math.2', 'example.math.3'],
    'engineering': ['example.engineering.1', 'example.engineering.2', 'example.engineering.3'],
    'physics': ['example.physics.1', 'example.physics.2', 'example.physics.3'],
    'psychology': ['example.psychology.1', 'example.psychology.2', 'example.psychology.3'],
  };
  return exampleMap[categoryKey] || [];
};

const getBookCategoryExamples = (categoryKey: string): string[] => {
  const exampleMap: { [key: string]: string[] } = {
    'literature': ['example.book.literature.1', 'example.book.literature.2', 'example.book.literature.3'],
    'design': ['example.book.design.1', 'example.book.design.2', 'example.book.design.3'],
    'journalism': ['example.book.journalism.1', 'example.book.journalism.2', 'example.book.journalism.3'],
  };
  return exampleMap[categoryKey] || [];
};

const getThesesCategoryExamples = (categoryKey: string): string[] => {
  const exampleMap: { [key: string]: string[] } = {
    'cs': ['example.theses.cs.1', 'example.theses.cs.2', 'example.theses.cs.3'],
    'socialScience': ['example.theses.social.1', 'example.theses.social.2', 'example.theses.social.3'],
    'naturalScience': ['example.theses.natural.1', 'example.theses.natural.2', 'example.theses.natural.3'],
  };
  return exampleMap[categoryKey] || [];
};

export function ScholarSearchHome({ onSearch, showDeepSearchTooltip, onTooltipDismiss }: ScholarSearchHomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'quick' | 'deep' | 'books' | 'theses'>('deep');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedBookCategory, setSelectedBookCategory] = useState<string>('literature');
  const [selectedThesesCategory, setSelectedThesesCategory] = useState<string>('cs');
  const [selectedCategory, setSelectedCategory] = useState<string>('libraryCollections');
  const [selectedDatabase, setSelectedDatabase] = useState<string>('public');

  const visibleCategories = 8;
  const canScrollLeft = currentCategoryIndex > 0;
  const canScrollRight = currentCategoryIndex < categoryKeys.length - visibleCategories;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleExampleClick = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (direction === 'left' && canScrollLeft) {
      setCurrentCategoryIndex(Math.max(0, currentCategoryIndex - 1));
    } else if (direction === 'right' && canScrollRight) {
      setCurrentCategoryIndex(Math.min(categoryKeys.length - visibleCategories, currentCategoryIndex + 1));
    }
  };

  const { t } = useLanguage();

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-3">
            Hi . Which paper do you want to read today?
          </h1>
        </div>

        {/* Search Box Container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
          {/* Search Input */}
          <div className="relative mb-4">
            <textarea
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSearch())}
              placeholder="e.g., Find me papers that study AI4Science in recent 3 years..."
              rows={3}
              className="w-full px-4 py-3 text-base border-0 focus:outline-none resize-none"
            />
          </div>

          {/* Mode Toggle and Options */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              {/* Slider Tab for Quick/Deep Mode */}
              <div className="relative bg-gray-100 rounded-lg p-1 inline-flex">
                {/* Sliding Background */}
                <div 
                  className={`absolute inset-y-1 bg-white rounded-md shadow-sm transition-all duration-200 ease-in-out ${
                    searchMode === 'deep' 
                      ? 'left-[calc(50%+0.125rem)] right-1' 
                      : 'left-1 right-[calc(50%+0.125rem)]'
                  }`}
                />
                
                {/* Quick Mode */}
                <button
                  onClick={() => setSearchMode('quick')}
                  className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                    searchMode === 'quick'
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" />
                  </svg>
                  <span>Quick Mode</span>
                </button>

                {/* Deep Mode */}
                <button
                  onClick={() => setSearchMode('deep')}
                  className={`relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                    searchMode === 'deep'
                      ? 'text-blue-600 font-medium'
                      : 'text-gray-500'
                  }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
                  </svg>
                  <span>Deep Mode</span>
                </button>
              </div>

              {/* Database Selector */}
              <div className="relative">
                
                
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Unmetered */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-gray-600 hover:text-gray-900 text-sm transition-colors">
                <Infinity className="w-4 h-4" />
                <span>Unmetered</span>
              </button>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="p-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Description */}
          {searchMode === 'deep' && (
            null
          )}
        </div>

        {/* Try Our Examples Section */}
        <div>
          <h2 className="text-center text-lg font-semibold text-gray-900 mb-4">{t('search.examples')}</h2>
          
          {/* Category Tabs - show different categories based on mode */}
          {searchMode === 'books' ? (
            <div className="relative mb-6">
              <div className="flex items-center justify-center gap-2">
                {bookCategoryKeys.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedBookCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                      selectedBookCategory === category
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {t(`category.${category}`)}
                  </button>
                ))}
              </div>
            </div>
          ) : searchMode === 'theses' ? (
            <div className="relative mb-6">
              <div className="flex items-center justify-center gap-2">
                {thesesCategoryKeys.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedThesesCategory(category)}
                    className={`flex-shrink-0 px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                      selectedThesesCategory === category
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {t(`category.${category}`)}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="relative mb-6">
              <div className="flex items-center gap-2">
                {canScrollLeft && (
                  <button
                    onClick={() => scrollCategories('left')}
                    className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                  </button>
                )}
                
                <div className="flex-1 overflow-hidden">
                  <div className="flex gap-2">
                    {categoryKeys.slice(currentCategoryIndex, currentCategoryIndex + visibleCategories).map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`flex-shrink-0 px-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                          selectedCategory === category
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {t(`category.${category}`)}
                      </button>
                    ))}
                  </div>
                </div>

                {canScrollRight && (
                  <button
                    onClick={() => scrollCategories('right')}
                    className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Example Queries - show different queries based on mode */}
          <div className="space-y-2">
            {searchMode === 'books' ? (
              getBookCategoryExamples(selectedBookCategory).map((queryKey, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(t(queryKey))}
                  className="w-full flex items-center justify-between px-5 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <span className="text-gray-700 text-sm text-left">{t(queryKey)}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                </button>
              ))
            ) : searchMode === 'theses' ? (
              getThesesCategoryExamples(selectedThesesCategory).map((queryKey, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(t(queryKey))}
                  className="w-full flex items-center justify-between px-5 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <span className="text-gray-700 text-sm text-left">{t(queryKey)}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                </button>
              ))
            ) : (
              getCategoryExamples(selectedCategory).map((queryKey, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(t(queryKey))}
                  className="w-full flex items-center justify-between px-5 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
                >
                  <span className="text-gray-700 text-sm text-left">{t(queryKey)}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}