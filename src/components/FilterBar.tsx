import React from 'react';
import { X, Check, ArrowUpDown, Filter, ChevronDown } from 'lucide-react';
import { type FilterState } from '../types/paper';
import { DEPARTMENTS, SESSIONS_LIST, SETS_LIST, YEARS_LIST } from '../data/mockPapers';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (newFilter: FilterState) => void;
  onResetFilter: () => void;
  filteredCount: number;
  totalCount: number;
  isDark: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  onResetFilter,
  filteredCount,
  totalCount,
  isDark,
}) => {
  const hasActiveFilters =
    filter.searchQuery !== '' ||
    filter.department !== '' ||
    filter.session !== 'All Sessions' ||
    filter.set !== 'All Sets' ||
    filter.year !== 'All Years' ||
    filter.hasSolutionOnly;

  const getSetChipStyle = (setName: string, isSelected: boolean) => {
    if (!isSelected) {
      return isDark
        ? 'liquid-glass-pill text-zinc-400 hover:text-zinc-200'
        : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300 shadow-sm';
    }
    switch (setName) {
      case 'Set A':
        return 'bg-amber-500 text-black border-amber-300 font-bold shadow-lg shadow-amber-500/25';
      case 'Set B':
        return 'bg-cyan-500 text-black border-cyan-300 font-bold shadow-lg shadow-cyan-500/25';
      case 'Set C':
        return 'bg-emerald-500 text-black border-emerald-300 font-bold shadow-lg shadow-emerald-500/25';
      case 'Set D':
        return 'bg-zinc-900 text-zinc-100 border-zinc-600 font-bold shadow-lg shadow-black/50';
      case 'Other':
        return 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-lg shadow-indigo-500/25';
      default:
        return 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-lg shadow-indigo-500/25';
    }
  };

  return (
    <div
      className={`w-full border-b sticky top-14 z-30 py-3 px-4 sm:px-6 lg:px-8 backdrop-blur-2xl transition-colors ${
        isDark
          ? 'liquid-glass-panel border-b border-white/10 shadow-xl'
          : 'bg-white/90 border-slate-200 shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Main Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Filters Selectors Group */}
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            {/* Department Select */}
            <div className="relative">
              <select
                aria-label="Filter by department"
                value={filter.department}
                onChange={(e) => onFilterChange({ ...filter, department: e.target.value })}
                className={`text-xs font-semibold rounded-xl px-3.5 py-2 pr-8 focus:outline-none appearance-none cursor-pointer transition-colors border ${
                  isDark
                    ? 'liquid-glass-input text-zinc-200 focus:border-indigo-400'
                    : 'bg-slate-100 border-slate-200 text-slate-800 focus:border-indigo-600 focus:bg-white'
                }`}
              >
                <option value="" className={isDark ? 'bg-zinc-950 text-white' : ''}>All Departments</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.name} value={dept.name} className={isDark ? 'bg-zinc-950 text-white' : ''}>
                    {dept.name}
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
            </div>

            {/* Session Select */}
            <div className="relative">
              <select
                aria-label="Filter by session"
                value={filter.session}
                onChange={(e) => onFilterChange({ ...filter, session: e.target.value })}
                className={`text-xs font-semibold rounded-xl px-3.5 py-2 pr-8 focus:outline-none appearance-none cursor-pointer transition-colors border ${
                  isDark
                    ? 'liquid-glass-input text-zinc-200 focus:border-indigo-400'
                    : 'bg-slate-100 border-slate-200 text-slate-800 focus:border-indigo-600 focus:bg-white'
                }`}
              >
                {SESSIONS_LIST.map((sess) => (
                  <option key={sess} value={sess} className={isDark ? 'bg-zinc-950 text-white' : ''}>
                    {sess}
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
            </div>

            {/* Year Select */}
            <div className="relative">
              <select
                aria-label="Filter by year"
                value={filter.year}
                onChange={(e) => onFilterChange({ ...filter, year: e.target.value })}
                className={`text-xs font-mono font-bold rounded-xl px-3.5 py-2 pr-8 focus:outline-none appearance-none cursor-pointer transition-colors border ${
                  isDark
                    ? 'liquid-glass-input text-zinc-200 focus:border-indigo-400'
                    : 'bg-slate-100 border-slate-200 text-slate-800 focus:border-indigo-600 focus:bg-white'
                }`}
              >
                {YEARS_LIST.map((yr) => (
                  <option key={yr} value={yr} className={isDark ? 'bg-zinc-950 text-white' : ''}>
                    {yr}
                  </option>
                ))}
              </select>
              <ChevronDown className={`w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-zinc-400' : 'text-slate-400'}`} />
            </div>

            {/* Has Solution Key Checkbox Button */}
            <button
              onClick={() => onFilterChange({ ...filter, hasSolutionOnly: !filter.hasSolutionOnly })}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filter.hasSolutionOnly
                  ? isDark
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm'
                  : isDark
                    ? 'liquid-glass-pill text-zinc-400 hover:text-zinc-200'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-colors ${
                  filter.hasSolutionOnly
                    ? 'bg-emerald-500 border-emerald-400 text-black'
                    : isDark ? 'border-zinc-700 bg-zinc-950/60' : 'border-slate-300 bg-white'
                }`}
              >
                {filter.hasSolutionOnly && <Check className="w-3 h-3 stroke-[3]" />}
              </span>
              <span>Solution Key Attached</span>
            </button>

            {/* Clear All Filters */}
            {hasActiveFilters && (
              <button
                onClick={onResetFilter}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer border ${
                  isDark
                    ? 'text-rose-400 hover:text-rose-300 bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20'
                    : 'text-rose-700 hover:text-rose-800 bg-rose-50 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs ${
              isDark
                ? 'liquid-glass-pill text-zinc-300'
                : 'bg-slate-100 border border-slate-200 text-slate-700'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <select
              aria-label="Sort question papers"
              value={filter.sortBy}
              onChange={(e) =>
                onFilterChange({
                  ...filter,
                  sortBy: e.target.value as FilterState['sortBy'],
                })
              }
              className={`bg-transparent text-xs font-semibold focus:outline-none cursor-pointer ${
                isDark ? 'text-zinc-200' : 'text-slate-800'
              }`}
            >
              <option value="date-desc" className={isDark ? 'bg-zinc-950 text-white' : ''}>Newest Exam Date</option>
              <option value="date-asc" className={isDark ? 'bg-zinc-950 text-white' : ''}>Oldest Exam Date</option>
              <option value="subject" className={isDark ? 'bg-zinc-950 text-white' : ''}>Subject Name (A-Z)</option>
              <option value="downloads" className={isDark ? 'bg-zinc-950 text-white' : ''}>Most Downloaded</option>
              <option value="views" className={isDark ? 'bg-zinc-950 text-white' : ''}>Most Viewed</option>
            </select>
          </div>
        </div>

        {/* Set Filter Chips Row: Strict 4 sets (Set A, Set B, Set C, Set D) + Other */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          <span
            className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1.5 ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-indigo-500" />
            <span>Filter by Set:</span>
          </span>

          {SETS_LIST.map((setName) => {
            const isSelected = filter.set === setName;
            return (
              <button
                key={setName}
                onClick={() => onFilterChange({ ...filter, set: setName })}
                className={`px-3 py-1 rounded-full text-xs font-mono border transition-all whitespace-nowrap cursor-pointer ${getSetChipStyle(
                  setName,
                  isSelected
                )}`}
              >
                {setName}
              </button>
            );
          })}

          <div
            className={`ml-auto text-xs font-mono whitespace-nowrap pl-4 ${
              isDark ? 'text-zinc-400' : 'text-slate-500'
            }`}
          >
            Showing{' '}
            <strong className={isDark ? 'text-white' : 'text-slate-900'}>
              {filteredCount}
            </strong>{' '}
            of {totalCount} papers
          </div>
        </div>
      </div>
    </div>
  );
};
