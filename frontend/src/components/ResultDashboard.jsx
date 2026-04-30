import { useEffect, useRef } from 'react'

function ScoreRing({ score }) {
  const radius = 80
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 75 ? '#10b981' :
    score >= 50 ? '#f59e0b' :
                  '#ef4444'

  const label =
    score >= 75 ? 'Great Match!' :
    score >= 50 ? 'Fair Match' :
                  'Needs Work'

  return (
    <div id="score-ring" className="flex flex-col items-center gap-3">
      <svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
        {/* Background track */}
        <circle cx="100" cy="100" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
        {/* Score arc */}
        <circle
          cx="100" cy="100" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 8px ${color}88)`
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs font-semibold text-gray-400 mt-1">/ 100</span>
      </div>
      <span className="font-semibold text-sm" style={{ color }}>{label}</span>
    </div>
  )
}

function KeywordBadge({ word }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm font-medium">
      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      {word}
    </span>
  )
}

function SuggestionItem({ text, index }) {
  return (
    <li className="flex gap-3 p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 transition-colors duration-150">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center mt-0.5">
        {index + 1}
      </span>
      <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
    </li>
  )
}

export default function ResultDashboard({ result, provider, onReset }) {
  const { score, missing_keywords, suggestions, summary } = result

  const scoreColor =
    score >= 75 ? 'text-emerald-400' :
    score >= 50 ? 'text-amber-400' :
                  'text-red-400'

  const scoreBg =
    score >= 75 ? 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20' :
    score >= 50 ? 'from-amber-500/10 to-orange-500/5 border-amber-500/20' :
                  'from-red-500/10 to-rose-500/5 border-red-500/20'

  return (
    <div id="result-dashboard" className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
          <p className="text-gray-500 text-sm mt-0.5">Powered by <span className="text-brand-400 capitalize font-medium">{provider}</span></p>
        </div>
        <button
          id="reset-btn"
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400
                     hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          New Analysis
        </button>
      </div>

      {/* Score + Summary */}
      <div className={`glass-card p-6 bg-gradient-to-br ${scoreBg} border`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Score Ring */}
          <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: 200, height: 200 }}>
            <ScoreRing score={score} />
          </div>
          {/* Summary */}
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-white">Overall Assessment</h3>
            <p className="text-gray-300 leading-relaxed">{summary}</p>
            {/* Quick stats */}
            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span className="text-sm text-gray-300">
                  <span className="font-bold text-red-400">{missing_keywords.length}</span> missing keywords
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span className="text-sm text-gray-300">
                  <span className="font-bold text-brand-400">{suggestions.length}</span> suggestions
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Keywords */}
      {missing_keywords.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Missing Keywords</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">These important terms from the job description are absent in your CV:</p>
          <div id="missing-keywords-list" className="flex flex-wrap gap-2">
            {missing_keywords.map((kw, i) => (
              <KeywordBadge key={i} word={kw} />
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Improvement Suggestions</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">Actionable steps to strengthen your CV for this role:</p>
          <ul id="suggestions-list" className="space-y-3">
            {suggestions.map((s, i) => (
              <SuggestionItem key={i} text={s} index={i} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
