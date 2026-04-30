import { useState } from 'react'
import axios from 'axios'
import UploadForm from './components/UploadForm'
import ResultDashboard from './components/ResultDashboard'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [usedProvider, setUsedProvider] = useState(null)

  const handleAnalyze = async ({ file, jobDescription, provider }) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setUsedProvider(provider)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('job_description', jobDescription)
    formData.append('provider', provider)

    try {
      const response = await axios.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(response.data)
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'An unexpected error occurred.'
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setError(null)
    setUsedProvider(null)
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-600/10 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-900/5 blur-[160px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-sm bg-gray-950/60 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-none">AI CV Analyzer</h1>
                <p className="text-xs text-gray-500 mt-0.5">Powered by multiple AI providers</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
              API Ready
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-4 py-10">
          {/* Hero */}
          {!result && (
            <div className="text-center mb-10 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                AI-Powered Resume Matching
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
                Match Your CV to
                <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent"> Any Job</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Upload your resume, paste the job description, and get a detailed ATS-score analysis with tailored improvements in seconds.
              </p>
            </div>
          )}

          {/* Form / Result */}
          <div className="glass-card p-6 sm:p-8 animate-fade-in">
            {result ? (
              <ResultDashboard result={result} provider={usedProvider} onReset={handleReset} />
            ) : (
              <UploadForm onAnalyze={handleAnalyze} loading={loading} />
            )}
          </div>

          {/* Error toast */}
          {error && (
            <div id="error-toast" className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 animate-slide-up">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-red-300 text-sm">Analysis failed</p>
                <p className="text-red-400/80 text-sm mt-0.5">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-8 text-xs text-gray-600 border-t border-white/5">
          AI CV Analyzer &mdash; OpenAI · Anthropic · Google · Groq · Mistral
        </footer>
      </div>
    </div>
  )
}
