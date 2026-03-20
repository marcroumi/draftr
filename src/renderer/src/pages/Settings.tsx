import { useState, useEffect, useRef } from 'react'
import {
  Key,
  Save,
  Eye,
  EyeOff,
  ExternalLink,
  Building2,
  Upload,
  X,
  Globe,
  Phone,
  MapPin,
  DollarSign,
} from 'lucide-react'
import { useToast } from '../lib/toast'

const SETTINGS_KEY = 'draftr_settings'

interface CompanySettings {
  name: string
  logo: string // base64 data URL or ''
  website: string
  phone: string
  address: string
  currency: 'USD' | 'EUR' | 'GBP' | 'LBP'
}

const defaultCompany: CompanySettings = {
  name: '',
  logo: '',
  website: '',
  phone: '',
  address: '',
  currency: 'USD',
}

const CURRENCIES = [
  { value: 'USD', label: 'USD — US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR — Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP — British Pound', symbol: '£' },
  { value: 'LBP', label: 'LBP — Lebanese Pound', symbol: 'ل.ل' },
] as const

function SectionHeader({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
}) {
  return (
    <div className="px-6 py-5 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${gradient}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-slate-900 font-semibold text-sm">{title}</h3>
          <p className="text-slate-400 text-xs">{description}</p>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
  icon,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon?: React.ReactNode
  type?: string
}) {
  return (
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border border-slate-200 rounded-lg py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors ${icon ? 'pl-9 pr-3' : 'px-3'}`}
      />
    </div>
  )
}

export default function Settings() {
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [company, setCompany] = useState<CompanySettings>(defaultCompany)
  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setApiKey(localStorage.getItem('draftr_anthropic_key') ?? '')
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      if (raw) setCompany({ ...defaultCompany, ...JSON.parse(raw) })
    } catch {}
  }, [])

  const setField = <K extends keyof CompanySettings>(key: K, value: CompanySettings[K]) =>
    setCompany((prev) => ({ ...prev, [key]: value }))

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setField('logo', reader.result as string)
    reader.readAsDataURL(file)
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleSave = () => {
    localStorage.setItem('draftr_anthropic_key', apiKey.trim())
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(company))
    toast.success('Settings saved')
  }

  const maskedPreview =
    apiKey.length > 12
      ? `${apiKey.slice(0, 10)}${'•'.repeat(Math.min(apiKey.length - 14, 20))}${apiKey.slice(-4)}`
      : apiKey

  return (
    <div className="max-w-xl">
      <div className="mb-8">
        <h2 className="text-slate-900 text-xl font-semibold mb-1">Settings</h2>
        <p className="text-slate-400 text-sm">Configure Draftr for your workflow.</p>
      </div>

      <div className="space-y-5">
        {/* ── AI Configuration ── */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <SectionHeader
            gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
            icon={<Key size={16} className="text-white" />}
            title="Anthropic API Key"
            description="Required for AI content generation in the proposal editor"
          />

          <div className="px-6 py-5 space-y-4">
            <Field label="API Key">
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-slate-800 placeholder-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
                />
                <button
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {apiKey && (
                <p className="text-xs text-slate-400 mt-1.5 font-mono">{maskedPreview}</p>
              )}
            </Field>

            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2.5">
              <ExternalLink size={13} className="text-slate-400 shrink-0" />
              <p className="text-xs text-slate-500">
                Get your key at{' '}
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-500 hover:underline font-medium"
                >
                  console.anthropic.com
                </a>
                . Stored locally, only sent to Anthropic's API.
              </p>
            </div>
          </div>
        </div>

        {/* ── Company Details ── */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <SectionHeader
            gradient="bg-gradient-to-br from-sky-500 to-blue-600"
            icon={<Building2 size={16} className="text-white" />}
            title="Company Details"
            description="Used to pre-fill your proposals and branding"
          />

          <div className="px-6 py-5 space-y-4">
            {/* Logo */}
            <Field label="Logo">
              <div className="flex items-center gap-4">
                {company.logo ? (
                  <div className="relative shrink-0 group">
                    <img
                      src={company.logo}
                      alt="Company logo"
                      className="w-16 h-16 object-contain rounded-lg border border-slate-200 bg-slate-50"
                    />
                    <button
                      onClick={() => setField('logo', '')}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-slate-300" />
                  </div>
                )}
                <div>
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Upload size={14} />
                    {company.logo ? 'Replace logo' : 'Upload logo'}
                  </button>
                  <p className="text-xs text-slate-400 mt-1.5">PNG, JPG, SVG. Stored locally.</p>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml,image/webp"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>
            </Field>

            <Field label="Company Name">
              <TextInput
                value={company.name}
                onChange={(v) => setField('name', v)}
                placeholder="Acme Inc."
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Website">
                <TextInput
                  value={company.website}
                  onChange={(v) => setField('website', v)}
                  placeholder="https://acme.com"
                  icon={<Globe size={14} />}
                />
              </Field>
              <Field label="Phone">
                <TextInput
                  value={company.phone}
                  onChange={(v) => setField('phone', v)}
                  placeholder="+1 555 000 0000"
                  icon={<Phone size={14} />}
                />
              </Field>
            </div>

            <Field label="Address">
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3 top-3 text-slate-300 pointer-events-none"
                />
                <textarea
                  value={company.address}
                  onChange={(e) => setField('address', e.target.value)}
                  placeholder="123 Main St, Suite 100&#10;New York, NY 10001"
                  rows={2}
                  className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors resize-none"
                />
              </div>
            </Field>
          </div>
        </div>

        {/* ── Preferences ── */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <SectionHeader
            gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
            icon={<DollarSign size={16} className="text-white" />}
            title="Preferences"
            description="Default settings applied to new proposals"
          />

          <div className="px-6 py-5">
            <Field label="Default Currency">
              <select
                value={company.currency}
                onChange={(e) => setField('currency', e.target.value as CompanySettings['currency'])}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* ── Save button ── */}
        <div className="flex items-center justify-between pt-1 pb-8">
          <p className="text-xs text-slate-400">All data is stored locally on your machine.</p>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 active:bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Save size={14} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}
