export type ProjectType = 'Web Design' | 'Marketing' | 'Consulting' | 'Development' | 'Other'

export interface GenerateParams {
  apiKey: string
  sectionId: string
  sectionTitle: string
  clientName: string
  projectType: ProjectType
  description: string
}

// Per-section generation guidance sent to the model
const SECTION_GUIDANCE: Record<string, string> = {
  cover: 'Write a compelling cover page. Use an h1 for the proposal title (include the client name), then a short value proposition paragraph (2-3 sentences), then the preparer context as a paragraph.',
  summary: 'Write a 3-paragraph executive summary. Paragraph 1: the client challenge/opportunity. Paragraph 2: the proposed approach. Paragraph 3: expected outcomes and ROI. Persuasive, professional, concise.',
  scope: 'Write a Scope of Work section. Start with an h2 heading and a brief intro paragraph, then a ul with 6-7 specific, actionable bullet points covering all key work areas for this project type.',
  deliverables: 'Write a Deliverables section with an h2 heading, a short intro paragraph, then a ul with 5-6 concrete deliverables the client will receive. Each li should have a bold deliverable name followed by a brief description.',
  timeline: 'Write a project Timeline. Start with an h2 and a one-sentence intro (e.g. "Estimated duration: X weeks"). Then a ul with 4-5 phases — each li has a bold phase label with week range (e.g. "Week 1–2: Discovery") followed by a brief description.',
  terms: 'Write professional Terms & Conditions with an h2 heading and a ul of 5-6 bullet points covering: payment terms, revision rounds, IP ownership, confidentiality, and termination. Clear, standard business language.',
  signature: 'Write an Acceptance section with an h2 heading, an acceptance paragraph, then signature lines as paragraphs: "Client Signature: ________________  Date: ________", "Printed Name: ________________", a blank line, and "Authorized By: ________________  Date: ________".',
}

export async function generateSectionContent(params: GenerateParams): Promise<string> {
  const { apiKey, sectionId, sectionTitle, clientName, projectType, description } = params

  const guidance =
    SECTION_GUIDANCE[sectionId] ??
    `Write professional content for the "${sectionTitle}" section of a ${projectType} business proposal.`

  const userPrompt = `You are writing the "${sectionTitle}" section for a professional ${projectType} proposal.

Client: ${clientName}
Project: ${description}

Instructions: ${guidance}

Rules:
- Output ONLY semantic HTML using: h1, h2, h3, p, ul, li, strong, em
- No CSS, no class attributes, no scripts, no markdown, no prose explanation
- Begin directly with the HTML, do not wrap in \`\`\`html blocks
- Keep content professional, specific, and tailored to the client and project`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error(errData?.error?.message ?? `API error ${response.status}`)
  }

  const data = await response.json()
  const text: string = data.content?.[0]?.text ?? ''

  // Strip accidental markdown code fences
  return text.replace(/^```html\s*/i, '').replace(/\s*```$/, '').trim()
}
