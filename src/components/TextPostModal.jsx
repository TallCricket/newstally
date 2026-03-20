// src/components/TextPostModal.jsx
import { useState } from 'react'
import { useApp } from '../App'
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { db, APP_ID } from '../firebase'

const TAGS = ['#Politics', '#Sports', '#Tech', '#Entertainment', '#Opinion', '#Business']

export default function TextPostModal({ onClose }) {
  const { currentUser, showToast } = useApp()
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  const submit = async () => {
    if (!text.trim()) return showToast('Write something first!')
    setPosting(true)
    try {
      const uSnap = await getDoc(doc(db, 'users', currentUser.uid)).catch(() => null)
      const uData = uSnap?.data() || {}
      await addDoc(collection(db, 'artifacts', APP_ID, 'public', 'data', 'reposts'), {
        userId: currentUser.uid,
        username: uData.username || currentUser.displayName || 'User',
        userAvatar: currentUser.photoURL || '',
        headline: text.trim(),
        likes: [], commentsCount: 0,
        timestamp: serverTimestamp(),
        type: 'text'
      })
      showToast('Posted! ✅')
      onClose()
    } catch {
      showToast('Failed to post. Try again.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="modal-layer open" style={{ background: 'var(--card-bg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
        <button onClick={onClose} style={{ fontSize: 15, fontWeight: 400, color: 'var(--ink)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>Cancel</button>
        <button onClick={submit} disabled={posting} style={{ background: '#9334e6', color: '#fff', border: 'none', padding: '7px 20px', borderRadius: 20, fontSize: 14, fontWeight: 700, cursor: 'pointer', opacity: posting ? 0.6 : 1 }}>
          {posting ? 'Posting...' : 'Post'}
        </button>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 16, flex: 1 }}>
        <img
          src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.displayName || 'U')}&background=random`}
          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          alt="avatar"
        />
        <div style={{ flex: 1 }}>
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={e => setText(e.target.value)}
            maxLength={500}
            rows={6}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', fontSize: 16, lineHeight: 1.6, fontFamily: 'var(--font-body)', color: 'var(--ink)', minHeight: 140, display: 'block' }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TAGS.map(tag => (
                <span key={tag} onClick={() => setText(t => t + ' ' + tag)} style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: 99, background: '#e8f0fe', color: '#1a73e8', fontSize: 12, fontWeight: 600, cursor: 'pointer', border: '1px solid #c5d5f5' }}>
                  {tag}
                </span>
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#737373' }}>{500 - text.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
