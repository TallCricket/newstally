// src/components/Footer.jsx
import { useNavigate } from 'react-router-dom'
import { LOGO } from '../utils/helpers'

export default function Footer() {
  const navigate = useNavigate()
  const links1 = [
    { label: 'Socialgati Feed', path: '/', icon: 'fa-bolt', color: '#9334e6' },
    { label: 'NewsTally News', path: '/newstally', icon: 'fa-newspaper', color: '#1a73e8' },
    { label: 'Sarju AI', path: '/sarju', icon: 'fa-robot', color: '#9334e6' },
  ]
  const links2 = [
    { label: 'About Us', path: '/about', icon: 'fa-info-circle', color: '#9334e6' },
    { label: 'Contact Us', path: '/contact', icon: 'fa-envelope', color: '#34a853' },
    { label: 'Help Center', path: '/help', icon: 'fa-question-circle', color: '#f29900' },
    { label: 'All Links', path: '/links', icon: 'fa-link', color: '#1a73e8' },
  ]

  return (
    <footer className="site-footer">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <img src={LOGO} alt="NewsTally" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(147,52,230,0.25)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#0a0a14', lineHeight: 1 }}>Socialgati</div>
            <div style={{ fontSize: 11, color: '#737373', marginTop: 2, fontWeight: 500 }}>by NewsTally · Read. Repost. Connect.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 0, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8e8e8e', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Explore</div>
            {links1.map(l => (
              <div key={l.path} onClick={() => navigate(l.path)} style={{ display: 'block', fontSize: 14, color: '#262626', padding: '3px 0', fontWeight: 500, cursor: 'pointer' }}>
                <i className={`fas ${l.icon}`} style={{ color: l.color, width: 16, fontSize: 12 }}></i> {l.label}
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#8e8e8e', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Support</div>
            {links2.map(l => (
              <div key={l.path} onClick={() => navigate(l.path)} style={{ display: 'block', fontSize: 14, color: '#262626', padding: '3px 0', fontWeight: 500, cursor: 'pointer' }}>
                <i className={`fas ${l.icon}`} style={{ color: l.color, width: 16, fontSize: 12 }}></i> {l.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
          {[{ label: 'Terms', path: '/terms' }, { label: 'Privacy', path: '/privacy' }, { label: 'About', path: '/about' }].map(l => (
            <span key={l.path} onClick={() => navigate(l.path)} style={{ fontSize: 12, color: '#737373', fontWeight: 500, cursor: 'pointer' }}>{l.label}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="https://youtube.com/@newstallyofficial" target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://i.postimg.cc/ry7xZZR0/You-Tube-full-color-icon-(2024).jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="YouTube" />
            </a>
            <a href="https://instagram.com/newstallyofficial" target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="https://i.postimg.cc/sxMx4z46/Instagram-logo-2022-svg.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Instagram" />
            </a>
          </div>
          <p style={{ fontSize: 12, color: '#9aa0a6', margin: 0 }}>© 2025 NewsTally. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
