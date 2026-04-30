import { useState, useCallback } from 'react'
import ProviderSelector from './ProviderSelector'

export default function UploadForm({ onAnalyze, loading }) {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [provider, setProvider] = useState('openai')
  const [dragging, setDragging] = useState(false)

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    if (f && f.type === 'application/pdf') setFile(f)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type === 'application/pdf') setFile(f)
  }, [])

  const handleDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = () => setDragging(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file || !jobDescription.trim()) return
    onAnalyze({ file, jobDescription, provider })
  }

  const isReady = file && jobDescription.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Provider Selector */}
      <ProviderSelector selected={provider} onChange={setProvider} />

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          📄 CV / Resume (PDF)
        </label>
        <div
          id="cv-drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
            ${dragging
              ? 'border-brand-500 bg-brand-500/10 scale-[1.02]'
              : file
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-white/20 bg-white/3 hover:border-white/40 hover:bg-white/5'
            }`}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          {file ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-semibold text-emerald-400">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB — Click to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-1">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <p className="text-gray-300 font-medium">Drop your PDF here or click to browse</p>
              <p className="text-xs text-gray-500">Only PDF files are supported</p>
            </div>
          )}
        </div>
      </div>

      {/* Job Description */}
      <div>
        <label htmlFor="job-description" className="block text-sm font-semibold text-gray-300 mb-3">
          💼 Job Description
        </label>
        <textarea
          id="job-description"
          rows={8}
          placeholder="Paste the full job description here…"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="input-field resize-none leading-relaxed"
        />
        <p className="text-xs text-gray-600 mt-1 text-right">{jobDescription.length} characters</p>
      </div>

      {/* Submit */}
      <button
        id="analyze-btn"
        type="submit"
        disabled={!isReady || loading}
        className="btn-primary w-full flex items-center justify-center gap-2 text-base py-4"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing…
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Analyze CV
          </>
        )}
      </button>
    </form>
  )
}
