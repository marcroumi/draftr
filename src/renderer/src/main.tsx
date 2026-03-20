import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { FileText } from 'lucide-react'
import App from './App'
import { ToastProvider } from './lib/toast'
import './index.css'

function SplashScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1600)
    const t2 = setTimeout(onDone, 2100)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0b1d3a]
        transition-opacity duration-500 ease-out
        ${fading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center gap-5 select-none">
        {/* Logo icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl animate-splash-pulse">
          <FileText size={36} className="text-white" strokeWidth={1.5} />
        </div>

        {/* Wordmark */}
        <div className="text-center">
          <h1 className="text-white text-4xl font-bold tracking-tight">Draftr</h1>
          <p className="text-white/35 text-sm mt-1.5 font-medium tracking-wide">
            Proposals made simple
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-36 h-[2px] bg-white/10 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-indigo-400/80 rounded-full animate-splash-bar" />
        </div>
      </div>
    </div>
  )
}

function Root() {
  const [splashDone, setSplashDone] = useState(false)
  return (
    <>
      {!splashDone && <SplashScreen onDone={() => setSplashDone(true)} />}
      <App />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <ToastProvider>
        <Root />
      </ToastProvider>
    </HashRouter>
  </React.StrictMode>
)
