import { useNavigate } from 'react-router-dom'
import { ArrowRight, Palette, TrendingUp, Briefcase, Code2, Home, Scale, CalendarDays, Cpu, Users, BarChart3 } from 'lucide-react'
import { templates, ProposalTemplate } from '../data/templates'

const CATEGORY_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  'Design':                { bg: 'bg-violet-50',  text: 'text-violet-700',  dot: 'bg-violet-400' },
  'Marketing':             { bg: 'bg-orange-50',  text: 'text-orange-700',  dot: 'bg-orange-400' },
  'Consulting':            { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400'   },
  'Development':           { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400'},
  'Professional Services': { bg: 'bg-slate-100',  text: 'text-slate-700',   dot: 'bg-slate-400'  },
  'Events':                { bg: 'bg-pink-50',    text: 'text-pink-700',    dot: 'bg-pink-400'   },
  'Technology':            { bg: 'bg-indigo-50',  text: 'text-indigo-700',  dot: 'bg-indigo-400' },
  'Finance':               { bg: 'bg-teal-50',    text: 'text-teal-700',    dot: 'bg-teal-400'   },
}

const TEMPLATE_ICONS: Record<string, React.ElementType> = {
  'web-design-agency':     Palette,
  'marketing-campaign':    TrendingUp,
  'business-consulting':   Briefcase,
  'freelance-development': Code2,
  'architecture-interior': Home,
  'legal-services':        Scale,
  'event-planning':        CalendarDays,
  'saas-product-pitch':    Cpu,
  'hr-consulting':         Users,
  'financial-advisory':    BarChart3,
}

const ICON_GRADIENTS: Record<string, string> = {
  'web-design-agency':     'from-violet-500 to-purple-600',
  'marketing-campaign':    'from-orange-400 to-red-500',
  'business-consulting':   'from-blue-500 to-indigo-600',
  'freelance-development': 'from-emerald-500 to-teal-600',
  'architecture-interior': 'from-amber-400 to-orange-500',
  'legal-services':        'from-slate-500 to-slate-700',
  'event-planning':        'from-pink-500 to-rose-600',
  'saas-product-pitch':    'from-indigo-500 to-blue-600',
  'hr-consulting':         'from-sky-500 to-blue-600',
  'financial-advisory':    'from-teal-500 to-emerald-600',
}

interface TemplateCardProps {
  template: ProposalTemplate
  onUse: () => void
}

function TemplateCard({ template, onUse }: TemplateCardProps) {
  const catStyle = CATEGORY_STYLES[template.category] ?? CATEGORY_STYLES['Consulting']
  const Icon = TEMPLATE_ICONS[template.id] ?? Briefcase
  const gradient = ICON_GRADIENTS[template.id] ?? 'from-indigo-500 to-purple-600'

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4 hover:border-slate-300 hover:shadow-md transition-all group">
      {/* Icon + category */}
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
          <Icon size={20} className="text-white" strokeWidth={1.75} />
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${catStyle.bg} ${catStyle.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
          {template.category}
        </span>
      </div>

      {/* Name + description */}
      <div className="flex-1">
        <h3 className="text-slate-900 font-semibold text-sm mb-1">{template.name}</h3>
        <p className="text-slate-400 text-xs leading-relaxed">{template.description}</p>
      </div>

      {/* Sections preview */}
      <div className="flex flex-wrap gap-1">
        {['Cover', 'Summary', 'Scope', 'Pricing', 'Terms'].map((s) => (
          <span key={s} className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
            {s}
          </span>
        ))}
        <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
          +3 more
        </span>
      </div>

      {/* Use Template button */}
      <button
        onClick={onUse}
        className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group-hover:bg-indigo-100"
      >
        Use Template
        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  )
}

export default function Templates() {
  const navigate = useNavigate()

  const handleUseTemplate = (template: ProposalTemplate) => {
    navigate('/proposals/new', {
      state: {
        title: template.editorTitle,
        sections: template.sections,
      },
    })
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-slate-900 text-xl font-semibold mb-1">Templates</h2>
        <p className="text-slate-400 text-sm">
          Start from a pre-built template — all 8 sections pre-filled with professional placeholder copy.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onUse={() => handleUseTemplate(template)}
          />
        ))}
      </div>
    </div>
  )
}
