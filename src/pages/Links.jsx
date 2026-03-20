// src/pages/Links.jsx
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
export default function Links() {
  const navigate = useNavigate()
  const allLinks = [
    { label: 'Socialgati Community', desc: 'India\'s news community', path: '/', icon: 'fa-bolt', color: '#9334e6' },
    { label: 'NewsTally News', desc: 'Latest headlines', path: '/newstally', icon: 'fa-newspaper', color: '#1a73e8' },
    { label: 'Sarju AI', desc: 'Smart news assistant', path: '/sarju', icon: 'fa-robot', color: '#9334e6' },
    { label: 'About NewsTally', desc: 'Our story', path: '/about', icon: 'fa-info-circle', color: '#1a73e8' },
    { label: 'Contact Us', desc: 'Get in touch', path: '/contact', icon: 'fa-envelope', color: '#34a853' },
    { label: 'Help & FAQ', desc: 'Support center', path: '/help', icon: 'fa-question-circle', color: '#f29900' },
    { label: 'Terms of Service', desc: 'Our terms', path: '/terms', icon: 'fa-file-contract', color: '#6366f1' },
    { label: 'Privacy Policy', desc: 'Your data privacy', path: '/privacy', icon: 'fa-shield-halved', color: '#10b981' },
  ]
  return (
    <div className="main-wrapper">
      <div className="static-page">
        <button onClick={() => navigate(-1)} className="page-back-btn" style={{ marginBottom: 16 }}><i className="fas fa-arrow-left"></i></button>
        <h1>All Links</h1>
        <p>Quick access to all NewsTally pages and resources.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
          {allLinks.map(l => (
            <div key={l.path} onClick={() => navigate(l.path)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 14, cursor: 'pointer', transition: 'background 0.2s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: l.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`fas ${l.icon}`} style={{ color: l.color, fontSize: 18 }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{l.label}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{l.desc}</div>
              </div>
              <i className="fas fa-chevron-right" style={{ color: 'var(--muted)', fontSize: 12 }}></i>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
