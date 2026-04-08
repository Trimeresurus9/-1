import React from 'react';
import { Search, BookOpen, Sparkles, ChevronDown, Settings as SettingsIcon, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { SettingsModal } from './SettingsModal';
import { ScrollFloat } from './effects/ScrollFloat';

// Clean button component that filters out Figma debug props
const CleanButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>((props, ref) => {
  const cleanProps = { ...props };
  // Remove Figma inspection properties
  Object.keys(cleanProps).forEach(key => {
    if (key.startsWith('_fg') || key.startsWith('data-fg')) {
      delete (cleanProps as any)[key];
    }
  });
  return <button ref={ref} {...cleanProps} />;
});
CleanButton.displayName = 'CleanButton';

export type ViewMode = 'list' | 'library' | 'scholar-qa' | 'paper-reproduction' | 'idea-discovery';

interface HomePageProps {
  onNavigateToWorkspace: () => void;
  onNavigate?: (view: ViewMode) => void;
  onOpenPricing?: () => void;
}

export function HomePage({ onNavigateToWorkspace, onNavigate, onOpenPricing }: HomePageProps) {
  const [showSettingsModal, setShowSettingsModal] = React.useState(false);
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 relative">
          <div className="flex items-center justify-between" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}>
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">WisPaper</span>
            </div>

            {/* Center: Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
                <button
                  onClick={() => onNavigate?.('list')}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Search
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <CleanButton type="button" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      <span>Features</span>
                      <ChevronDown className="w-4 h-4" />
                    </CleanButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onSelect={() => onNavigate?.('scholar-qa')}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 16v-4M12 8h.01" />
                      </svg>
                      <span>Scholar QA</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onSelect={() => onNavigate?.('library')}>
                      <BookOpen className="w-4 h-4" />
                      <span>Library</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onSelect={() => onNavigate?.('paper-reproduction')}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7h18" />
                        <path d="M6 3h12l3 4H3z" />
                        <path d="M5 7v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
                      </svg>
                      <span>PaperClaw</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onSelect={() => onNavigate?.('idea-discovery')}>
                      <Sparkles className="w-4 h-4" />
                      <span>Idea Discovery</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 7h18" />
                        <path d="M6 3h12l3 4H3z" />
                        <path d="M5 7v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7" />
                      </svg>
                      <span>Projects</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12l2 2 4-4" />
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                      <span>TrueCite</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <CleanButton type="button" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      <span>Resources</span>
                      <ChevronDown className="w-4 h-4" />
                    </CleanButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onSelect={() => onNavigateToWorkspace()}>
                      <Sparkles className="w-4 h-4" />
                      <span>AI Feeds</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        scrollToSection('resources-section');
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>AI Survey</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 0 4 24V4.5A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                      <span>Blog</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 8l6 4-6 4V8z" />
                        <path d="M13 4h6v6" />
                        <path d="M19 4l-8 8" />
                      </svg>
                      <span>Translation</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-2 cursor-pointer"
                      onSelect={(e) => {
                        e.preventDefault();
                        scrollToSection('faq');
                      }}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                      <span>FAQ</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <button
                  onClick={() => onOpenPricing?.()}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </button>
            </nav>

            {/* Right: Workspace Button and User Avatar */}
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToWorkspace}
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                <span>Workspace</span>
              </button>
              
              {/* User Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <CleanButton type="button" className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                    <span className="text-white font-bold text-sm">张</span>
                  </CleanButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">张伟</p>
                    <p className="text-xs text-gray-500">zhangwei@example.com</p>
                  </div>
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onSelect={(e) => {
                      e.preventDefault();
                      setShowSettingsModal(true);
                    }}
                  >
                    <SettingsIcon className="w-4 h-4" />
                    <span>设置</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600">
                    <LogOut className="w-4 h-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-5xl w-full">
          {/* Watch Instruction Video Link */}
          <div className="text-center mb-6">
            <button className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              <span>▶ Watch Instruction Video</span>
            </button>
          </div>

          {/* Main Title */}
          <div className="text-center mb-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              <ScrollFloat className="inline-block">WisPaper</ScrollFloat>: AI Scholar Search Engine
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Ask in Natural Language
            </p>
            <p className="text-base text-gray-500">
              AI understands your request, searches full text, and finds all papers that match your needs.
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. Find me papers that study AI4Science in recent 3 years..."
                className="w-full px-6 py-4 pr-14 text-base border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                onFocus={onNavigateToWorkspace}
              />
              <button
                onClick={onNavigateToWorkspace}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-900 hover:bg-gray-800 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="relative max-w-4xl mx-auto h-96 mb-16">
            {/* Left Preview Card - Search Results */}
            <div className="absolute left-0 top-8 w-[52%] bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform -rotate-2 hover:rotate-0 transition-transform">
              <div className="space-y-4">
                {/* Mock Search Result Item 1 */}
                <div className="pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                        AI-driven protein structure prediction and design
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        Recent advances in machine learning have revolutionized computational biology, particularly in protein structure prediction...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Nature</span>
                        <span>•</span>
                        <span>2024</span>
                        <span>•</span>
                        <span className="text-blue-600">🔗 Cited</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Search Result Item 2 */}
                <div className="pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                        Machine learning for molecular discovery
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        This paper surveys recent AI methods applied to accelerating scientific discovery in chemistry and materials science...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Science</span>
                        <span>•</span>
                        <span>2023</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Search Result Item 3 */}
                <div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                        Deep learning in computational chemistry
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        We review applications of neural networks to quantum chemistry calculations...
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>arXiv</span>
                        <span>•</span>
                        <span>2023</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5</span>
                </div>
              </div>
            </div>

            {/* Right Preview Card - AI Assistant */}
            <div className="absolute right-0 top-0 w-[52%] bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 transform rotate-2 hover:rotate-0 transition-transform">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900">WisPaper</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Working Now</span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>

                {/* AI Message */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-700 leading-relaxed mb-2">
                        ✓ Searching
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed mb-2">
                        ✓ Analyzed 1,456 papers from 2021-2024
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed mb-3">
                        ✓ Found 83 papers matching "AI4Science"
                      </p>
                      
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-semibold text-gray-900 mb-2">
                          "Query": The query investigates difference and similarity between AI studies and AI studies in recent 3 years - Keval Singh
                        </p>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          The paper investigates the performance of AI in tasks through a series of researchers. It sets new state-of-the-art benchmarks for AI tasks, offering insights into their capabilities and limitations.
                        </p>
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Find me papers that study differences in recent 3 years...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Indicator */}
                <div className="flex items-center justify-between pt-2">
                  <button className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  <button className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Features</h2>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Feature 1: Scholar Search */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scholar Search</h3>
              <p className="text-sm text-gray-600">
                Natural language search powered by AI to find relevant academic papers instantly
              </p>
            </div>

            {/* Feature 2: Library */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Library</h3>
              <p className="text-sm text-gray-600">
                Organize and manage your research papers in a personal library
              </p>
            </div>

            {/* Feature 3: AI Feeds */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Feeds</h3>
              <p className="text-sm text-gray-600">
                Get personalized paper recommendations based on your research interests
              </p>
            </div>
          </div>

          {/* Additional Content (to enable scrolling) */}
          <div className="max-w-5xl mx-auto mt-20 space-y-16">
            {/* Use cases */}
            <section className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="flex items-start justify-between gap-8 flex-col md:flex-row">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">What you can do with WisPaper</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Turn vague research ideas into precise queries, scan full text at scale, and organize evidence for writing and review.
                  </p>
                </div>
                <div className="w-full md:w-[420px] grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Natural language</p>
                    <p className="text-sm text-gray-600">Ask like a human, get structured results.</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Full-text search</p>
                    <p className="text-sm text-gray-600">Find mentions beyond title & abstract.</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Citations</p>
                    <p className="text-sm text-gray-600">Trace claims back to the source.</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900 mb-1">Workflows</p>
                    <p className="text-sm text-gray-600">From query → review → report.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Highlights */}
            <section id="resources-section">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Highlights</h2>
                <p className="text-gray-600">A quick snapshot of what WisPaper helps you achieve.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { k: "Faster screening", v: "Shortlist papers in minutes, not hours." },
                  { k: "Better recall", v: "Catch relevant mentions buried in the text." },
                  { k: "Cleaner notes", v: "Keep findings, quotes, and links in one place." },
                  { k: "Reproducible", v: "Record your search steps and decisions." },
                  { k: "Team-ready", v: "Share queries and results with collaborators." },
                  { k: "Less context switching", v: "Search, read, and track in a single flow." },
                ].map((item) => (
                  <div key={item.k} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <p className="text-sm font-semibold text-gray-900 mb-2">{item.k}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.v}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="bg-white border border-gray-200 rounded-2xl p-8">
              <div className="w-full mb-6">
                <ScrollFloat className="block text-center text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900">
                  WisPaper
                </ScrollFloat>
              </div>
              <div className="flex items-end justify-between gap-6 flex-col md:flex-row">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">FAQ</h2>
                  <p className="text-gray-600">Common questions before you start.</p>
                </div>
                <button
                  onClick={onNavigateToWorkspace}
                  className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Start searching
                </button>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900 mb-2">What does “full text” mean?</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    It searches inside the paper content, not only metadata like title/abstract, so you can find specific terms and evidence.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Can I write natural language queries?</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Yes. Describe your intent in plain language; WisPaper turns it into an effective search and returns structured results.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900 mb-2">How do I save results?</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Add items to projects and keep notes with links so you can revisit, cite, and share later.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Is this only for AI papers?</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    No. It works across domains—biology, chemistry, medicine, materials, and more.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom spacer */}
            <div className="h-24" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
            <div className="lg:col-span-1">
              <p className="text-sm font-semibold text-gray-900">WisPaper</p>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                A modern AI scholar search and idea discovery platform.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 mb-4">Feature</p>
              <div className="space-y-3">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('list');
                  }}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Scholar Search
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('scholar-qa');
                  }}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Scholar QA
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('library');
                  }}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Library
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  AI Feeds
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('paper-reproduction');
                  }}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  PaperClaw
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate?.('idea-discovery');
                  }}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Idea Discovery
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  TrueCite
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Projects
                </a>
              </div>
            </div>

            <div className="md:col-span-1">
              <p className="text-sm font-semibold text-gray-900 mb-4">Resource</p>
              <div className="space-y-3">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  AI Survey
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Blog
                </a>
                <a
                  href="#faq"
                  className="block text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                  FAQ
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between text-sm text-gray-500 gap-4">
            <p>© 2024 WisPaper. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
    </div>
  );
}
