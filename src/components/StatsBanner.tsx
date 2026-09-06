import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Layers, Users, FilePlus, Sparkles } from 'lucide-react';
import { type QuestionPaper } from '../types/paper';

interface StatsBannerProps {
  papers: QuestionPaper[];
  isDark: boolean;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ papers, isDark }) => {
  const totalPapers = papers.length;
  const standardSetsCount = new Set(
    papers
      .filter((p) => ['Set A', 'Set B', 'Set C', 'Set D'].includes(p.set))
      .map((p) => p.set)
  ).size;

  // Unique contributors / students
  const totalContributors = new Set(
    papers.map((p) => p.uploadedBy.trim()).filter((name) => name && name !== 'Contributor')
  ).size;

  const otherPapersCount = papers.filter(
    (p) =>
      p.category === 'other' ||
      p.set === 'Other' ||
      !['Set A', 'Set B', 'Set C', 'Set D'].includes(p.set)
  ).length;

  const stats = [
    {
      label: 'Class Papers Vault',
      value: totalPapers,
      sub: totalPapers === 0 ? 'Upload today’s sets' : 'Synced across class',
      icon: <FileText className="w-5 h-5 text-zinc-300" />,
      bgDark: 'liquid-glass-card',
      bgLight: 'bg-white border-slate-200 shadow-sm',
    },
    {
      label: 'Active Sets (A, B, C, D)',
      value: `${standardSetsCount} / 4`,
      sub: 'Parallel exam sets',
      icon: <Layers className="w-5 h-5 text-zinc-300" />,
      bgDark: 'liquid-glass-card',
      bgLight: 'bg-white border-slate-200 shadow-sm',
    },
    {
      label: 'Student Contributors',
      value: totalContributors > 0 ? totalContributors : 'Classmates',
      sub: 'Daily set uploads',
      icon: <Users className="w-5 h-5 text-zinc-300" />,
      bgDark: 'liquid-glass-card',
      bgLight: 'bg-white border-slate-200 shadow-sm',
    },
    {
      label: 'Other Question Papers',
      value: otherPapersCount,
      sub: 'Model & Lab papers',
      icon: <FilePlus className="w-5 h-5 text-zinc-300" />,
      bgDark: 'liquid-glass-card',
      bgLight: 'bg-white border-slate-200 shadow-sm',
    },
  ];

  return (
    <section
      className={`relative w-full border-b pt-8 pb-8 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark
          ? 'border-zinc-800 bg-black'
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Clean Header Headline */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 border ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Class-Wide Collaborative Question Paper Archive</span>
          </div>

          <h1
            className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-display ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            Class Exam Sets Vault &amp;{' '}
            <span className={isDark ? 'text-zinc-200 font-black' : 'text-slate-900 font-black'}>
              Daily Practice Hub
            </span>
          </h1>

          <p
            className={`mt-2.5 text-xs sm:text-sm font-sans leading-relaxed ${
              isDark ? 'text-zinc-400' : 'text-slate-600'
            }`}
          >
            Upload your daily question paper for <strong>Set A, Set B, Set C, or Set D</strong> so everyone in class can practice questions from all 4 sets together.
          </p>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className={`p-4 rounded-2xl border transition-all flex items-center gap-3.5 ${
                isDark ? stat.bgDark : stat.bgLight
              }`}
            >
              <div
                className={`p-2.5 rounded-xl border flex-shrink-0 ${
                  isDark ? 'bg-white/5 border-white/10 shadow-inner' : 'bg-slate-50 border-slate-200'
                }`}
              >
                {stat.icon}
              </div>

              <div>
                <div
                  className={`text-xl sm:text-2xl font-black tracking-tight font-mono ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {stat.value}
                </div>
                <div
                  className={`text-xs font-bold ${
                    isDark ? 'text-zinc-200' : 'text-slate-800'
                  }`}
                >
                  {stat.label}
                </div>
                <div
                  className={`text-[11px] ${
                    isDark ? 'text-zinc-500' : 'text-slate-500'
                  }`}
                >
                  {stat.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
