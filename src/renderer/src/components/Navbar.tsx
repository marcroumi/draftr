import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="h-14 bg-[#0b1d3a] flex items-center justify-between px-6 shrink-0 border-b border-white/10">
      <div className="flex items-center gap-2">
        <span className="text-white text-lg font-bold tracking-tight">Draftr</span>
        <span className="text-white/20 text-xs mt-0.5 font-medium">BETA</span>
      </div>
      <button
        onClick={() => navigate('/proposals/new')}
        className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors"
      >
        <Plus size={15} strokeWidth={2.5} />
        New Proposal
      </button>
    </header>
  )
}
