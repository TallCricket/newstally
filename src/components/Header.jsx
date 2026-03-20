// src/components/Header.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../App'
import { LOGO } from '../utils/helpers'

export default function Header() {
  const { currentUser, isDark, toggleDark, openAuth } = useApp()
  const navigate = useNavigate()
  const loc = useLocation()

  const isSG = loc.pathname === '/' || loc.pathname.includes('socialgati')
  const isNews = loc.pathname.includes('newstally') || loc.pathname.includes('newsopen')

  return (
    <header className="app-header">
      {/* Logo */}
      <div className="logo" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
          <img src={LOGO} alt="NewsTally" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <span className="logo-text">
          {isNews ? 'NewsTally' : 'Socialgati'}
        </span>
      </div>

      {/* Desktop nav */}
      <nav className="header-nav">
        <button className={isNews ? 'active-nav' : ''} onClick={() => navigate('/newstally')}>
          <i className="fas fa-newspaper" style={{ marginRight: 4 }}></i>NewsTally
        </button>
        <button className={isSG ? 'active-nav' : ''} onClick={() => navigate('/')}>
          <i className="fas fa-bolt" style={{ marginRight: 4 }}></i>Socialgati
        </button>
        <button onClick={() => navigate('/sarju')}>
          <i className="fas fa-robot" style={{ marginRight: 4 }}></i>Sarju AI
        </button>
      </nav>

      {/* Actions */}
      <div className="header-actions">
        <button className="icon-btn" onClick={toggleDark} title="Toggle theme">
          <i className={`fas ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>

        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img
              src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'U')}&background=random`}
              alt="avatar"
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '2px solid #e8eaed', cursor: 'pointer' }}
              onClick={() => navigate('/socialgati')}
            />
          </div>
        ) : (
          <button className="btn-signin" onClick={openAuth}>Sign In</button>
        )}
      </div>
    </header>
  )
}
