import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Copy, DollarSign, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

export type ProposalStatus = 'Draft' | 'Sent' | 'Viewed' | 'Accepted' | 'Rejected'

export interface Proposal {
  id: string
  title: string
  client: string
  status: ProposalStatus
  date: string
  value: number
}

const statusStyles: Record<ProposalStatus, string> = {
  Draft:    'bg-slate-100 text-slate-500',
  Sent:     'bg-blue-50 text-blue-600',
  Viewed:   'bg-violet-50 text-violet-600',
  Accepted: 'bg-emerald-50 text-emerald-600',
  Rejected: 'bg-red-50 text-red-500',
}

const statusDot: Record<ProposalStatus, string> = {
  Draft:    'bg-slate-400',
  Sent:     'bg-blue-500',
  Viewed:   'bg-violet-500',
  Accepted: 'bg-emerald-500',
  Rejected: 'bg-red-400',
}

interface ProposalCardProps {
  proposal: Proposal
  onDelete?: (id: string) => void
  onDuplicate?: (id: string) => void
  onRename?: (id: string, newTitle: string) => void
}

export default function ProposalCard({ proposal, onDelete, onDuplicate, onRename }: ProposalCardProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [renaming, setRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState(proposal.title)
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync rename field when title prop changes (e.g. after rename from parent)
  useEffect(() => {
    setRenameValue(proposal.title)
  }, [proposal.title])

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  // Auto-focus rename input
  useEffect(() => {
    if (renaming) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [renaming])

  const submitRename = () => {
    const trimmed = renameValue.trim()
    if (trimmed && trimmed !== proposal.title) {
      onRename?.(proposal.id, trimmed)
    } else {
      setRenameValue(proposal.title)
    }
    setRenaming(false)
  }

  const handleCardClick = () => {
    if (renaming || menuOpen) return
    navigate(`/proposals/${proposal.id}`)
  }

  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(proposal.value)

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        {/* Title or inline rename input */}
        {renaming ? (
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={submitRename}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitRename()
              if (e.key === 'Escape') { setRenameValue(proposal.title); setRenaming(false) }
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 text-sm font-semibold text-slate-900 border border-indigo-300 rounded px-2 py-0.5 outline-none focus:ring-1 focus:ring-indigo-400"
          />
        ) : (
          <h3 className="flex-1 text-slate-900 font-semibold text-sm leading-snug group-hover:text-indigo-600 transition-colors">
            {proposal.title}
          </h3>
        )}

        <div className="flex items-center gap-1 shrink-0">
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${statusStyles[proposal.status]}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusDot[proposal.status]}`} />
            {proposal.status}
          </span>

          {/* Actions menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((prev) => !prev) }}
              className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => { setMenuOpen(false); setRenaming(true) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Pencil size={13} /> Rename
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDuplicate?.(proposal.id) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Copy size={13} /> Duplicate
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => { setMenuOpen(false); onDelete?.(proposal.id) }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Client */}
      <p className="text-slate-400 text-sm mb-5">
        {proposal.client || <span className="italic">No client name</span>}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="flex items-center gap-1.5 text-slate-400 text-xs">
          <Calendar size={12} />
          {proposal.date}
        </span>
        <span className="flex items-center gap-1 text-slate-800 font-semibold text-sm">
          <DollarSign size={13} className="text-slate-400" />
          {formatted.replace('$', '')}
        </span>
      </div>
    </div>
  )
}
