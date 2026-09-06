import React from 'react';
import {
  BookOpen,
  Upload,
  Search,
  X,
  Cloud,
  Sun,
  Moon,
} from 'lucide-react';
import { CloudSync } from '../services/cloudSync';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenCloudSync: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalPapersCount?: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onOpenCloudSync,
  searchQuery,
  onSearchChange,
  totalPapersCount = 0,
  theme,
  onToggleTheme,
}) => {
  const isCloudConnected = CloudSync.isConfigured();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-black/60 border-b border-zinc-200 dark:border-white/10 backdrop-blur-2xl text-zinc-900 dark:text-white transition-all shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 dark:bg-zinc-900 text-white border border-zinc-700 flex-shrink-0 shadow-sm">
              <BookOpen className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight font-display text-zinc-900 dark:text-white">
                  Class 10 <span className="text-zinc-400 font-semibold">Sets Vault</span>
                </span>

                {/* Cloud Sync Status Indicator */}
                <button
                  onClick={onOpenCloudSync}
                  title={isCloudConnected ? 'Supabase Connected' : 'Click to connect Supabase'}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold cursor-pointer transition-colors border ${
                    isCloudConnected
                      ? 'bg-zinc-100 dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-emerald-600 dark:text-emerald-400'
                      : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isCloudConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                  <span>{isCloudConnected ? 'Cloud Active' : 'Offline Mode'}</span>
                </button>

                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                  {totalPapersCount} Papers
                </span>
              </div>
            </div>
          </div>

          {/* Search Input on Desktop */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search subject (e.g. Maths, Physics, Chemistry, Biology...)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none transition-all font-sans bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-zinc-400 dark:focus:border-zinc-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Cloud Settings */}
            <button
              onClick={onOpenCloudSync}
              title="Supabase Settings"
              className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all cursor-pointer"
            >
              <Cloud className="w-4 h-4" />
            </button>

            {/* Upload Set Button */}
            <button
              onClick={onOpenUpload}
              className="px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black font-extrabold text-xs transition-all hover:bg-black dark:hover:bg-zinc-200 active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Paper</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search Maths, Physics, Chemistry..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none transition-all font-sans bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-zinc-400 dark:focus:border-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
