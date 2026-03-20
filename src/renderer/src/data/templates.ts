import { PricingData } from '../components/editor/PricingEditor'

export interface ProposalTemplate {
  id: string
  name: string
  category: string
  description: string
  editorTitle: string
  sections: Record<string, string> // sectionId → HTML (or JSON string for pricing)
}

function pricing(items: { name: string; description: string; unitPrice: number }[], discount = 0, tax = 0): string {
  const data: PricingData = {
    items: items.map((item, i) => ({
      id: String(i + 1),
      name: item.name,
      description: item.description,
      quantity: 1,
      unitPrice: item.unitPrice,
    })),
    discount,
    tax,
  }
  return JSON.stringify(data)
}

const TERMS = `<h2>Terms &amp; Conditions</h2><ul><li>Payment is due within 30 days of invoice.</li><li>Revisions are limited to 2 rounds per phase.</li><li>Client is responsible for providing all required content and assets.</li><li>Intellectual property transfers to the client upon receipt of final payment.</li><li>Either party may terminate this agreement with 14 days written notice.</li><li>This proposal is valid for 30 days from the date of issue.</li></ul>`

const SIGNATURE = `<h2>Acceptance</h2><p>By signing below, both parties agree to the terms and conditions outlined in this proposal.</p><p>&nbsp;</p><p>Client Signature: ____________________________&nbsp;&nbsp;&nbsp; Date: ____________</p><p>&nbsp;</p><p>Client Name (Print): __________________________</p><p>&nbsp;</p><p>Authorized By: _______________________________&nbsp;&nbsp;&nbsp; Date: ____________</p>`

const TODAY = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

export const templates: ProposalTemplate[] = [
  // ── 1. Web Design Agency ─────────────────────────────────────────────────
  {
    id: 'web-design-agency',
    name: 'Web Design Agency',
    category: 'Design',
    description: 'Full website redesign with UX strategy and brand identity.',
    editorTitle: 'Web Design Proposal',
    sections: {
      cover: `<h1>Web Design Proposal for [Client Name]</h1><p>A comprehensive website redesign to elevate your brand and convert more visitors.</p><p>Prepared by [Your Agency]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>[Client Name] needs a modern, high-converting website that reflects its brand and drives measurable results. Our agency specializes in strategy-first web design for growing businesses.</p><p>We propose a full redesign covering UX research, brand-aligned visual design, and front-end development — built to perform on every device and optimized for search engines from day one.</p><p>By launch, you'll have a site that generates qualified leads, communicates your value clearly, and scales with your business over time.</p>`,
      scope: `<h2>Scope of Work</h2><p>This engagement covers the complete redesign and development of your website:</p><ul><li>Discovery workshop and competitor analysis</li><li>Information architecture and user journey mapping</li><li>Responsive UI/UX design (up to 10 page templates)</li><li>Brand identity integration (colors, typography, imagery guidelines)</li><li>Front-end development (HTML, CSS, JavaScript)</li><li>CMS integration and content migration</li><li>SEO on-page optimization and performance tuning</li><li>Cross-browser and device testing</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>At project completion, you will receive:</p><ul><li><strong>Figma Design Files:</strong> All page designs in editable source format</li><li><strong>Live Website:</strong> Fully developed and deployed to your hosting environment</li><li><strong>CMS Training:</strong> 1-hour walkthrough so your team can manage content independently</li><li><strong>SEO Report:</strong> Baseline audit and on-page optimization documentation</li><li><strong>Style Guide:</strong> Colors, fonts, and component reference for future updates</li><li><strong>30-Day Support:</strong> Bug fixes and minor adjustments post-launch</li></ul>`,
      timeline: `<h2>Project Timeline</h2><p>Estimated duration: <strong>10 weeks</strong></p><ul><li><strong>Week 1–2:</strong> Discovery, research &amp; project kickoff</li><li><strong>Week 3–4:</strong> Wireframes &amp; information architecture</li><li><strong>Week 5–6:</strong> Visual design &amp; client review</li><li><strong>Week 7–9:</strong> Development &amp; CMS integration</li><li><strong>Week 10:</strong> Testing, QA &amp; launch</li></ul>`,
      pricing: pricing([
        { name: 'Discovery & Strategy', description: 'Research, competitor analysis, user journey mapping', unitPrice: 2500 },
        { name: 'UX Design', description: 'Wireframes, prototypes, and usability review', unitPrice: 4500 },
        { name: 'Visual Design', description: 'UI design for up to 10 page templates', unitPrice: 5500 },
        { name: 'Development', description: 'Front-end build, CMS integration, and content migration', unitPrice: 8000 },
        { name: 'SEO & Launch', description: 'On-page SEO, performance optimization, and deployment', unitPrice: 2000 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },

  // ── 2. Marketing Campaign ────────────────────────────────────────────────
  {
    id: 'marketing-campaign',
    name: 'Marketing Campaign',
    category: 'Marketing',
    description: 'Multi-channel campaign strategy, creative production, and reporting.',
    editorTitle: 'Marketing Campaign Proposal',
    sections: {
      cover: `<h1>Marketing Campaign Proposal for [Client Name]</h1><p>A targeted multi-channel campaign to grow awareness, engagement, and sales.</p><p>Prepared by [Your Agency]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>[Client Name] is looking to increase market presence and drive measurable revenue growth through a focused marketing campaign. Our team brings deep expertise in paid media, content strategy, and performance analytics.</p><p>We propose a 3-month integrated campaign spanning paid social, email marketing, content creation, and influencer partnerships — all tied to clear KPIs and weekly reporting.</p><p>Our data-driven approach ensures every dollar is accountable. Clients in comparable industries have seen 30–50% increases in qualified leads within the first campaign cycle.</p>`,
      scope: `<h2>Scope of Work</h2><p>This campaign engagement includes:</p><ul><li>Brand audit and target audience analysis</li><li>Campaign strategy and messaging framework</li><li>Paid social media advertising (Meta, LinkedIn, or TikTok)</li><li>Email marketing — sequence design and automation setup</li><li>Content creation: blog posts, social graphics, and short-form video scripts</li><li>Influencer or partnership outreach management</li><li>Monthly performance reports with optimization recommendations</li><li>End-of-campaign audit and next-steps roadmap</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>Throughout the engagement you will receive:</p><ul><li><strong>Campaign Strategy Deck:</strong> Audience personas, channel plan, messaging hierarchy</li><li><strong>Creative Assets:</strong> 20+ graphics, 4 blog posts, and 8 short-form video scripts</li><li><strong>Email Sequences:</strong> 3 automated flows with copywriting and design</li><li><strong>Ad Campaigns:</strong> Live paid campaigns with ongoing A/B testing</li><li><strong>Weekly Reports:</strong> KPI dashboard updates every Friday</li><li><strong>Final Audit:</strong> Full campaign recap with insights and recommendations</li></ul>`,
      timeline: `<h2>Campaign Timeline</h2><p>Estimated duration: <strong>12 weeks</strong></p><ul><li><strong>Week 1–2:</strong> Strategy, audience research &amp; creative briefing</li><li><strong>Week 3–4:</strong> Creative production &amp; campaign setup</li><li><strong>Week 5–8:</strong> Campaign launch, monitoring &amp; optimization</li><li><strong>Week 9–11:</strong> Scale top performers &amp; mid-campaign review</li><li><strong>Week 12:</strong> Final reporting &amp; next-phase planning</li></ul>`,
      pricing: pricing([
        { name: 'Strategy & Research', description: 'Audience analysis, messaging framework, channel plan', unitPrice: 3000 },
        { name: 'Creative Production', description: 'Graphics, blog posts, video scripts, email design', unitPrice: 5000 },
        { name: 'Paid Media Management', description: 'Ad setup, optimization, and budget management (3 months)', unitPrice: 4500 },
        { name: 'Email Marketing', description: '3 automated flows — copy, design, and setup', unitPrice: 2500 },
        { name: 'Reporting & Analytics', description: 'Weekly KPI reports and final campaign audit', unitPrice: 1500 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },

  // ── 3. Business Consulting ───────────────────────────────────────────────
  {
    id: 'business-consulting',
    name: 'Business Consulting',
    category: 'Consulting',
    description: 'Operational review, strategy development, and growth roadmap.',
    editorTitle: 'Business Consulting Proposal',
    sections: {
      cover: `<h1>Business Consulting Proposal for [Client Name]</h1><p>Strategic advisory to optimize operations and accelerate sustainable growth.</p><p>Prepared by [Your Firm]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>[Client Name] is at an inflection point — strong fundamentals, but facing operational inefficiencies and unclear growth priorities. Our consulting firm partners with leadership teams to cut through complexity and build executable strategies.</p><p>We will conduct a thorough operational review, benchmark performance against industry standards, identify high-impact opportunities, and deliver a clear 12-month growth roadmap with measurable milestones.</p><p>Past engagements of this scope have helped clients reduce costs by 15–25% and increase revenue productivity within two quarters of implementation.</p>`,
      scope: `<h2>Scope of Work</h2><p>This consulting engagement encompasses:</p><ul><li>Stakeholder interviews (leadership, operations, sales, finance)</li><li>Operational process audit and bottleneck identification</li><li>Financial performance benchmarking vs. industry peers</li><li>Competitive landscape analysis</li><li>Strategic options development and prioritization workshop</li><li>12-month growth roadmap with KPIs and accountability owners</li><li>Change management recommendations</li><li>Monthly check-in calls during implementation (90-day support)</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>At the end of this engagement, you will receive:</p><ul><li><strong>Operational Audit Report:</strong> Detailed findings with prioritized recommendations</li><li><strong>Benchmarking Report:</strong> Performance vs. industry peers across key metrics</li><li><strong>Strategic Growth Roadmap:</strong> 12-month action plan with milestones and owners</li><li><strong>Financial Model:</strong> Scenario analysis for the top 3 strategic options</li><li><strong>Prioritization Framework:</strong> Decision-making tool for future strategic choices</li><li><strong>90-Day Implementation Support:</strong> Monthly advisory calls with your leadership team</li></ul>`,
      timeline: `<h2>Engagement Timeline</h2><p>Estimated duration: <strong>8 weeks</strong></p><ul><li><strong>Week 1–2:</strong> Stakeholder interviews &amp; data collection</li><li><strong>Week 3–4:</strong> Analysis, benchmarking &amp; findings synthesis</li><li><strong>Week 5–6:</strong> Strategy development &amp; scenario modelling</li><li><strong>Week 7:</strong> Roadmap workshop with leadership team</li><li><strong>Week 8:</strong> Final report delivery &amp; implementation kickoff</li></ul>`,
      pricing: pricing([
        { name: 'Discovery & Audit', description: 'Stakeholder interviews, process review, data collection', unitPrice: 6000 },
        { name: 'Analysis & Benchmarking', description: 'Financial and operational benchmarking vs. industry peers', unitPrice: 5000 },
        { name: 'Strategy Development', description: 'Strategic options, prioritization workshop, scenario modelling', unitPrice: 7000 },
        { name: 'Roadmap & Deliverables', description: 'Final report, growth roadmap, and financial model', unitPrice: 4000 },
        { name: '90-Day Advisory Support', description: 'Monthly check-in calls during implementation phase', unitPrice: 3000 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },

  // ── 4. Freelance Development ─────────────────────────────────────────────
  {
    id: 'freelance-development',
    name: 'Freelance Development',
    category: 'Development',
    description: 'Custom software development for web or mobile applications.',
    editorTitle: 'Freelance Development Proposal',
    sections: {
      cover: `<h1>Development Proposal for [Client Name]</h1><p>Custom software built to spec, on time, and built to last.</p><p>Prepared by [Your Name]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>[Client Name] requires a custom software solution to [solve a specific problem / automate a process / build a product]. As a senior developer with expertise in modern web and mobile technologies, I deliver clean, maintainable code that scales.</p><p>This proposal covers the full development lifecycle: requirements analysis, architecture design, iterative development with weekly demos, testing, deployment, and 60-day post-launch support.</p><p>You'll have a direct line to the developer working on your product — no account managers, no handoffs. Just fast, transparent execution.</p>`,
      scope: `<h2>Scope of Work</h2><p>This project includes:</p><ul><li>Requirements analysis and technical specification document</li><li>System architecture design and technology selection</li><li>Database schema design and API design</li><li>Front-end development (responsive UI)</li><li>Back-end development (API, business logic, integrations)</li><li>Third-party API integrations as specified</li><li>Unit and integration testing</li><li>Deployment to production environment (cloud hosting)</li><li>Documentation: technical docs and user guide</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>Upon completion, you will receive:</p><ul><li><strong>Technical Specification:</strong> Detailed architecture and data model documentation</li><li><strong>Source Code:</strong> Full codebase in a private Git repository, transferred to you</li><li><strong>Deployed Application:</strong> Live and running in your preferred cloud environment</li><li><strong>API Documentation:</strong> Swagger/OpenAPI docs for all endpoints</li><li><strong>User Guide:</strong> End-user documentation for key workflows</li><li><strong>60-Day Support:</strong> Bug fixes and minor changes post-launch at no extra charge</li></ul>`,
      timeline: `<h2>Project Timeline</h2><p>Estimated duration: <strong>10 weeks</strong></p><ul><li><strong>Week 1:</strong> Requirements deep-dive &amp; technical spec</li><li><strong>Week 2–3:</strong> Architecture design &amp; environment setup</li><li><strong>Week 4–7:</strong> Core development (2-week sprints with demos)</li><li><strong>Week 8–9:</strong> Testing, bug fixing &amp; performance tuning</li><li><strong>Week 10:</strong> Deployment, documentation &amp; handover</li></ul>`,
      pricing: pricing([
        { name: 'Discovery & Spec', description: 'Requirements analysis and technical specification', unitPrice: 2000 },
        { name: 'Architecture & Setup', description: 'System design, DB schema, and environment configuration', unitPrice: 1500 },
        { name: 'Development', description: 'Front-end and back-end development (estimated 120 hours @ $100/hr)', unitPrice: 12000 },
        { name: 'Testing & QA', description: 'Unit tests, integration tests, and bug fixes', unitPrice: 2000 },
        { name: 'Deployment & Docs', description: 'Production deployment, documentation, and handover', unitPrice: 1500 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },

  // ── 5. Architecture & Interior Design ────────────────────────────────────
  {
    id: 'architecture-interior',
    name: 'Architecture & Interior Design',
    category: 'Design',
    description: 'End-to-end design for residential or commercial spaces.',
    editorTitle: 'Architecture & Interior Design Proposal',
    sections: {
      cover: `<h1>Design Proposal for [Client Name]</h1><p>Thoughtful spaces designed for the way you live and work.</p><p>Prepared by [Your Studio]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>[Client Name] is seeking a design partner for [residential / commercial / renovation] project at [Project Address]. Our studio brings together architecture and interior design under one roof, ensuring a seamless aesthetic from structure to furnishings.</p><p>We propose a full-service design engagement — from initial concept through construction documentation and FF&amp;E procurement — guided by your vision and grounded in functional beauty.</p><p>Our process is collaborative and transparent: you'll see every major decision before it's made, and our project management ensures delivery on time and within budget.</p>`,
      scope: `<h2>Scope of Work</h2><p>This engagement includes:</p><ul><li>Site survey and existing conditions documentation</li><li>Programming: understanding client needs, lifestyle, and aspirations</li><li>Schematic design with 3D renderings and mood boards</li><li>Design development and material/finish selection</li><li>Construction documentation for permit and contractor tendering</li><li>FF&amp;E (furniture, fixtures &amp; equipment) selection and procurement</li><li>Contractor selection assistance and bid review</li><li>Construction administration and site visits</li><li>Styling and final installation coordination</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>Throughout this engagement you will receive:</p><ul><li><strong>Concept Package:</strong> Floor plans, 3D renderings, material mood boards</li><li><strong>Design Development Set:</strong> Detailed drawings, material specifications, and finish schedule</li><li><strong>Construction Documents:</strong> Full permit-ready drawing set</li><li><strong>FF&amp;E Schedule:</strong> Itemized procurement list with budgets and lead times</li><li><strong>As-Built Documentation:</strong> Final drawings reflecting construction as completed</li><li><strong>Styled Photography:</strong> Professional shoot of the completed space</li></ul>`,
      timeline: `<h2>Project Timeline</h2><p>Estimated duration: <strong>20 weeks</strong> (design phase)</p><ul><li><strong>Week 1–2:</strong> Programming, site survey &amp; brief confirmation</li><li><strong>Week 3–6:</strong> Schematic design &amp; concept presentation</li><li><strong>Week 7–10:</strong> Design development &amp; material selection</li><li><strong>Week 11–14:</strong> Construction documentation</li><li><strong>Week 15–18:</strong> Contractor tendering &amp; FF&amp;E procurement</li><li><strong>Week 19–20:</strong> Installation, styling &amp; final photography</li></ul>`,
      pricing: pricing([
        { name: 'Programming & Schematic Design', description: 'Site survey, concept development, and 3D renderings', unitPrice: 8000 },
        { name: 'Design Development', description: 'Detailed design, material/finish selection, specifications', unitPrice: 10000 },
        { name: 'Construction Documents', description: 'Permit-ready drawing set and technical documentation', unitPrice: 12000 },
        { name: 'FF&E Procurement', description: 'Furniture, fixtures, and equipment selection and coordination', unitPrice: 7000 },
        { name: 'Construction Administration', description: 'Site visits, contractor coordination, and punch list review', unitPrice: 6000 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },

  // ── 6. Legal Services ────────────────────────────────────────────────────
  {
    id: 'legal-services',
    name: 'Legal Services',
    category: 'Professional Services',
    description: 'Corporate legal advisory, contract drafting, and compliance.',
    editorTitle: 'Legal Services Proposal',
    sections: {
      cover: `<h1>Legal Services Proposal for [Client Name]</h1><p>Expert legal counsel to protect your business and support your growth.</p><p>Prepared by [Your Law Firm]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>[Client Name] requires comprehensive legal support across [areas of need — e.g., commercial contracts, corporate structuring, employment law]. Our firm provides practical, business-oriented legal advice that enables growth while managing risk.</p><p>We propose a structured legal services engagement covering contract review and drafting, corporate governance documentation, regulatory compliance review, and ongoing retainer advisory.</p><p>Our approach is proactive: we work alongside your team to anticipate legal challenges before they become costly problems, freeing your leadership to focus on building the business.</p>`,
      scope: `<h2>Scope of Work</h2><p>This engagement covers the following legal services:</p><ul><li>Review and redrafting of standard commercial contracts and NDAs</li><li>Corporate governance documentation (shareholder agreements, board resolutions)</li><li>Employment agreements, contractor agreements, and HR policy review</li><li>Privacy and data protection compliance review (GDPR / applicable local law)</li><li>Intellectual property ownership and licensing documentation</li><li>Regulatory compliance audit for relevant industry requirements</li><li>Ongoing retainer: up to 10 advisory hours per month</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>As part of this engagement, you will receive:</p><ul><li><strong>Contract Templates:</strong> Redrafted and approved standard agreements for your operations</li><li><strong>Governance Package:</strong> Shareholder agreement, board resolutions, and corporate records update</li><li><strong>HR Documentation:</strong> Employment and contractor agreement templates with policy annexures</li><li><strong>Compliance Report:</strong> Written assessment of regulatory obligations with action items</li><li><strong>IP Register:</strong> Documented ownership and licensing framework for your IP assets</li><li><strong>Monthly Advisory:</strong> Up to 10 hours of legal advice per month under retainer</li></ul>`,
      timeline: `<h2>Engagement Timeline</h2><p>Estimated duration: <strong>6 weeks</strong> (initial phase) + ongoing retainer</p><ul><li><strong>Week 1–2:</strong> Legal audit &amp; intake of existing documentation</li><li><strong>Week 3–4:</strong> Drafting, review &amp; client feedback cycles</li><li><strong>Week 5:</strong> Compliance report &amp; IP documentation</li><li><strong>Week 6:</strong> Final delivery, execution &amp; retainer commencement</li></ul>`,
      pricing: pricing([
        { name: 'Legal Audit & Intake', description: 'Review of existing contracts, corporate docs, and IP assets', unitPrice: 3500 },
        { name: 'Contract Drafting & Review', description: 'Commercial contracts, NDAs, and standard agreement templates', unitPrice: 5000 },
        { name: 'Corporate Governance Package', description: 'Shareholder agreement, board resolutions, and corporate records', unitPrice: 4500 },
        { name: 'Compliance Review', description: 'Privacy, regulatory, and employment compliance assessment', unitPrice: 4000 },
        { name: 'Monthly Retainer (per month)', description: 'Up to 10 advisory hours per month', unitPrice: 2500 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },

  // ── 7. Event Planning ────────────────────────────────────────────────────
  {
    id: 'event-planning',
    name: 'Event Planning',
    category: 'Events',
    description: 'Full-service planning and production for corporate or private events.',
    editorTitle: 'Event Planning Proposal',
    sections: {
      cover: `<h1>Event Planning Proposal for [Client Name]</h1><p>A flawlessly executed event that your guests will talk about long after it's over.</p><p>Prepared by [Your Events Company]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>[Client Name] is planning [event type — e.g., annual conference, product launch, gala dinner] for approximately [number] guests on [date / timeframe]. Our full-service event production company handles everything from concept to cleanup, so you can be fully present on the day.</p><p>We propose an end-to-end planning and production service covering venue selection, vendor management, creative theming, audio-visual production, catering coordination, and on-site event management.</p><p>With over [X] events delivered, our team brings the relationships, systems, and calm-under-pressure execution that high-stakes events demand.</p>`,
      scope: `<h2>Scope of Work</h2><p>This engagement includes full planning and production:</p><ul><li>Event concept development and mood boarding</li><li>Venue scouting, negotiation, and booking</li><li>Vendor selection and management (catering, AV, florals, photography, entertainment)</li><li>Budget management and financial reconciliation</li><li>Guest management: invitations, RSVPs, and dietary tracking</li><li>Audio-visual and staging design and production</li><li>Run-of-show development and supplier briefing</li><li>On-site event management with dedicated coordinator</li><li>Post-event reporting and vendor payments</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>For this event, you will receive:</p><ul><li><strong>Event Concept Package:</strong> Theme, mood boards, floor plan, and run-of-show</li><li><strong>Vendor Contracts:</strong> Fully negotiated and executed supplier agreements</li><li><strong>Guest Management:</strong> RSVP tracking, seating plan, and name badges</li><li><strong>AV &amp; Production:</strong> Full staging, lighting, sound, and presentation management</li><li><strong>On-Site Team:</strong> Dedicated coordinator and support staff for the event day</li><li><strong>Post-Event Report:</strong> Attendance data, budget reconciliation, and vendor feedback summary</li></ul>`,
      timeline: `<h2>Planning Timeline</h2><p>Estimated lead time: <strong>12 weeks pre-event</strong></p><ul><li><strong>Week 1–2:</strong> Brief, concept development &amp; venue shortlist</li><li><strong>Week 3–4:</strong> Venue booking &amp; vendor selection</li><li><strong>Week 5–8:</strong> Vendor contracts, design, &amp; guest management setup</li><li><strong>Week 9–10:</strong> AV production planning &amp; run-of-show drafting</li><li><strong>Week 11:</strong> Final briefings, rehearsals &amp; logistics lock-in</li><li><strong>Week 12:</strong> Event day execution &amp; post-event wrap-up</li></ul>`,
      pricing: pricing([
        { name: 'Event Management Fee', description: 'Full planning, coordination, and on-site management', unitPrice: 8000 },
        { name: 'Venue Hire', description: 'Venue rental including setup and breakdown (estimate)', unitPrice: 5000 },
        { name: 'Catering', description: 'Food and beverage for estimated guest count (estimate)', unitPrice: 6000 },
        { name: 'Audio-Visual & Production', description: 'Staging, lighting, sound, and presentation tech', unitPrice: 4500 },
        { name: 'Décor & Florals', description: 'Event styling, centerpieces, and branded elements', unitPrice: 3500 },
        { name: 'Photography & Videography', description: 'Full-day coverage with edited deliverables', unitPrice: 3000 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },

  // ── 8. SaaS Product Pitch ────────────────────────────────────────────────
  {
    id: 'saas-product-pitch',
    name: 'SaaS Product Pitch',
    category: 'Technology',
    description: 'Implementation and onboarding proposal for a SaaS solution.',
    editorTitle: 'SaaS Implementation Proposal',
    sections: {
      cover: `<h1>SaaS Implementation Proposal for [Client Name]</h1><p>Transform your workflow with [Product Name] — up and running in weeks, not months.</p><p>Prepared by [Your Company]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>[Client Name]'s current [process / tool stack] is creating friction that costs time and revenue. [Product Name] is the purpose-built solution — automating [key pain point], centralizing [data / workflow], and giving your team real-time visibility into [metric].</p><p>We propose a structured implementation engagement: platform configuration, data migration, API integrations with your existing tools, team training, and a 90-day success program to ensure adoption and ROI.</p><p>Companies like [Reference Company A] and [Reference Company B] have reduced [process] time by 40% and saved an average of [X] hours per week within the first quarter on [Product Name].</p>`,
      scope: `<h2>Scope of Work</h2><p>This implementation includes:</p><ul><li>Platform configuration and workspace setup</li><li>Custom field, workflow, and automation configuration</li><li>Data migration from existing systems</li><li>API integration with [Tool A], [Tool B], and [Tool C]</li><li>Role-based access control and permissions setup</li><li>Administrator and end-user training sessions</li><li>Custom dashboard and reporting configuration</li><li>90-day onboarding success program with dedicated Customer Success Manager</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>Upon completion of this implementation, you will have:</p><ul><li><strong>Configured Platform:</strong> Fully set up workspace tailored to your team's workflows</li><li><strong>Migrated Data:</strong> Historical data cleaned, formatted, and imported</li><li><strong>Active Integrations:</strong> Live connections to your existing tool stack</li><li><strong>Training Materials:</strong> Video walkthroughs and quick-reference guides for your team</li><li><strong>Custom Dashboards:</strong> Real-time reporting views for leadership and teams</li><li><strong>Success Plan:</strong> 90-day adoption roadmap with check-in milestones</li></ul>`,
      timeline: `<h2>Implementation Timeline</h2><p>Estimated duration: <strong>6 weeks</strong></p><ul><li><strong>Week 1:</strong> Discovery call, requirements mapping &amp; implementation plan</li><li><strong>Week 2–3:</strong> Platform configuration &amp; data migration</li><li><strong>Week 4:</strong> Integrations, testing &amp; UAT with power users</li><li><strong>Week 5:</strong> Team training (admin + end-user sessions)</li><li><strong>Week 6:</strong> Go-live, hypercare support &amp; 90-day success kickoff</li></ul>`,
      pricing: pricing([
        { name: 'Annual License (per seat)', description: '[Product Name] annual subscription per user seat', unitPrice: 120 },
        { name: 'Implementation Fee', description: 'Platform config, data migration, integrations, and training', unitPrice: 6000 },
        { name: 'Custom Integration Development', description: 'API integrations beyond standard connectors', unitPrice: 3500 },
        { name: '90-Day Success Program', description: 'Dedicated CSM, check-ins, and adoption support', unitPrice: 2500 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },

  // ── 9. HR Consulting ─────────────────────────────────────────────────────
  {
    id: 'hr-consulting',
    name: 'HR Consulting',
    category: 'Consulting',
    description: 'People strategy, talent programs, and HR systems for growing teams.',
    editorTitle: 'HR Consulting Proposal',
    sections: {
      cover: `<h1>HR Consulting Proposal for [Client Name]</h1><p>Building the people foundation your business needs to scale.</p><p>Prepared by [Your Firm]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>As [Client Name] grows, people challenges multiply: hiring the right talent, retaining top performers, maintaining culture, and ensuring compliance become increasingly complex. Our HR consulting firm partners with leadership teams to build the people infrastructure that supports sustainable growth.</p><p>We propose an engagement covering organizational design review, talent acquisition strategy, performance management framework, compensation benchmarking, and HR systems selection — all tailored to where your business is today and where it's headed.</p><p>Clients who have worked through this program report 35% reductions in time-to-hire and significantly improved employee engagement scores within six months.</p>`,
      scope: `<h2>Scope of Work</h2><p>This HR consulting engagement includes:</p><ul><li>Organizational design review and headcount planning</li><li>Talent acquisition strategy and hiring process redesign</li><li>Job architecture: role levels, competency frameworks, and job descriptions</li><li>Performance management framework design (review cycles, feedback tools)</li><li>Compensation benchmarking and pay structure review</li><li>Employee engagement survey design and analysis</li><li>HR systems assessment and vendor selection support (HRIS, ATS)</li><li>Manager training: giving feedback, performance conversations, and retention</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>At the conclusion of this engagement, you will have:</p><ul><li><strong>Org Design Report:</strong> Recommended structure, spans of control, and headcount plan</li><li><strong>Hiring Playbook:</strong> End-to-end recruitment process, interview guides, and scorecards</li><li><strong>Job Architecture:</strong> Leveling framework and updated job descriptions</li><li><strong>Performance Framework:</strong> Review templates, goal-setting guide, and manager resources</li><li><strong>Compensation Report:</strong> Market benchmarks and pay band recommendations</li><li><strong>Engagement Survey Results:</strong> Analysis with prioritized action items</li></ul>`,
      timeline: `<h2>Engagement Timeline</h2><p>Estimated duration: <strong>10 weeks</strong></p><ul><li><strong>Week 1–2:</strong> Diagnostic: interviews, surveys &amp; data review</li><li><strong>Week 3–4:</strong> Org design &amp; job architecture</li><li><strong>Week 5–6:</strong> Talent acquisition &amp; performance management design</li><li><strong>Week 7–8:</strong> Compensation benchmarking &amp; engagement survey</li><li><strong>Week 9:</strong> HR systems assessment &amp; recommendations</li><li><strong>Week 10:</strong> Final presentation, playbooks delivery &amp; implementation kickoff</li></ul>`,
      pricing: pricing([
        { name: 'HR Diagnostic', description: 'Interviews, surveys, and current-state assessment', unitPrice: 4000 },
        { name: 'Org Design & Job Architecture', description: 'Organizational structure, leveling, and job descriptions', unitPrice: 5500 },
        { name: 'Talent Acquisition Strategy', description: 'Hiring process redesign, interview guides, and scorecards', unitPrice: 4500 },
        { name: 'Performance & Compensation', description: 'Performance framework and compensation benchmarking', unitPrice: 5000 },
        { name: 'Systems Assessment & Training', description: 'HRIS/ATS evaluation and manager training sessions', unitPrice: 3500 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },

  // ── 10. Financial Advisory ───────────────────────────────────────────────
  {
    id: 'financial-advisory',
    name: 'Financial Advisory',
    category: 'Finance',
    description: 'CFO advisory, financial modelling, and fundraising preparation.',
    editorTitle: 'Financial Advisory Proposal',
    sections: {
      cover: `<h1>Financial Advisory Proposal for [Client Name]</h1><p>Strategic financial leadership to sharpen decisions and fuel growth.</p><p>Prepared by [Your Advisory Firm]</p><p>Date: ${TODAY}</p>`,
      summary: `<p>[Client Name] is navigating a period of [growth / transition / fundraising preparation] that demands sharp financial clarity and strategic capital allocation. Our fractional CFO and financial advisory service brings senior-level financial leadership without the cost of a full-time hire.</p><p>We propose an engagement covering financial model development, cash flow forecasting, management reporting infrastructure, investor readiness preparation, and ongoing monthly CFO advisory support.</p><p>Clients use our engagement to close funding rounds with confidence, make better capital allocation decisions, and build the financial credibility that investors and boards demand.</p>`,
      scope: `<h2>Scope of Work</h2><p>This financial advisory engagement includes:</p><ul><li>Financial health diagnostic: P&amp;L, balance sheet, and cash flow review</li><li>Three-statement financial model build (12-month and 3-year)</li><li>Revenue and unit economics analysis (LTV, CAC, payback period)</li><li>Cash flow forecasting and runway analysis</li><li>Management reporting dashboard (KPIs, actuals vs. budget)</li><li>Investor readiness: data room preparation and financial narrative</li><li>Pitch deck financial section review and coaching</li><li>Monthly fractional CFO advisory (up to 8 hours per month)</li></ul>`,
      deliverables: `<h2>Deliverables</h2><p>This engagement will produce:</p><ul><li><strong>Financial Model:</strong> Dynamic 3-statement model with scenario analysis</li><li><strong>Cash Flow Forecast:</strong> 18-month weekly cash flow with sensitivity analysis</li><li><strong>Unit Economics Report:</strong> LTV/CAC analysis with benchmarks</li><li><strong>Management Dashboard:</strong> Monthly reporting template with KPI tracking</li><li><strong>Investor Data Room:</strong> Organized financial documentation ready for due diligence</li><li><strong>Monthly Advisory:</strong> Up to 8 hours of CFO-level advisory per month</li></ul>`,
      timeline: `<h2>Engagement Timeline</h2><p>Estimated duration: <strong>6 weeks</strong> (initial phase) + ongoing monthly advisory</p><ul><li><strong>Week 1–2:</strong> Financial diagnostic &amp; data collection</li><li><strong>Week 3–4:</strong> Financial model build &amp; unit economics analysis</li><li><strong>Week 5:</strong> Management reporting setup &amp; investor readiness package</li><li><strong>Week 6:</strong> Delivery, review &amp; monthly advisory retainer kickoff</li></ul>`,
      pricing: pricing([
        { name: 'Financial Diagnostic', description: 'Review of financials, KPIs, and current reporting', unitPrice: 3000 },
        { name: 'Financial Model Build', description: '3-statement model with 3-year projections and scenarios', unitPrice: 7000 },
        { name: 'Unit Economics & Cash Flow', description: 'LTV/CAC analysis and 18-month cash flow forecast', unitPrice: 4500 },
        { name: 'Investor Readiness Package', description: 'Data room prep, financial narrative, and pitch deck review', unitPrice: 5000 },
        { name: 'Monthly CFO Advisory (per month)', description: 'Up to 8 hours of advisory, reporting, and board prep', unitPrice: 3000 },
      ], 0, 0),
      terms: TERMS,
      signature: SIGNATURE,
    },
  },
]
