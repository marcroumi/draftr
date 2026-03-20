import { useState } from 'react'
import { LayoutList, Palette } from 'lucide-react'
import SectionList from './SectionList'
import ThemesPanel from './ThemesPanel'
import { Section } from '../../pages/ProposalEditor'
import { FontSize } from '../../data/themes'

interface LeftPanelProps {
  // Section props
  sections: Section[]
  activeSectionId: string
  onSectionClick: (id: string) => void
  onReorder: (sections: Section[]) => void
  // Theme props
  activeThemeId: string
  onThemeSelect: (id: string) => void
  fontSize: FontSize
  onFontSizeChange: (size: FontSize) => void
}

type Tab = 'sections' | 'design'

export default function LeftPanel({
  sections,
  activeSectionId,
  onSectionClick,
  onReorder,
  activeThemeId,
  onThemeSelect,
  fontSize,
  onFontSizeChange,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('sections')

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
      {/* Tab switcher */}
      <div className="flex shrink-0 border-b border-slate-200">
        {([
          { key: 'sections', label: 'Sections', Icon: LayoutList },
          { key: 'design', label: 'Design', Icon: Palette },
        ] as { key: Tab; label: string; Icon: typeof LayoutList }[]).map(
          ({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 flex-1 justify-center py-2.5 text-xs font-medium transition-colors border-b-2 ${
                activeTab === key
                  ? 'text-indigo-600 border-indigo-500 bg-indigo-50/40'
                  : 'text-slate-400 border-transparent hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          )
        )}
      </div>

      {/* Tab content fills remaining height */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {activeTab === 'sections' ? (
          <SectionList
            sections={sections}
            activeSectionId={activeSectionId}
            onSectionClick={onSectionClick}
            onReorder={onReorder}
          />
        ) : (
          <ThemesPanel
            activeThemeId={activeThemeId}
            onThemeSelect={onThemeSelect}
            fontSize={fontSize}
            onFontSizeChange={onFontSizeChange}
          />
        )}
      </div>
    </aside>
  )
}
