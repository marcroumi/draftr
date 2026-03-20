import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Editor } from '@tiptap/react'
import { Sparkles, X, Loader2, AlertCircle } from 'lucide-react'
import { generateSectionContent, ProjectType } from '../../lib/anthropic'

const PROJECT_TYPES: ProjectType[] = [
  'Web Design',
  'Marketing',
  'Consulting',
  'Development',
  'Other',
]

const CONTEXT_KEY = 'draftr_ai_context'

interface AIGenerateModalProps {
  isOpen: boolean
  onClose: () => void
  sectionId: string
  sectionTitle: string
  editor: Editor
  onChange: (html: string) => void
}

export default function AIGenerateModal({
  isOpen,
  onClose,
  sectionId,
  sectionTitle,
  editor,
  onChange,
}: AIGenerateModalProps) {
  const navigate = useNavigate()
  const [clientName, setClientName] = useState('')
  const [projectType, setProjectType] = useState<ProjectType>('Web Design')
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Restore last-used context
  useEffect(() => {
    if (!isOpen) return
    try {
      const saved = JSON.parse(localStorage.getItem(CONTEXT_KEY) || '{}')
      if (saved.clientName) setClientName(saved.clientName)
      if (saved.projectType) setProjectType(saved.projectType)
      if (saved.description) setDescription(saved.description)
    } catch {}
    setError(null)
  }, [isOpen])

  if (!isOpen) return null

  const apiKey = localStorage.getItem('draftr_anthropic_key') ?? ''
  const hasKey = apiKey.trim().length > 0

  const handleGenerate = async () => {
    if (!hasKey) {
      setError('No API key found. Go to Settings to add your Anthropic API key.')
      return
    }
    if (!clientName.trim() || !description.trim()) {
      setError('Please fill in the client name and project description.')
      return
    }

    // Persist context for next time
    localStorage.setItem(CONTEXT_KEY, JSON.stringify({ clientName, projectType, description }))

    setIsGenerating(true)
    setError(null)

    try {
      const html = await generateSectionContent({
        apiKey,
        sectionId,
        sectionTitle,
        clientName: clientName.trim(),
        projectType,
        description: description.trim(),
      })
      editor.commands.setContent(html)
      onChange(editor.getHTML())
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onKeyDown={handleKeyDown}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isGenerating && onClose()}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[440px] max-w-[calc(100vw-2rem)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">AI Generate</h3>
              <p className="text-xs text-slate-400">{sectionTitle}</p>
            </div>
          </div>
          <button
            onClick={() => !isGenerating && onClose()}
            className="text-slate-300 hover:text-slate-500 transition-colors p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Client Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Client Name
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Acme Corporation"
              disabled={isGenerating}
              autoFocus
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors disabled:opacity-60"
            />
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
              disabled={isGenerating}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors bg-white disabled:opacity-60"
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
              Project Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the project goals and what the client needs…"
              rows={3}
              disabled={isGenerating}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors resize-none disabled:opacity-60"
            />
          </div>

          {/* No API key warning */}
          {!hasKey && !error && (
            <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
              <AlertCircle size={14} className="text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700">
                No API key set.{' '}
                <button
                  onClick={() => { onClose(); navigate('/settings') }}
                  className="underline font-semibold hover:text-amber-900"
                >
                  Go to Settings
                </button>
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
              <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Generating progress */}
          {isGenerating && (
            <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-2.5">
              <Loader2 size={14} className="text-indigo-500 animate-spin shrink-0" />
              <p className="text-xs text-indigo-600 font-medium">
                Generating {sectionTitle} content…
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-400">
            Powered by <span className="font-medium">Claude Haiku</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !hasKey}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 rounded-lg transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
