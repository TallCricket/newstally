// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, createContext, useContext } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

// Pages
import Socialgati from './pages/Socialgati'
import NewsTally from './pages/NewsTally'
import NewsOpen from './pages/NewsOpen'
import About from './pages/About'
import Contact from './pages/Contact'
import Help from './pages/Help'
import Links from './pages/Links'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Sarju from './pages/Sarju'

// Components
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Toast from './components/Toast'
import AuthModal from './components/AuthModal'

// ===== GLOBAL CONTEXT =====
export const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [toast, setToast] = useState({ msg: '', visible: false })
  const [showAuth, setShowAuth] = useState(false)
  const [activeView, setActiveView] = useState('socialgati')

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return unsub
  }, [])

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Toast helper
  const showToast = (msg) => {
    setToast({ msg, visible: true })
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800)
  }

  const ctx = {
    currentUser,
    isDark,
    toggleDark: () => setIsDark(d => !d),
    showToast,
    openAuth: () => setShowAuth(true),
    closeAuth: () => setShowAuth(false),
    activeView,
    setActiveView
  }

  return (
    <AppContext.Provider value={ctx}>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Main pages */}
          <Route path="/" element={<Socialgati />} />
          <Route path="/socialgati" element={<Socialgati />} />
          <Route path="/newstally" element={<NewsTally />} />
          <Route path="/newstally.html" element={<NewsTally />} />
          <Route path="/newstallyopen" element={<NewsOpen />} />
          <Route path="/newstallyopen.html" element={<NewsOpen />} />

          {/* Info pages */}
          <Route path="/about" element={<About />} />
          <Route path="/about.html" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact.html" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/help.html" element={<Help />} />
          <Route path="/links" element={<Links />} />
          <Route path="/links.html" element={<Links />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/privacy.html" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms.html" element={<Terms />} />
          <Route path="/sarju" element={<Sarju />} />
          <Route path="/sarju.html" element={<Sarju />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
        <Toast msg={toast.msg} visible={toast.visible} />
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </BrowserRouter>
    </AppContext.Provider>
  )
}
