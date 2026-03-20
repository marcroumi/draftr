import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'

export type ToastVariant = 'success' | 'error' | 'info'

interface ToastMessage {
  id: number
  message: string
  variant: ToastVariant
  visible: boolean
}

interface ToastContextValue {
  toast: {
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
  }
}

const ToastContext = createContext<ToastContextValue>({
  toast: { success: () => {}, error: () => {}, info: () => {} },
})

const ICON = {
  success: <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />,
  error:   <XCircle     size={15} className="text-red-400 shrink-0" />,
  info:    <Info        size={15} className="text-blue-400 shrink-0" />,
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage
  onDismiss: () => void
}) {
  return (
    <div
      className={`flex items-center gap-3 bg-slate-900 border border-white/10 text-white
        px-4 py-3 rounded-xl shadow-2xl min-w-[220px] max-w-[360px]
        pointer-events-auto transition-all duration-300 ease-out
        ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
    >
      {ICON[toast.variant]}
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={onDismiss}
        className="text-white/30 hover:text-white/70 transition-colors ml-1 shrink-0"
      >
        <X size={13} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300)
  }, [])

  const addToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, variant, visible: false }])

    // Animate in after one tick
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: true } : t)))
    }, 10)

    // Start exit
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, visible: false } : t)))
    }, 2800)

    // Remove from DOM
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3200)
  }, [])

  const toast = useMemo(
    () => ({
      success: (msg: string) => addToast(msg, 'success'),
      error:   (msg: string) => addToast(msg, 'error'),
      info:    (msg: string) => addToast(msg, 'info'),
    }),
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
