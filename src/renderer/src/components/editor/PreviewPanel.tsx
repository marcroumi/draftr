import { Theme, FontSize, fontSizeMap } from '../../data/themes'
import { Section } from '../../pages/ProposalEditor'
import { parsePricingData, PricingData } from './PricingEditor'

interface PreviewPanelProps {
  sections: Section[]
  activeSectionId: string
  proposalTitle: string
  theme: Theme
  fontSize: FontSize
}

function fmtShort(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function PricingPreview({ data, theme, baseFontSize }: { data: PricingData; theme: Theme; baseFontSize: string }) {
  const subtotal = data.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0)
  const discountAmt = subtotal * (data.discount / 100)
  const taxAmt = (subtotal - discountAmt) * (data.tax / 100)
  const total = subtotal - discountAmt + taxAmt

  if (data.items.length === 0) {
    return (
      <p className="italic" style={{ color: `${theme.textColor}40`, fontSize: baseFontSize }}>
        No items added yet
      </p>
    )
  }

  return (
    <div style={{ fontSize: baseFontSize, fontFamily: theme.bodyFont, color: theme.textColor }}>
      {/* Line items */}
      <div className="space-y-1 mb-2">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between gap-1"
            style={{ paddingBottom: '2px', borderBottom: `1px solid ${theme.primaryColor}12` }}
          >
            <div className="min-w-0">
              <span
                className="block truncate font-semibold"
                style={{ fontFamily: theme.headingFont, color: theme.primaryColor }}
              >
                {item.name || 'Untitled'}
              </span>
              {item.description && (
                <span
                  className="block truncate"
                  style={{ color: `${theme.textColor}60`, fontSize: '0.6rem' }}
                >
                  {item.description}
                </span>
              )}
            </div>
            <span className="shrink-0 tabular-nums">{fmtShort(item.quantity * item.unitPrice)}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        className="rounded mt-2 p-1.5 space-y-0.5"
        style={{ backgroundColor: `${theme.primaryColor}08` }}
      >
        <div className="flex justify-between" style={{ color: `${theme.textColor}80` }}>
          <span>Subtotal</span>
          <span className="tabular-nums">{fmtShort(subtotal)}</span>
        </div>
        {data.discount > 0 && (
          <div className="flex justify-between" style={{ color: '#ef4444' }}>
            <span>Discount ({data.discount}%)</span>
            <span className="tabular-nums">−{fmtShort(discountAmt)}</span>
          </div>
        )}
        {data.tax > 0 && (
          <div className="flex justify-between" style={{ color: `${theme.textColor}80` }}>
            <span>Tax ({data.tax}%)</span>
            <span className="tabular-nums">+{fmtShort(taxAmt)}</span>
          </div>
        )}
        <div
          className="flex justify-between pt-1 mt-0.5 font-bold"
          style={{
            borderTop: `1px solid ${theme.primaryColor}25`,
            fontFamily: theme.headingFont,
            color: theme.primaryColor,
          }}
        >
          <span>Total</span>
          <span className="tabular-nums">{fmtShort(total)}</span>
        </div>
      </div>
    </div>
  )
}

export default function PreviewPanel({
  sections,
  activeSectionId,
  proposalTitle,
  theme,
  fontSize,
}: PreviewPanelProps) {
  const baseFontSize = fontSizeMap[fontSize]

  return (
    <aside className="w-72 bg-slate-100 border-l border-slate-200 flex flex-col shrink-0">
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Live Preview
        </p>
        <span
          className="text-xs font-medium px-1.5 py-0.5 rounded"
          style={{
            backgroundColor: `${theme.primaryColor}18`,
            color: theme.primaryColor,
            fontFamily: theme.headingFont,
          }}
        >
          {theme.name}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div
          className="rounded-lg shadow-sm overflow-hidden border"
          style={{ borderColor: `${theme.primaryColor}30` }}
        >
          {/* Document cover — themed */}
          <div className="px-4 py-4" style={{ backgroundColor: theme.primaryColor }}>
            <p
              className="font-bold text-sm truncate"
              style={{ color: '#ffffff', fontFamily: theme.headingFont }}
            >
              {proposalTitle || 'Untitled Proposal'}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: theme.bodyFont }}
            >
              Proposal Document
            </p>
          </div>
          <div className="h-1" style={{ backgroundColor: theme.accentColor }} />

          {/* Sections */}
          <div style={{ backgroundColor: theme.bgColor }}>
            {sections.map((section) => {
              const Icon = section.Icon
              const isActive = section.id === activeSectionId
              const isPricing = section.id === 'pricing'

              const isEmpty =
                !isPricing &&
                (!section.content ||
                  section.content === '<p></p>' ||
                  section.content.replace(/<[^>]*>/g, '').trim() === '')

              return (
                <div
                  key={section.id}
                  className="px-3 py-2.5 transition-colors"
                  style={{
                    borderBottom: `1px solid ${theme.primaryColor}12`,
                    borderLeft: isActive
                      ? `3px solid ${theme.accentColor}`
                      : '3px solid transparent',
                    backgroundColor: isActive ? `${theme.accentColor}0e` : 'transparent',
                  }}
                >
                  {/* Section label */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon
                      size={10}
                      style={{ color: isActive ? theme.accentColor : `${theme.textColor}55` }}
                    />
                    <p
                      className="text-xs font-semibold uppercase tracking-wide"
                      style={{
                        color: isActive ? theme.accentColor : `${theme.textColor}66`,
                        fontFamily: theme.headingFont,
                      }}
                    >
                      {section.title}
                    </p>
                  </div>

                  {/* Section content */}
                  {isPricing ? (
                    <PricingPreview
                      data={parsePricingData(section.content)}
                      theme={theme}
                      baseFontSize={baseFontSize}
                    />
                  ) : isEmpty ? (
                    <p
                      className="italic"
                      style={{ color: `${theme.textColor}40`, fontSize: baseFontSize }}
                    >
                      No content yet
                    </p>
                  ) : (
                    <div
                      className="preview-content leading-relaxed"
                      style={{
                        fontSize: baseFontSize,
                        fontFamily: theme.bodyFont,
                        color: theme.textColor,
                      }}
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </aside>
  )
}
