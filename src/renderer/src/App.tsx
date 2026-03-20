import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import ProposalEditor from './pages/ProposalEditor'
import Settings from './pages/Settings'
import Templates from './pages/Templates'

function App() {
  return (
    <Routes>
      {/* Full-screen editor — no sidebar/navbar chrome */}
      <Route path="/proposals/new" element={<ProposalEditor />} />
      <Route path="/proposals/:id" element={<ProposalEditor />} />

      {/* Dashboard routes wrapped in MainLayout */}
      <Route
        path="*"
        element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  )
}

export default App
