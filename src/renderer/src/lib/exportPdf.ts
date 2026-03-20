import { Section } from '../pages/ProposalEditor'
import { Theme, FontSize, fontSizeMap } from '../data/themes'
import { parsePricingData } from '../components/editor/PricingEditor'

// Map theme ID → Google Fonts family params for @import
const THEME_FONTS: Record<string, string> = {
  modern:    'Inter:wght@400;500;600;700',
  classic:   'Playfair+Display:ital,wght@0,400;0,700;1,400',
  minimal:   'DM+Sans:opsz,wght@9..40,400;9..40,600;9..40,700',
  corporate: 'Roboto:wght@400;500;700',
  bold:      'Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600',
  creative:  'Raleway:wght@400;600;700&family=Lato:wght@400;700',
}

function fmt(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function buildPricingHtml(content: string, theme: Theme): string {
  const data = parsePricingData(content)
  const subtotal = data.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0)
  const discountAmt = subtotal * (data.discount / 100)
  const taxAmt = (subtotal - discountAmt) * (data.tax / 100)
  const total = subtotal - discountAmt + taxAmt

  if (data.items.length === 0) {
    return '<p style="font-style:italic;color:#999">No pricing items added.</p>'
  }

  const rows = data.items.map((item) => `
    <tr>
      <td>
        <div class="item-name">${item.name || 'Untitled'}</div>
        ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}
      </td>
      <td class="qty">${item.quantity}</td>
      <td class="price">${fmt(item.unitPrice)}</td>
      <td class="price">${fmt(item.quantity * item.unitPrice)}</td>
    </tr>
  `).join('')

  const discountRow = data.discount > 0
    ? `<div class="summary-row discount"><span>Discount (${data.discount}%)</span><span>−${fmt(discountAmt)}</span></div>`
    : ''
  const taxRow = data.tax > 0
    ? `<div class="summary-row"><span>Tax (${data.tax}%)</span><span>+${fmt(taxAmt)}</span></div>`
    : ''

  return `
    <table class="pricing-table">
      <thead>
        <tr>
          <th style="text-align:left">Item</th>
          <th class="qty">Qty</th>
          <th class="price">Unit Price</th>
          <th class="price">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="pricing-summary">
      <div class="summary-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
      ${discountRow}
      ${taxRow}
      <div class="summary-row total"><span>Total</span><span>${fmt(total)}</span></div>
    </div>
  `
}

function buildSectionsHtml(sections: Section[], theme: Theme, baseFontSize: string): string {
  return sections.map((section) => {
    const isPricing = section.id === 'pricing'
    const isEmpty =
      !isPricing &&
      (!section.content ||
        section.content === '<p></p>' ||
        section.content.replace(/<[^>]*>/g, '').trim() === '')

    const contentHtml = isPricing
      ? buildPricingHtml(section.content, theme)
      : isEmpty
        ? '<p style="font-style:italic;color:#aaa">No content yet.</p>'
        : section.content

    return `
      <div class="section">
        <div class="section-label">${section.title}</div>
        <div class="section-body" style="font-size:${baseFontSize}">
          ${contentHtml}
        </div>
      </div>
    `
  }).join('')
}

function buildHtml(params: {
  sections: Section[]
  theme: Theme
  baseFontSize: string
  proposalTitle: string
  googleFontsFamily: string
}): string {
  const { sections, theme, baseFontSize, proposalTitle, googleFontsFamily } = params
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=${googleFontsFamily}&display=swap" rel="stylesheet" />
  <style>
    @page {
      size: A4;
      margin: 0;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    html, body {
      margin: 0;
      padding: 0;
      background: ${theme.bgColor};
      font-family: ${theme.bodyFont};
      color: ${theme.textColor};
      font-size: ${baseFontSize};
      line-height: 1.65;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── Cover header ── */
    .cover-header {
      background-color: ${theme.primaryColor};
      padding: 52px 60px 44px;
      page-break-after: avoid;
    }

    .cover-eyebrow {
      font-family: ${theme.headingFont};
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.45);
      margin: 0 0 14px 0;
    }

    .cover-title {
      font-family: ${theme.headingFont};
      font-size: 30px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 18px 0;
      line-height: 1.2;
    }

    .cover-meta {
      font-family: ${theme.bodyFont};
      font-size: 11px;
      color: rgba(255,255,255,0.55);
      margin: 0;
    }

    .accent-bar {
      background-color: ${theme.accentColor};
      height: 5px;
    }

    /* ── Content wrapper ── */
    .content {
      padding: 0 60px 48px;
      background-color: ${theme.bgColor};
    }

    /* ── Section ── */
    .section {
      padding: 28px 0;
      border-bottom: 1px solid ${theme.primaryColor}20;
      page-break-inside: avoid;
    }

    .section:last-child {
      border-bottom: none;
    }

    .section-label {
      font-family: ${theme.headingFont};
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: ${theme.accentColor};
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 2px solid ${theme.accentColor}30;
    }

    /* ── Typography inside sections ── */
    .section-body h1 {
      font-family: ${theme.headingFont};
      font-size: 20px;
      font-weight: 700;
      color: ${theme.primaryColor};
      margin: 0 0 12px;
      line-height: 1.25;
    }

    .section-body h2 {
      font-family: ${theme.headingFont};
      font-size: 15px;
      font-weight: 700;
      color: ${theme.primaryColor};
      margin: 0 0 10px;
    }

    .section-body h3 {
      font-family: ${theme.headingFont};
      font-size: 12.5px;
      font-weight: 600;
      color: ${theme.primaryColor};
      margin: 0 0 8px;
    }

    .section-body p {
      margin: 0 0 10px;
      line-height: 1.7;
    }

    .section-body p:last-child {
      margin-bottom: 0;
    }

    .section-body ul,
    .section-body ol {
      margin: 0 0 10px;
      padding-left: 22px;
    }

    .section-body li {
      margin-bottom: 6px;
      line-height: 1.6;
    }

    .section-body strong {
      font-weight: 700;
      color: ${theme.primaryColor};
    }

    .section-body em {
      font-style: italic;
    }

    /* ── Pricing ── */
    .pricing-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      font-size: 11px;
    }

    .pricing-table thead tr {
      background-color: ${theme.primaryColor};
    }

    .pricing-table th {
      font-family: ${theme.headingFont};
      font-size: 8.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #ffffff;
      padding: 7px 10px;
      text-align: left;
    }

    .pricing-table th.qty,
    .pricing-table th.price { text-align: right; }

    .pricing-table tbody tr:nth-child(even) {
      background-color: ${theme.primaryColor}07;
    }

    .pricing-table td {
      padding: 8px 10px;
      border-bottom: 1px solid ${theme.primaryColor}12;
      vertical-align: top;
    }

    .pricing-table td.qty,
    .pricing-table td.price {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    .item-name {
      font-family: ${theme.headingFont};
      font-weight: 600;
      color: ${theme.primaryColor};
      font-size: 11px;
    }

    .item-desc {
      font-size: 9.5px;
      color: ${theme.textColor}70;
      margin-top: 2px;
    }

    .pricing-summary {
      background-color: ${theme.primaryColor}0a;
      border: 1px solid ${theme.primaryColor}18;
      border-radius: 5px;
      padding: 10px 14px;
      max-width: 280px;
      margin-left: auto;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      padding: 3px 0;
      color: ${theme.textColor}80;
      font-variant-numeric: tabular-nums;
    }

    .summary-row.discount { color: #dc2626; }

    .summary-row.total {
      border-top: 1px solid ${theme.primaryColor}28;
      margin-top: 6px;
      padding-top: 8px;
      font-family: ${theme.headingFont};
      font-weight: 700;
      font-size: 13px;
      color: ${theme.primaryColor};
    }
  </style>
</head>
<body>
  <!-- Cover -->
  <div class="cover-header">
    <p class="cover-eyebrow">Proposal Document</p>
    <h1 class="cover-title">${proposalTitle || 'Untitled Proposal'}</h1>
    <p class="cover-meta">Date: ${today}</p>
  </div>
  <div class="accent-bar"></div>

  <!-- All sections -->
  <div class="content">
    ${buildSectionsHtml(sections, theme, baseFontSize)}
  </div>
</body>
</html>`
}

export async function exportToPdf(params: {
  sections: Section[]
  theme: Theme
  fontSize: FontSize
  proposalTitle: string
}): Promise<{ success: boolean; error?: string }> {
  const { sections, theme, fontSize, proposalTitle } = params
  const baseFontSize = fontSizeMap[fontSize]
  const googleFontsFamily = THEME_FONTS[theme.id] ?? 'Inter:wght@400;500;600;700'

  const html = buildHtml({ sections, theme, baseFontSize, proposalTitle, googleFontsFamily })

  // Sanitize filename: keep alphanumerics, spaces, hyphens
  const filename = proposalTitle.replace(/[^\w\s-]/g, '').trim() || 'Proposal'

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (window as any).api.exportPdf(html, filename)
    return result ?? { success: false }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
