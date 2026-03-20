// src/pages/NewsOpen.jsx
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useNews } from '../hooks/useNews'
import { useApp } from '../App'
import { formatDate, buildShareUrl, shareViaWhatsApp, shareViaTwitter, shareViaTelegram, copyLink } from '../utils/helpers'
import Footer from '../components/Footer'

export default function NewsOpen() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { showToast } = useApp()
  const { news } = useNews()
  const [item, setItem] = useState(null)
  const [related, setRelated] = useState([])
  const [showShare, setShowShare] = useState(false)

  const nid = params.get('nid')
  const q = params.get('q')
  const cat = params.get('cat')

  useEffect(() => {
    if (!news.length) return
    let found = null
    if (nid) found = news.find(n => String(n.id) === String(nid))
    if (!found && q) {
      const qLow = decodeURIComponent(q).toLowerCase().substring(0, 60)
      found = news.find(n => (n.title || '').toLowerCase().includes(qLow))
    }
    if (!found && cat) {
      found = news.find(n => (n.category || '').toLowerCase() === decodeURIComponent(cat).toLowerCase())
    }
    if (found) {
      setItem(found)
      // Save to history
      const hist = JSON.parse(localStorage.getItem('nt_history') || '[]')
      const updated = [{ id: found.id, title: found.title, image: found.image, category: found.category, ts: Date.now() }, ...hist.filter(h => h.id !== found.id)].slice(0, 20)
      localStorage.setItem('nt_history', JSON.stringify(updated))
      // Related
      const rel = news.filter(n => n.id !== found.id && n.category === found.category).slice(0, 6)
      setRelated(rel)
    }
  }, [news, nid, q, cat])

  if (!item) {
    return (
      <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 16 }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: '#1a73e8' }}></i>
        <p style={{ color: 'var(--muted)' }}>Loading article...</p>
      </div>
    )
  }

  const shareUrl = buildShareUrl(item)

  return (
    <div className="main-wrapper">
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 0 80px' }}>
        {/* Back button */}
        <div style={{ padding: '16px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => navigate(-1)} className="page-back-btn">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="icon-btn" onClick={() => window.speechSynthesis?.speak(Object.assign(new SpeechSynthesisUtterance(`${item.title}. ${item.description || ''}`), { lang: 'en-IN' }))} title="Listen">
              <i className="fas fa-volume-up"></i>
            </button>
            <button className="icon-btn" onClick={() => setShowShare(true)} title="Share">
              <i className="fas fa-share-alt"></i>
            </button>
          </div>
        </div>

        {/* Article */}
        <article style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ background: '#e8f0fe', color: '#1a73e8', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.category}</span>
            <span style={{ fontSize: 11, color: '#9aa0a6' }}>{item.source}</span>
            <span style={{ fontSize: 11, color: '#9aa0a6' }}>·</span>
            <span style={{ fontSize: 11, color: '#9aa0a6' }}>{formatDate(item.date)}</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(20px, 5vw, 28px)', fontWeight: 700, lineHeight: 1.35, color: 'var(--ink)', marginBottom: 16, letterSpacing: '-0.3px' }}>
            {item.title}
          </h1>

          {item.image && (
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 20, background: '#f1f3f4' }}>
              <img src={item.image} alt={item.title} style={{ width: '100%', height: 'auto', maxHeight: 400, objectFit: 'cover', display: 'block' }} onError={e => e.target.style.display = 'none'} />
            </div>
          )}

          <div style={{ fontSize: 16, lineHeight: 1.8, color: '#3c4043', marginBottom: 24 }}>
            {item.description || 'No summary available for this article.'}
          </div>

          {item.url && item.url !== '#' && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1a73e8', color: 'white', padding: '12px 24px', borderRadius: 99, fontSize: 14, fontWeight: 600, textDecoration: 'none', marginBottom: 32 }}>
              <i className="fas fa-external-link-alt"></i> Read Full Article on {item.source}
            </a>
          )}

          {/* Share actions */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '16px 0', borderTop: '1px solid #f1f3f4', borderBottom: '1px solid #f1f3f4', marginBottom: 32 }}>
            <button onClick={() => shareViaWhatsApp(item)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#e6f9ee', color: '#25d366', border: 'none', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <i className="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button onClick={() => shareViaTwitter(item)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#f0f0f0', color: '#000', border: 'none', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <i className="fab fa-x-twitter"></i> Twitter
            </button>
            <button onClick={() => shareViaTelegram(item)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#e8f4fb', color: '#0088cc', border: 'none', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <i className="fab fa-telegram"></i> Telegram
            </button>
            <button onClick={() => copyLink(shareUrl, showToast)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#e8f0fe', color: '#1a73e8', border: 'none', borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              <i className="fas fa-link"></i> Copy Link
            </button>
          </div>
        </article>

        {/* Related articles */}
        {related.length > 0 && (
          <div style={{ padding: '0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 4, height: 22, background: '#1a73e8', borderRadius: 2 }}></div>
              <h3 style={{ fontSize: 16, fontWeight: 500, color: '#202124' }}>More like this</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {related.map(rel => (
                <div key={rel.id} onClick={() => navigate(`/newstallyopen?nid=${rel.id}&q=${encodeURIComponent(rel.title)}&cat=${encodeURIComponent(rel.category)}&src=${encodeURIComponent(rel.source)}`)}
                  style={{ display: 'flex', gap: 12, padding: 12, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 14, cursor: 'pointer' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: '#f1f3f4' }}>
                    <img src={rel.image || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} alt="" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#1a73e8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{rel.category}</span>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.45, margin: '3px 0 5px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rel.title}</p>
                    <div style={{ fontSize: 11, color: '#9aa0a6' }}>{rel.source} · {formatDate(rel.date)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Powered by Socialgati */}
        <div style={{ textAlign: 'center', padding: '20px 16px 40px' }}>
          <div onClick={() => navigate('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#f0ebff,#e8e0ff)', padding: '10px 20px', borderRadius: 99, cursor: 'pointer' }}>
            <i className="fas fa-bolt" style={{ color: '#9334e6', fontSize: 14 }}></i>
            <span style={{ fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg,#9334e6,#6d28d9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Join the conversation on Socialgati</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
