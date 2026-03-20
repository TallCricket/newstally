// src/pages/Sarju.jsx
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'

const SARJU_RESPONSES = {
  default: "Namaste! Main Sarju hoon, NewsTally ka AI assistant. Aap mujhse news, account, ya platform ke baare mein kuch bhi pooch sakte hain! 😊",
  help: "Main aapki help kaise kar sakta hoon? Aap mujhse pooch sakte hain:\n• Latest news kaise dekhein\n• Account kaise banayein\n• Gati kya hota hai\n• Posts kaise karein\n• Settings ke baare mein",
  gati: "Gati humaara 'like' button hai Socialgati par! Jab aapko koi post pasand aaye, uske heart button par tap karein aur Gati de dein! 💙",
  signin: "Sign in karne ke liye header mein 'Sign In' button dabayein. Aap Google ya email se sign in kar sakte hain.",
  news: "NewsTally par latest news padhne ke liye bottom nav mein 'News' par tap karein. Aap categories se filter kar sakte hain aur articles save bhi kar sakte hain!",
  post: "Post karne ke liye pehle sign in karein, phir bottom nav mein pen icon par tap karein ya Socialgati feed ke upar 'Post' button use karein!",
  dark: "Dark mode ke liye header mein moon/sun icon par tap karein. Light aur dark theme ke beech switch hoga!",
  sarju: "Main Sarju hoon! NewsTally ka AI assistant. Main aapke sawaalon ka jawab dene ke liye hamesha tayyar hoon 🤖",
  repost: "News ko Socialgati par repost karne ke liye NewsTally news page par jaayein, kisi bhi news card par 'Repost' button dabayein. News community feed mein share ho jaayegi!",
  save: "Articles save karne ke liye news card par bookmark icon dabayein. Saved articles locally aapke device par store hote hain.",
  contact: "Humare saath sampark karne ke liye: newstallyofficial@gmail.com\nYa Instagram par: @newstallyofficial\nYa YouTube par: @newstallyofficial"
}

function getSarjuReply(msg) {
  const m = msg.toLowerCase()
  if (m.includes('gati')) return SARJU_RESPONSES.gati
  if (m.includes('sign') || m.includes('login') || m.includes('account')) return SARJU_RESPONSES.signin
  if (m.includes('news') || m.includes('article')) return SARJU_RESPONSES.news
  if (m.includes('post') || m.includes('share')) return SARJU_RESPONSES.post
  if (m.includes('dark') || m.includes('theme') || m.includes('mode')) return SARJU_RESPONSES.dark
  if (m.includes('repost')) return SARJU_RESPONSES.repost
  if (m.includes('save') || m.includes('bookmark')) return SARJU_RESPONSES.save
  if (m.includes('contact') || m.includes('email')) return SARJU_RESPONSES.contact
  if (m.includes('help') || m.includes('kya kar')) return SARJU_RESPONSES.help
  if (m.includes('sarju') || m.includes('tum kaun') || m.includes('you are')) return SARJU_RESPONSES.sarju
  return `Aapne pucha: "${msg}"\n\nMain is sawaal ka jawab dene ki koshish kar raha hoon! NewsTally ke baare mein kuch specific poochhein jaise news dekhna, post karna, ya account ke baare mein. Main zaroor help karunga! 😊`
}

export default function Sarju() {
  const navigate = useNavigate()
  const { currentUser } = useApp()
  const [messages, setMessages] = useState([
    { role: 'bot', text: SARJU_RESPONSES.default }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(m => [...m, { role: 'user', text: userMsg }])
    setTyping(true)
    setTimeout(() => {
      const reply = getSarjuReply(userMsg)
      setMessages(m => [...m, { role: 'bot', text: reply }])
      setTyping(false)
    }, 800 + Math.random() * 400)
  }

  const quickReplies = ['Gati kya hai?', 'News kaise dekhein?', 'Post kaise karein?', 'Sign in help']

  return (
    <div className="main-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100dvh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 56, zIndex: 30 }}>
        <button onClick={() => navigate(-1)} className="page-back-btn"><i className="fas fa-arrow-left"></i></button>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg,#9334e6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <i className="fas fa-robot" style={{ color: '#fff', fontSize: 18 }}></i>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0a0a14' }}>Sarju AI</div>
          <div style={{ fontSize: 11, color: '#34a853', fontWeight: 500 }}>● Online • NewsTally Assistant</div>
        </div>
      </div>

      {/* Messages */}
      <div className="sarju-container" style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 160px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
            {msg.role === 'bot' && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#9334e6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="fas fa-robot" style={{ color: '#fff', fontSize: 12 }}></i>
                </div>
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '18px 18px 18px 4px', fontSize: 14, lineHeight: 1.6, maxWidth: '80%', whiteSpace: 'pre-wrap', color: 'var(--ink)' }}>
                  {msg.text}
                </div>
              </div>
            )}
            {msg.role === 'user' && (
              <div style={{ background: '#9334e6', color: 'white', padding: '12px 16px', borderRadius: '18px 18px 4px 18px', fontSize: 14, lineHeight: 1.6, maxWidth: '80%' }}>
                {msg.text}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#9334e6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fas fa-robot" style={{ color: '#fff', fontSize: 12 }}></i>
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '18px 18px 18px 4px' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#9334e6', animation: `bounce 1.4s ease-in-out ${i * 0.2}s infinite` }}></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>

      {/* Quick replies */}
      <div style={{ position: 'fixed', bottom: 120, left: 0, right: 0, padding: '0 16px 8px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', background: 'transparent' }}>
        {quickReplies.map(q => (
          <button key={q} onClick={() => { setInput(q); setTimeout(send, 50) }} style={{ background: '#f0ebff', color: '#9334e6', border: '1px solid #c4a7f0', borderRadius: 99, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ position: 'fixed', bottom: 60, left: 0, right: 0, padding: '12px 16px', background: 'var(--paper)', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Kuch bhi poochho Sarju se..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          style={{ flex: 1, padding: '10px 16px', borderRadius: 99, border: '1.5px solid #e8eaed', background: 'var(--paper)', fontSize: 14, fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--ink)' }}
        />
        <button onClick={send} disabled={!input.trim()} style={{ width: 40, height: 40, borderRadius: '50%', background: input.trim() ? '#9334e6' : '#e8eaed', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', flexShrink: 0 }}>
          <i className="fas fa-paper-plane" style={{ color: input.trim() ? '#fff' : '#9aa0a6', fontSize: 14 }}></i>
        </button>
      </div>

      <style>{`@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`}</style>
    </div>
  )
}
