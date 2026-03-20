import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  FileText,
  AlignLeft,
  Target,
  CheckSquare,
  Calendar,
  DollarSign,
  Shield,
  PenLine,
  LucideIcon,
} from 'lucide-react'
import EditorTopBar from '../components/editor/EditorTopBar'
import LeftPanel from '../components/editor/LeftPanel'
import EditorCanvas from '../components/editor/EditorCanvas'
import PreviewPanel from '../components/editor/PreviewPanel'
import PricingEditor, { defaultPricingData, parsePricingData } from '../components/editor/PricingEditor'
import { themes, FontSize } from '../data/themes'
import { exportToPdf } from '../lib/exportPdf'
import { dbGet, dbUpsert } from '../lib/db'
import { useToast } from '../lib/toast'

export interface Section {
  id: string
  title: string
  Icon: LucideIcon
  content: string
}

const defaultSections: Section[] = [
  {
    id: 'cover',
    title: 'Cover Page',
    Icon: FileText,
    content: `<h1>Proposal for [Client Name]</h1><p>Prepared by [Your Name / Company]</p><p>Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>`,
  },
  {
    id: 'summary',
    title: 'Executive Summary',
    Icon: AlignLeft,
    content: `<p>We are excited to present this proposal for your consideration. Our approach combines industry-leading expertise with a deep understanding of your unique needs to deliver exceptional results.</p><p>This document outlines our recommended solution, the scope of work, timeline, and investment required to achieve your goals.</p>`,
  },
  {
    id: 'scope',
    title: 'Scope of Work',
    Icon: Target,
    content: `<h2>Project Scope</h2><p>This engagement encompasses the following areas of work:</p><ul><li>Discovery and requirements gathering</li><li>Strategy and planning</li><li>Design and development</li><li>Testing and quality assurance</li><li>Launch and deployment</li></ul>`,
  },
  {
    id: 'deliverables',
    title: 'Deliverables',
    Icon: CheckSquare,
    content: `<h2>Deliverables</h2><p>Upon completion of this project, you will receive:</p><ul><li>Fully functional product ready for use</li><li>Source code and all project assets</li><li>Documentation and user guides</li><li>30-day post-launch support</li></ul>`,
  },
  {
    id: 'timeline',
    title: 'Timeline',
    Icon: Calendar,
    content: `<h2>Project Timeline</h2><p>Estimated duration: <strong>8 weeks</strong></p><ul><li><strong>Week 1–2:</strong> Discovery &amp; Planning</li><li><strong>Week 3–4:</strong> Design &amp; Prototyping</li><li><strong>Week 5–7:</strong> Development &amp; Testing</li><li><strong>Week 8:</strong> Launch &amp; Handover</li></ul>`,
  },
  {
    id: 'pricing',
    title: 'Pricing Table',
    Icon: DollarSign,
    content: JSON.stringify(defaultPricingData),
  },
  {
    id: 'terms',
    title: 'Terms & Conditions',
    Icon: Shield,
    content: `<h2>Terms &amp; Conditions</h2><ul><li>Payment is due within 30 days of invoice.</li><li>Revisions are limited to 2 rounds per phase.</li><li>Client is responsible for providing all required content and assets.</li><li>Intellectual property transfers to the client upon receipt of final payment.</li><li>Either party may terminate this agreement with 14 days written notice.</li></ul>`,
  },
  {
    id: 'signature',
    title: 'Signature',
    Icon: PenLine,
    content: `<h2>Acceptance</h2><p>By signing below, both parties agree to the terms and conditions outlined in this proposal.</p><p>&nbsp;</p><p>Client Signature: ____________________________&nbsp;&nbsp;&nbsp; Date: ____________</p><p>&nbsp;</p><p>Client Name (Print): __________________________</p><p>&nbsp;</p><p>Authorized By: _______________________________&nbsp;&nbsp;&nbsp; Date: ____________</p>`,
  },
]

function computeValue(sections: Section[]): number {
  const pricing = sections.find((s) => s.id === 'pricing')
  if (!pricing) return 0
  try {
    const data = parsePricingData(pricing.content)
    const subtotal = data.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0)
    const discountAmt = subtotal * (data.discount / 100)
    const taxAmt = (subtotal - discountAmt) * (data.tax / 100)
    return subtotal - discountAmt + taxAmt
  } catch {
    return 0
  }
}

function sectionsToJson(sections: Section[]): string {
  return JSON.stringify(sections.map((s) => ({ id: s.id, title: s.title, content: s.content })))
}

function sectionsFromJson(json: string): Section[] {
  const raw = JSON.parse(json) as Array<{ id: string; title: string; content: string }>
  return raw.map((s) => {
    const def = defaultSections.find((d) => d.id === s.id)
    return { id: s.id, title: s.title, Icon: def?.Icon ?? FileText, content: s.content }
  })
}

export default function ProposalEditor() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()

  const isNew = !id || id === 'new'
  const templateState = location.state as { title?: string; sections?: Record<string, string> } | null
  const { toast } = useToast()

  // Stable proposal ID for the lifetime of this component instance
  const proposalId = useRef(isNew ? crypto.randomUUID() : id!)
  const createdAt = useRef<number | null>(null)
  const hasSavedOnce = useRef(!isNew)

  const [title, setTitle] = useState(templateState?.title ?? 'New Proposal')
  const [sections, setSections] = useState<Section[]>(() =>
    templateState?.sections
      ? defaultSections.map((s) => ({ ...s, content: templateState.sections![s.id] ?? s.content }))
      : defaultSections
  )
  const [activeSectionId, setActiveSectionId] = useState(defaultSections[0].id)
  const [saved, setSaved] = useState(true)
  const [activeThemeId, setActiveThemeId] = useState(themes[0].id)
  const [fontSize, setFontSize] = useState<FontSize>('medium')
  const [exporting, setExporting] = useState(false)
  const [loadingProposal, setLoadingProposal] = useState(!isNew && !templateState)

  // Refs for stable access inside the auto-save interval closure
  const titleRef = useRef(title)
  const sectionsRef = useRef(sections)
  const activeThemeIdRef = useRef(activeThemeId)
  const fontSizeRef = useRef(fontSize)
  const savedRef = useRef(saved)

  useEffect(() => { titleRef.current = title }, [title])
  useEffect(() => { sectionsRef.current = sections }, [sections])
  useEffect(() => { activeThemeIdRef.current = activeThemeId }, [activeThemeId])
  useEffect(() => { fontSizeRef.current = fontSize }, [fontSize])
  useEffect(() => { savedRef.current = saved }, [saved])

  // Load existing proposal from DB on mount
  useEffect(() => {
    if (isNew || templateState) return
    dbGet(proposalId.current).then((row) => {
      if (!row) { navigate('/'); return }
      createdAt.current = row.created_at
      setTitle(row.title)
      setSections(sectionsFromJson(row.sections_json))
      setActiveThemeId(row.active_theme_id)
      setFontSize(row.font_size as FontSize)
      setLoadingProposal(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Auto-save every 30 seconds when there are unsaved changes
  useEffect(() => {
    const interval = setInterval(async () => {
      if (savedRef.current) return
      const now = Date.now()
      if (!createdAt.current) createdAt.current = now
      await dbUpsert({
        id: proposalId.current,
        title: titleRef.current,
        status: 'Draft',
        client_name: '',
        value: computeValue(sectionsRef.current),
        sections_json: sectionsToJson(sectionsRef.current),
        active_theme_id: activeThemeIdRef.current,
        font_size: fontSizeRef.current,
        created_at: createdAt.current,
        updated_at: now,
      })
      setSaved(true)
      if (!hasSavedOnce.current) {
        hasSavedOnce.current = true
        navigate(`/proposals/${proposalId.current}`, { replace: true })
      }
    }, 30000)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const activeSection = sections.find((s) => s.id === activeSectionId)!
  const activeTheme = themes.find((t) => t.id === activeThemeId)!

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    setSaved(false)
  }

  const handleContentChange = useCallback(
    (html: string) => {
      setSections((prev) =>
        prev.map((s) => (s.id === activeSectionId ? { ...s, content: html } : s))
      )
      setSaved(false)
    },
    [activeSectionId]
  )

  const handleReorder = (reordered: Section[]) => {
    setSections(reordered)
    setSaved(false)
  }

  const handleExport = async () => {
    if (exporting) return
    setExporting(true)
    const result = await exportToPdf({ sections, theme: activeTheme, fontSize, proposalTitle: title })
    setExporting(false)
    if (result.success) {
      toast.success('PDF exported successfully')
    } else if (result.error) {
      toast.error('Export failed — ' + result.error)
    }
  }

  const handleSave = async () => {
    const now = Date.now()
    if (!createdAt.current) createdAt.current = now
    await dbUpsert({
      id: proposalId.current,
      title,
      status: 'Draft',
      client_name: '',
      value: computeValue(sections),
      sections_json: sectionsToJson(sections),
      active_theme_id: activeThemeId,
      font_size: fontSize,
      created_at: createdAt.current,
      updated_at: now,
    })
    setSaved(true)
    toast.success('Proposal saved')
    if (!hasSavedOnce.current) {
      hasSavedOnce.current = true
      navigate(`/proposals/${proposalId.current}`, { replace: true })
    }
  }

  if (loadingProposal) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <p className="text-slate-400 text-sm">Loading proposal…</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden animate-page-enter">
      <EditorTopBar
        title={title}
        onTitleChange={handleTitleChange}
        onSave={handleSave}
        onPreview={() => {}}
        onExport={handleExport}
        exporting={exporting}
        saved={saved}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftPanel
          sections={sections}
          activeSectionId={activeSectionId}
          onSectionClick={setActiveSectionId}
          onReorder={handleReorder}
          activeThemeId={activeThemeId}
          onThemeSelect={setActiveThemeId}
          fontSize={fontSize}
          onFontSizeChange={setFontSize}
        />
        {activeSection.id === 'pricing' ? (
          <PricingEditor
            data={parsePricingData(activeSection.content)}
            onChange={(data) => handleContentChange(JSON.stringify(data))}
          />
        ) : (
          <EditorCanvas
            key={activeSectionId}
            sectionId={activeSectionId}
            sectionTitle={activeSection.title}
            content={activeSection.content}
            onChange={handleContentChange}
          />
        )}
        <PreviewPanel
          sections={sections}
          activeSectionId={activeSectionId}
          proposalTitle={title}
          theme={activeTheme}
          fontSize={fontSize}
        />
      </div>
    </div>
  )
}
