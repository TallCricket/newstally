// src/pages/Help.jsx
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { useState } from 'react'

const FAQS = [
  { q: 'How do I create an account?', a: 'Tap "Sign In" in the header, then click "Create Account". You can sign up with Google or email.' },
  { q: 'What is "Gati"?', a: 'Gati is our version of a "like" on Socialgati. Tap the heart button to give Gati to a post!' },
  { q: 'How do I repost news?', a: 'On any news card in NewsTally, tap "Repost" to share it to the Socialgati community feed.' },
  { q: 'How do I save articles?', a: 'Tap the bookmark icon on any news card to save it. Saved articles are stored locally on your device.' },
  { q: 'What is Sarju AI?', a: 'Sarju is our AI assistant powered by Claude. Ask it anything about news, your account, or get help with the platform.' },
  { q: 'How do I change the theme?', a: 'Tap the moon/sun icon in the header to toggle between light and dark mode.' },
  { q: 'How do I delete my account?', a: 'Go to Settings → Delete Account. This action is permanent and cannot be undone.' },
  { q: 'Is NewsTally free?', a: 'Yes! NewsTally and Socialgati are completely free to use.' },
]

export default function Help() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(null)
  return (
    <div className="main-wrapper">
      <div className="static-page">
        <button onClick={() => navigate(-1)} className="page-back-btn" style={{ marginBottom: 16 }}><i className="fas fa-arrow-left"></i></button>
        <h1>Help & FAQ</h1>
        <p>Find answers to common questions about NewsTally and Socialgati.</p>
        <div style={{ marginTop: 24 }}>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12, marginBottom: 10, overflow: 'hidden' }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--ink)', textAlign: 'left' }}>
                {faq.q}
                <i className={`fas fa-chevron-${open === i ? 'up' : 'down'}`} style={{ color: 'var(--muted)', fontSize: 12, flexShrink: 0, marginLeft: 12 }}></i>
              </button>
              {open === i && <div style={{ padding: '0 18px 16px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
        <div style={{ background: '#e8f0fe', borderRadius: 16, padding: 20, marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: '#1a73e8', fontWeight: 600, marginBottom: 8 }}>Still need help?</p>
          <a href="mailto:newstallyofficial@gmail.com" style={{ color: '#1a73e8', fontWeight: 700 }}>newstallyofficial@gmail.com</a>
        </div>
      </div>
      <Footer />
    </div>
  )
}
