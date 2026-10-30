import React from 'react';
import { Layers, Sparkles, BookOpen, Calendar, DollarSign, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'pipeline' | 'insights' | 'profiles' | 'channels' | 'scheduler' | 'philosophy';
  setActiveTab: (tab: 'pipeline' | 'insights' | 'profiles' | 'channels' | 'scheduler' | 'philosophy') => void;
  onNewIngestion: () => void;
  hasRunData: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onNewIngestion,
  hasRunData
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <a 
              href="#top" 
              className="text-lg font-bold tracking-tight text-white hover:text-indigo-300 transition-colors whitespace-nowrap"
            >
              OmniRepurpose
            </a>
          </div>

          {/* Zone 2: 4-5 Clean Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <button
              type="button"
              onClick={() => setActiveTab('pipeline')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                activeTab === 'pipeline' ? 'text-white border-b-2 border-indigo-500' : ''
              }`}
            >
              Ingest & Pipeline
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('insights')}
              disabled={!hasRunData}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                !hasRunData ? 'opacity-40 cursor-not-allowed' : ''
              } ${activeTab === 'insights' ? 'text-white border-b-2 border-indigo-500' : ''}`}
            >
              Content Insights
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profiles')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                activeTab === 'profiles' ? 'text-white border-b-2 border-indigo-500' : ''
              }`}
            >
              Style Memory
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('channels')}
              disabled={!hasRunData}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                !hasRunData ? 'opacity-40 cursor-not-allowed' : ''
              } ${activeTab === 'channels' ? 'text-white border-b-2 border-indigo-500' : ''}`}
            >
              Multi-Channel Review
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scheduler')}
              disabled={!hasRunData}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                !hasRunData ? 'opacity-40 cursor-not-allowed' : ''
              } ${activeTab === 'scheduler' ? 'text-white border-b-2 border-indigo-500' : ''}`}
            >
              Schedule & Export
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('philosophy')}
              className={`hover:text-white transition-colors whitespace-nowrap py-1 ${
                activeTab === 'philosophy' ? 'text-white border-b-2 border-indigo-500' : ''
              }`}
            >
              Philosophy & Economics
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onNewIngestion}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm whitespace-nowrap flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Ingestion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
