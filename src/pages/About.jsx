// src/pages/About.jsx
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { LOGO } from '../utils/helpers'

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="main-wrapper">
      <div className="static-page">
        <button onClick={() => navigate(-1)} className="page-back-btn" style={{ marginBottom: 16 }}><i className="fas fa-arrow-left"></i></button>
        <div style={{ textAlign: 'center', padding: '24px 0 32px', background: 'linear-gradient(160deg,#e8f0fe,#f8f9fa)', borderRadius: 16, marginBottom: 24 }}>
          <img src={LOGO} alt="NewsTally" style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block', boxShadow: '0 4px 20px rgba(26,115,232,0.3)' }} />
          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 28, fontWeight: 400, color: '#202124', marginBottom: 6 }}>NewsTally</h1>
          <p style={{ fontSize: 15, color: '#5f6368' }}>Read. Repost. Connect.</p>
          <span style={{ display: 'inline-block', marginTop: 12, background: '#e8f0fe', color: '#1a73e8', fontSize: 11, fontWeight: 500, padding: '4px 14px', borderRadius: 99 }}>Version 2.0</span>
        </div>
        <p>NewsTally is your go-to platform for staying updated with the latest news, sharing opinions, and connecting with a community that cares about what's happening in the world.</p>
        <h2>Connect with us</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <a href="mailto:newstallyofficial@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 14, background: '#fce8e6', textDecoration: 'none' }}>
            <i className="fas fa-envelope" style={{ color: '#d93025', fontSize: 20 }}></i>
            <div><div style={{ fontSize: 14, fontWeight: 500, color: '#202124' }}>Email Us</div><div style={{ fontSize: 13, color: '#1a73e8' }}>newstallyofficial@gmail.com</div></div>
          </a>
          <a href="https://youtube.com/@newstallyofficial" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 14, background: '#f8f9fa', textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}><img src="https://i.postimg.cc/ry7xZZR0/You-Tube-full-color-icon-(2024).jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="YouTube" /></div>
            <div><div style={{ fontSize: 14, fontWeight: 500, color: '#202124' }}>YouTube</div><div style={{ fontSize: 13, color: '#5f6368' }}>@newstallyofficial</div></div>
          </a>
          <a href="https://instagram.com/newstallyofficial" target="_blank" rel="noopener" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 14, background: '#f8f9fa', textDecoration: 'none' }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}><img src="https://i.postimg.cc/sxMx4z46/Instagram-logo-2022-svg.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Instagram" /></div>
            <div><div style={{ fontSize: 14, fontWeight: 500, color: '#202124' }}>Instagram</div><div style={{ fontSize: 13, color: '#5f6368' }}>@newstallyofficial</div></div>
          </a>
        </div>
        <div style={{ textAlign: 'center', padding: '32px 0 20px' }}>
          <p style={{ fontSize: 12, color: '#9aa0a6' }}>© 2025 NewsTally · Made with ❤️ for news lovers</p>
        </div>
      </div>
      <Footer />
    </div>
  )
}
