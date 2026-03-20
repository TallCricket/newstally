// src/components/AuthModal.jsx
import { useState } from 'react'
import { useApp } from '../App'
import { useAuth } from '../hooks/useAuth'
import { LOGO } from '../utils/helpers'

export default function AuthModal({ onClose }) {
  const { showToast } = useApp()
  const [view, setView] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { signInWithGoogle, signInEmail, signUpEmail, authError } = useAuth(showToast, onClose)

  return (
    <div className="overlay-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="overlay-box">
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: '50%', background: 'var(--paper-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
          <i className="fas fa-times"></i>
        </button>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src={LOGO} alt="NewsTally" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 14px', display: 'block', boxShadow: '0 2px 12px rgba(26,115,232,0.25)' }} />
          <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 24, fontWeight: 400, color: '#202124' }}>
            {view === 'signin' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p style={{ fontSize: 14, color: '#5f6368', marginTop: 6 }}>
            {view === 'signin' ? 'Sign in to NewsTally' : 'Create your NewsTally account'}
          </p>
        </div>

        {/* Google button */}
        <button className="auth-google-btn" onClick={signInWithGoogle} style={{ marginBottom: 4 }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={20} height={20} alt="Google" />
          Continue with Google
        </button>

        <div className="auth-divider">or</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {view === 'signup' && (
            <input className="auth-input" type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          )}
          <input className="auth-input" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="auth-input" type="password" placeholder={view === 'signup' ? 'Password (6+ characters)' : 'Password'} value={password} onChange={e => setPassword(e.target.value)} required />

          {authError && <div style={{ color: '#ef4444', fontSize: 13, textAlign: 'center' }}>{authError}</div>}

          <button className="auth-submit" onClick={() => view === 'signin' ? signInEmail(email, password) : signUpEmail(name, email, password)}>
            {view === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 16 }}>
          {view === 'signin' ? "Don't have an account? " : 'Already have an account? '}
          <span className="auth-link" onClick={() => setView(view === 'signin' ? 'signup' : 'signin')}>
            {view === 'signin' ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  )
}
