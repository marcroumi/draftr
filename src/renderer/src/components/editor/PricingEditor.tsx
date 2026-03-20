import { Plus, Trash2, DollarSign } from 'lucide-react'

export interface PricingItem {
  id: string
  name: string
  description: string
  quantity: number
  unitPrice: number
}

export interface PricingData {
  items: PricingItem[]
  discount: number  // 0–100
  tax: number       // 0–100
}

export const defaultPricingData: PricingData = {
  items: [
    { id: '1', name: 'Discovery & Strategy', description: 'Requirements gathering and project planning', quantity: 1, unitPrice: 2500 },
    { id: '2', name: 'Design', description: 'UI/UX design and prototyping', quantity: 1, unitPrice: 5000 },
    { id: '3', name: 'Development', description: 'Full-stack development and implementation', quantity: 1, unitPrice: 10000 },
    { id: '4', name: 'Testing & Launch', description: 'QA testing and deployment', quantity: 1, unitPrice: 2500 },
  ],
  discount: 0,
  tax: 0,
}

export function parsePricingData(content: string): PricingData {
  try {
    const parsed = JSON.parse(content)
    if (Array.isArray(parsed.items)) return parsed
  } catch {}
  return defaultPricingData
}

function fmt(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

interface PricingEditorProps {
  data: PricingData
  onChange: (data: PricingData) => void
}

function NumInput({
  value,
  onChange,
  min = 0,
  step = '1',
  className = '',
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  step?: string
  className?: string
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Math.max(min, parseFloat(e.target.value) || 0))}
      min={min}
      step={step}
      className={`outline-none bg-transparent text-slate-700 text-sm w-full ${className}`}
    />
  )
}

export default function PricingEditor({ data, onChange }: PricingEditorProps) {
  const updateItem = (id: string, field: keyof PricingItem, value: string | number) => {
    onChange({ ...data, items: data.items.map((it) => (it.id === id ? { ...it, [field]: value } : it)) })
  }

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { id: Date.now().toString(), name: '', description: '', quantity: 1, unitPrice: 0 }],
    })
  }

  const deleteItem = (id: string) => {
    onChange({ ...data, items: data.items.filter((it) => it.id !== id) })
  }

  const subtotal = data.items.reduce((s, it) => s + it.quantity * it.unitPrice, 0)
  const discountAmt = subtotal * (data.discount / 100)
  const taxAmt = (subtotal - discountAmt) * (data.tax / 100)
  const total = subtotal - discountAmt + taxAmt

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-slate-50">
      {/* Toolbar-style header */}
      <div className="flex items-center justify-between px-5 py-2.5 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2 text-slate-500">
          <DollarSign size={15} className="text-slate-400" />
          <span className="text-sm font-medium">Pricing Table</span>
          <span className="text-slate-200 mx-0.5">·</span>
          <span className="text-xs text-slate-400">{data.items.length} line item{data.items.length !== 1 ? 's' : ''}</span>
        </div>
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus size={13} strokeWidth={2.5} />
          Add Item
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-5">

          {/* Line items table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider w-[22%]">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider w-16">Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Unit Price</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider w-28">Subtotal</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-14 text-center">
                      <DollarSign size={22} className="text-slate-200 mx-auto mb-2" />
                      <p className="text-slate-400 text-sm">No items yet.</p>
                      <button
                        onClick={addItem}
                        className="mt-2 text-indigo-500 hover:text-indigo-600 text-sm font-medium transition-colors"
                      >
                        + Add your first item
                      </button>
                    </td>
                  </tr>
                ) : (
                  data.items.map((item) => {
                    const rowSubtotal = item.quantity * item.unitPrice
                    return (
                      <tr key={item.id} className="group hover:bg-slate-50/60 transition-colors">
                        {/* Name */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                            placeholder="Item name"
                            className="w-full text-sm font-semibold text-slate-800 placeholder-slate-300 outline-none bg-transparent"
                          />
                        </td>
                        {/* Description */}
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                            placeholder="Optional description"
                            className="w-full text-sm text-slate-500 placeholder-slate-300 outline-none bg-transparent"
                          />
                        </td>
                        {/* Qty */}
                        <td className="px-3 py-3">
                          <NumInput
                            value={item.quantity}
                            onChange={(v) => updateItem(item.id, 'quantity', v)}
                            min={0}
                            className="text-center"
                          />
                        </td>
                        {/* Unit price */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-0.5">
                            <span className="text-slate-300 text-sm">$</span>
                            <NumInput
                              value={item.unitPrice}
                              onChange={(v) => updateItem(item.id, 'unitPrice', v)}
                              min={0}
                              step="0.01"
                              className="text-right"
                            />
                          </div>
                        </td>
                        {/* Subtotal (read-only) */}
                        <td className="px-4 py-3 text-right">
                          <span className="text-sm font-semibold text-slate-800">{fmt(rowSubtotal)}</span>
                        </td>
                        {/* Delete */}
                        <td className="pr-2">
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all p-1.5 rounded-lg hover:bg-red-50 mx-auto block"
                            title="Remove row"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Add row link */}
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 text-indigo-500 hover:text-indigo-600 text-sm font-medium transition-colors"
          >
            <Plus size={14} />
            Add another item
          </button>

          {/* Summary */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Summary</p>
            </div>
            <div className="px-5 py-4 space-y-3">
              {/* Subtotal */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Subtotal</span>
                <span className="text-sm font-medium text-slate-800 tabular-nums">{fmt(subtotal)}</span>
              </div>

              {/* Discount */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Discount</span>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 gap-1">
                    <input
                      type="number"
                      value={data.discount}
                      onChange={(e) =>
                        onChange({ ...data, discount: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)) })
                      }
                      min={0}
                      max={100}
                      step="0.1"
                      className="w-10 text-sm text-slate-700 outline-none bg-transparent text-center"
                    />
                    <span className="text-xs text-slate-400 font-medium">%</span>
                  </div>
                </div>
                <span className={`text-sm font-medium tabular-nums ${discountAmt > 0 ? 'text-red-500' : 'text-slate-300'}`}>
                  {discountAmt > 0 ? `−${fmt(discountAmt)}` : '—'}
                </span>
              </div>

              {/* Tax */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Tax</span>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 gap-1">
                    <input
                      type="number"
                      value={data.tax}
                      onChange={(e) =>
                        onChange({ ...data, tax: Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)) })
                      }
                      min={0}
                      max={100}
                      step="0.1"
                      className="w-10 text-sm text-slate-700 outline-none bg-transparent text-center"
                    />
                    <span className="text-xs text-slate-400 font-medium">%</span>
                  </div>
                </div>
                <span className={`text-sm font-medium tabular-nums ${taxAmt > 0 ? 'text-slate-600' : 'text-slate-300'}`}>
                  {taxAmt > 0 ? `+${fmt(taxAmt)}` : '—'}
                </span>
              </div>

              {/* Total */}
              <div className="border-t border-slate-200 pt-3 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">{fmt(total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
