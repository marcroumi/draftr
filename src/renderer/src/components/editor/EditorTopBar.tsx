import { ArrowLeft, Save, Eye, FileDown, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface EditorTopBarProps {
  title: string
  onTitleChange: (title: string) => void
  onSave: () => void
  onPreview: () => void
  onExport: () => void
  saved: boolean
  exporting?: boolean
}

export default function EditorTopBar({
  title,
  onTitleChange,
  onSave,
  onPreview,
  onExport,
  saved,
  exporting = false,
}: EditorTopBarProps) {
  const navigate = useNavigate()

  return (
    <header className="h-14 bg-[#0b1d3a] flex items-center justify-between px-4 shrink-0 border-b border-white/10">
      {/* Left: back + logo */}
      <div className="flex items-center gap-3 w-48">
        <button
          onClick={() => navigate('/')}
          className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          title="Back to Dashboard"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-white/20">|</span>
        <span className="text-white font-bold tracking-tight text-base">Draftr</span>
      </div>

      {/* Center: editable title */}
      <input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="bg-white/10 text-white placeholder-white/30 text-sm font-medium text-center rounded-lg px-4 py-1.5 w-80 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-white/15 transition-colors"
        placeholder="Untitled Proposal"
      />

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 w-48 justify-end">
        <span className="text-white/25 text-xs mr-1">{saved ? 'Saved' : 'Unsaved'}</span>
        <button
          onClick={onPreview}
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Eye size={14} />
          Preview
        </button>
        <button
          onClick={onExport}
          disabled={exporting}
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {exporting ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
          {exporting ? 'Exporting…' : 'PDF'}
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors ml-1"
        >
          <Save size={14} />
          Save
        </button>
      </div>
    </header>
  )
}
