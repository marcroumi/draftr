import { Check } from 'lucide-react'
import { themes, Theme, FontSize } from '../../data/themes'

function ThemeCard({
  theme,
  isActive,
  onClick,
}: {
  theme: Theme
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left rounded-lg overflow-hidden transition-all ${
        isActive
          ? 'ring-2 ring-indigo-500 ring-offset-1 shadow-sm'
          : 'ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow-sm'
      }`}
    >
      {/* Active checkmark badge */}
      {isActive && (
        <span className="absolute top-1 right-1 z-10 bg-indigo-500 rounded-full w-4 h-4 flex items-center justify-center shadow">
          <Check size={9} className="text-white" strokeWidth={3} />
        </span>
      )}

      {/* Header strip — primary color */}
      <div
        className="h-9 flex items-end px-2 pb-1.5"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <span
          className="text-white text-base leading-none"
          style={{ fontFamily: theme.headingFont }}
        >
          Aa
        </span>
      </div>

      {/* Document preview body */}
      <div className="px-2 pt-2 pb-1.5" style={{ backgroundColor: theme.bgColor }}>
        {/* Heading line */}
        <div
          className="h-1 rounded-sm mb-1.5"
          style={{ backgroundColor: theme.primaryColor, width: '70%' }}
        />
        {/* Body lines */}
        <div
          className="h-0.5 rounded-sm mb-1 opacity-35"
          style={{ backgroundColor: theme.textColor, width: '95%' }}
        />
        <div
          className="h-0.5 rounded-sm mb-2 opacity-35"
          style={{ backgroundColor: theme.textColor, width: '80%' }}
        />
        {/* Color swatches */}
        <div className="flex gap-0.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: theme.primaryColor }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: theme.accentColor }}
          />
          <div
            className="w-3 h-3 rounded-full opacity-50"
            style={{ backgroundColor: theme.textColor }}
          />
        </div>
      </div>

      {/* Theme name footer */}
      <div
        className="px-2 py-1 border-t"
        style={{
          backgroundColor: theme.bgColor,
          borderColor: `${theme.primaryColor}22`,
        }}
      >
        <span
          className="text-xs font-semibold block text-center truncate"
          style={{ color: theme.primaryColor, fontFamily: theme.headingFont }}
        >
          {theme.name}
        </span>
      </div>
    </button>
  )
}

interface ThemesPanelProps {
  activeThemeId: string
  onThemeSelect: (id: string) => void
  fontSize: FontSize
  onFontSizeChange: (size: FontSize) => void
}

const FONT_SIZES: { key: FontSize; label: string; abbr: string }[] = [
  { key: 'small', label: 'Small', abbr: 'S' },
  { key: 'medium', label: 'Medium', abbr: 'M' },
  { key: 'large', label: 'Large', abbr: 'L' },
]

export default function ThemesPanel({
  activeThemeId,
  onThemeSelect,
  fontSize,
  onFontSizeChange,
}: ThemesPanelProps) {
  const activeTheme = themes.find((t) => t.id === activeThemeId)!
  const headingName = activeTheme.headingFont.split(',')[0].replace(/'/g, '').trim()
  const bodyName = activeTheme.bodyFont.split(',')[0].replace(/'/g, '').trim()

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Theme grid */}
      <div className="p-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
          Theme
        </p>
        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <ThemeCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === activeThemeId}
              onClick={() => onThemeSelect(theme.id)}
            />
          ))}
        </div>
      </div>

      {/* Font size selector */}
      <div className="px-3 pt-3 pb-3 border-t border-slate-100">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Font Size
        </p>
        <div className="flex rounded-lg overflow-hidden border border-slate-200">
          {FONT_SIZES.map(({ key, abbr }, i) => (
            <button
              key={key}
              onClick={() => onFontSizeChange(key)}
              className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
                i !== 0 ? 'border-l border-slate-200' : ''
              } ${
                fontSize === key
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {abbr}
            </button>
          ))}
        </div>
        <div className="flex mt-1">
          {FONT_SIZES.map(({ key, label }) => (
            <span
              key={key}
              className={`flex-1 text-center text-xs transition-colors ${
                fontSize === key ? 'text-indigo-500 font-medium' : 'text-slate-300'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Font pairing info */}
      <div className="px-3 pb-4 border-t border-slate-100 pt-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Font Pairing
        </p>
        <div className="bg-slate-50 rounded-lg p-2.5 space-y-2">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">Heading</p>
            <p
              className="text-sm font-semibold text-slate-800 truncate"
              style={{ fontFamily: activeTheme.headingFont }}
            >
              {headingName}
            </p>
          </div>
          <div className="border-t border-slate-200 pt-2">
            <p className="text-xs text-slate-400 mb-0.5">Body</p>
            <p
              className="text-xs text-slate-600 truncate"
              style={{ fontFamily: activeTheme.bodyFont }}
            >
              {bodyName}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
