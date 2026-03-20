<div align="center">
  <h1> Draftr</h1>
  <p><strong>Free, open-source proposal generation tool — built for freelancers, agencies, consultants, and small businesses.</strong></p>

  ![Version](https://img.shields.io/badge/version-1.0.0-blue)
  ![License](https://img.shields.io/badge/license-MIT-green)
  ![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
  ![Status](https://img.shields.io/badge/status-active-brightgreen)
</div>

---

## What is Draftr?

Draftr is a free desktop app that lets you create professional, beautiful proposals in minutes — without needing design skills or expensive tools like HubSpot or Proposify.

Just pick a template, fill in your details, let AI write the copy if you want, and export a polished PDF. That's it.

---

## Features

- **Dashboard** — Manage all your proposals in one place with status tracking (Draft, Sent, Viewed, Accepted, Rejected)
- **Proposal Editor** — Drag-and-drop sections: Cover Page, Executive Summary, Scope of Work, Deliverables, Timeline, Pricing Table, Terms & Conditions, Signature
- **Themes & Fonts** — 6 built-in themes (Modern, Classic, Minimal, Corporate, Bold, Creative) with Google Font pairings
- **Pricing Table** — Add line items, auto-calculate subtotals, apply discounts and taxes
- **AI Generation** — Powered by Claude API — auto-generate professional proposal copy for any section
- **PDF Export** — Export pixel-perfect, print-ready PDFs in one click
- **Templates Library** — 10 industry-specific templates (Web Agency, Marketing, Consulting, Legal, and more)

---

## Installation

### Option 1 — Download the Installer (Recommended)
1. Go to the [Releases](https://github.com/marcroumi/draftr/releases) page
2. Download `Draftr Setup 1.0.0.exe`
3. Run the installer
4. Launch Draftr from your Desktop or Start Menu

### Option 2 — Run from Source
```bash
# Clone the repo
git clone https://github.com/marcroumi/draftr.git

# Navigate into the folder
cd draftr

# Install dependencies
npm install

# Run in development mode
npm run dev
```

**Requirements:** Node.js 18+ and Git

---

## AI Feature Setup

Draftr's AI generation feature uses the Anthropic Claude API.

1. Get a free API key at [console.anthropic.com](https://console.anthropic.com)
2. Open Draftr → go to **Settings**
3. Paste your API key in the **Anthropic API Key** field
4. Save — the AI Generate button will now work in the editor

---

## Roadmap

- [ ] E-signature support
- [ ] Proposal sharing via link
- [ ] Client portal view
- [ ] More themes
- [ ] Mac & Linux builds
- [ ] Multi-language support

---

## Contributing

Contributions are welcome. If you find a bug or have a feature idea:
1. Open an [Issue](https://github.com/marcroumi/draftr/issues)
2. Or fork the repo, make your changes, and open a Pull Request

---

## License

MIT License — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/marcroumi">marcroumi</a></p>
  <p>If Draftr saves you money on proposal tools, consider giving it a ⭐</p>
</div>
