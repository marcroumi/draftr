import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'
import ProposalCard, { Proposal, ProposalStatus } from '../components/ProposalCard'
import { dbDelete, dbDuplicate, dbList, dbRename, ProposalRow } from '../lib/db'
import { useToast } from '../lib/toast'

function rowToProposal(row: ProposalRow): Proposal {
  return {
    id: row.id,
    title: row.title,
    client: row.client_name,
    status: row.status as ProposalStatus,
    date: new Date(row.updated_at).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    }),
    value: row.value,
  }
}

function EmptyState() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-5 shadow-sm">
        <FileText size={30} className="text-slate-300" strokeWidth={1.25} />
      </div>
      <h3 className="text-slate-800 font-semibold text-lg mb-2">No proposals yet</h3>
      <p className="text-slate-400 text-sm mb-7 max-w-xs leading-relaxed">
        Create your first professional proposal or start from one of our ready-made templates.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/proposals/new')}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Proposal
        </button>
        <button
          onClick={() => navigate('/templates')}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-medium px-5 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
        >
          Browse Templates
        </button>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="h-4 bg-slate-100 rounded w-3/5" />
            <div className="h-6 bg-slate-100 rounded-full w-16" />
          </div>
          <div className="h-3 bg-slate-100 rounded w-2/5 mb-5" />
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
            <div className="h-3 bg-slate-100 rounded w-24" />
            <div className="h-3 bg-slate-100 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dbList().then((rows) => {
      setProposals(rows.map(rowToProposal))
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string) => {
    await dbDelete(id)
    setProposals((prev) => prev.filter((p) => p.id !== id))
    toast.success('Proposal deleted')
  }

  const handleDuplicate = async (id: string) => {
    await dbDuplicate(id)
    const rows = await dbList()
    setProposals(rows.map(rowToProposal))
    toast.success('Proposal duplicated')
  }

  const handleRename = async (id: string, newTitle: string) => {
    await dbRename(id, newTitle)
    setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p)))
  }

  const totalValue = proposals.reduce((sum, p) => sum + p.value, 0)

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h2 className="text-slate-900 text-xl font-semibold mb-1">All Proposals</h2>
        <p className="text-slate-400 text-sm">
          {loading ? 'Loading…' : (
            <>
              {proposals.length} proposal{proposals.length !== 1 ? 's' : ''} &middot;{' '}
              {new Intl.NumberFormat('en-US', {
                style: 'currency', currency: 'USD', maximumFractionDigits: 0,
              }).format(totalValue)}{' '}
              total value
            </>
          )}
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Proposals', value: proposals.length },
          {
            label: 'Pending Review',
            value: proposals.filter((p) => p.status === 'Sent' || p.status === 'Viewed').length,
          },
          {
            label: 'Won',
            value: proposals.filter((p) => p.status === 'Accepted').length,
          },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">{label}</p>
            <p className="text-slate-900 text-2xl font-bold">{loading ? '—' : value}</p>
          </div>
        ))}
      </div>

      {/* Content area */}
      {loading ? (
        <LoadingSkeleton />
      ) : proposals.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {proposals.map((p) => (
            <ProposalCard
              key={p.id}
              proposal={p}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onRename={handleRename}
            />
          ))}
        </div>
      )}
    </div>
  )
}
