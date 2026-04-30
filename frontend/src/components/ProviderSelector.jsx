import { useState } from 'react'

const PROVIDERS = [
  { id: 'openai',    label: 'OpenAI',     model: 'GPT-4o',                color: 'from-emerald-500 to-teal-600' },
  { id: 'anthropic', label: 'Anthropic',  model: 'Claude Sonnet',         color: 'from-orange-500 to-amber-600' },
  { id: 'google',    label: 'Google',     model: 'Gemini 1.5 Pro',        color: 'from-blue-500 to-cyan-600' },
  { id: 'groq',      label: 'Groq',       model: 'Llama 3.3 70B',         color: 'from-purple-500 to-violet-600' },
  { id: 'mistral',   label: 'Mistral',    model: 'Mistral Large',         color: 'from-rose-500 to-pink-600' },
]

export default function ProviderSelector({ selected, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-3">
        🤖 AI Provider
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            type="button"
            id={`provider-btn-${p.id}`}
            onClick={() => onChange(p.id)}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-200 text-center
              ${selected === p.id
                ? `bg-gradient-to-br ${p.color} border-transparent shadow-lg scale-105`
                : 'bg-white/5 border-white/10 hover:border-white/25 hover:bg-white/10'
              }`}
          >
            <span className="font-semibold text-sm">{p.label}</span>
            <span className={`text-xs ${selected === p.id ? 'text-white/80' : 'text-gray-500'}`}>
              {p.model}
            </span>
            {selected === p.id && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-brand-600" fill="currentColor" viewBox="0 0 12 12">
                  <path d="M10 3L5 8.5 2 5.5l-1 1L5 10.5l6-7-1-0.5z" />
                </svg>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
