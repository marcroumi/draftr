import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'

export default function MainLayout({ children }: { children: ReactNode }) {
  const location = useLocation()

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          key={location.pathname}
          className="flex-1 overflow-y-auto bg-slate-50 p-8 animate-page-enter"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
