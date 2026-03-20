// src/pages/Socialgati.jsx
import { useState, useEffect } from 'react'
import { useApp } from '../App'
import { useCommunity } from '../hooks/useCommunity'
import { formatTimestamp, processText, LOGO } from '../utils/helpers'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db, APP_ID } from '../firebase'
import Footer from '../components/Footer'
import TextPostModal from '../components/TextPostModal'

export default function Socialgati() {
  const { currentUser, showToast, openAuth } = useApp()
  const { posts, loading, loadMore, toggleLike, toggleBookmark, submitTextPost, deletePost } = useCommunity(currentUser, showToast)
  const [trending, setTrending] = useState([])
  const [showPost, setShowPost] = useState(false)
  const [savedIds] = useState(() => JSON.parse(localStorage.getItem('nt_sg_saved') || '[]'))

  useEffect(() => {
    loadTrending()
  }, [])

  async function loadTrending() {
    try {
      const snap = await getDocs(query(collection(db, 'artifacts', APP_ID, 'public', 'data', 'reposts'), orderBy('timestamp', 'desc'), limit(30)))
      const tagCount = {}
      snap.docs.forEach(d => {
        const text = d.data().headline || ''
        const tags = text.match(/#[a-zA-Z0-9_]+/g) || []
        tags.forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1 })
      })
      const sorted = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([t]) => t)
      setTrending(sorted)
    } catch { }
  }

  return (
    <div className="main-wrapper" style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Topbar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '10px 16px', position: 'sticky', top: 56, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Georgia,serif', fontStyle: 'italic', color: '#0a0a14' }}>Socialgati</span>
          <span style={{ fontSize: 11, color: '#737373', marginLeft: 4 }}>by NewsTally</span>
        </div>
      </div>

      {/* Quick post bar */}
      {currentUser && (
        <div className="sg-quick-bar">
          <img src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.displayName || 'U')}&background=efefef`} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, cursor: 'pointer' }} alt="you" />
          <div className="sg-quick-input" onClick={() => setShowPost(true)}>What's on your mind?</div>
          <button onClick={() => setShowPost(true)} style={{ background: '#9334e6', borderRadius: 20, padding: '6px 14px', color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Post</button>
        </div>
      )}

      {/* Trending hashtags */}
      {trending.length > 0 && (
        <div className="sg-trending-wrap">
          <div style={{ fontSize: 11, fontWeight: 700, color: '#606060', marginBottom: 7, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <i className="fas fa-fire" style={{ color: '#ea4335' }}></i> Trending
          </div>
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
            {trending.map(tag => (
              <button key={tag} className="sg-hash-chip">{tag}</button>
            ))}
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="feed-container">
        {loading ? (
          [1, 2, 3].map(i => <SkeletonPost key={i} />)
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <i className="fas fa-bolt" style={{ fontSize: 36, color: '#9334e6', display: 'block', marginBottom: 12, opacity: 0.4 }}></i>
            <p style={{ fontSize: 16, fontWeight: 600 }}>Nothing here yet</p>
            <p style={{ fontSize: 13, marginTop: 6, color: '#606060' }}>Be the first to post on Socialgati!</p>
            {!currentUser && <button className="btn-signin" style={{ marginTop: 16, display: 'inline-block' }} onClick={openAuth}>Join Now</button>}
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={() => toggleLike(post.id)}
              onBookmark={() => toggleBookmark(post.id)}
              onDelete={() => deletePost(post.id)}
              isSaved={savedIds.includes(post.id)}
              showToast={showToast}
              openAuth={openAuth}
            />
          ))
        )}

        {/* Load more */}
        {posts.length >= 15 && (
          <div style={{ textAlign: 'center', padding: '16px 16px 24px' }}>
            <button className="btn-load-more" onClick={loadMore}>
              <i className="fas fa-rotate-right"></i> Load More
            </button>
          </div>
        )}
      </div>

      <Footer />
      {showPost && <TextPostModal onClose={() => setShowPost(false)} />}
    </div>
  )
}

function PostCard({ post, currentUser, onLike, onBookmark, onDelete, isSaved, showToast, openAuth }) {
  const liked = currentUser && (post.likes || []).includes(currentUser.uid)
  const likeCount = (post.likes || []).length
  const av = post.userAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent((post.username || 'U').substring(0, 2))}&background=4285f4&color=fff`

  const share = () => {
    const url = `${location.origin}/socialgati?postid=${post.id}`
    navigator.share?.({ title: `Post by @${post.username}`, url }).catch(() =>
      navigator.clipboard?.writeText(url).then(() => showToast('🔗 Link copied!'))
    ) || navigator.clipboard?.writeText(url).then(() => showToast('🔗 Link copied!'))
  }

  return (
    <article className="sg-post fade-up" id={`post-${post.id}`}>
      {/* Header */}
      <div className="sg-post-head" onClick={e => e.stopPropagation()}>
        <img src={av} className="sg-post-av" alt={post.username} onError={e => e.target.src = 'https://ui-avatars.com/api/?name=U&background=4285f4&color=fff'} />
        <div className="sg-post-meta" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <span className="sg-post-username">{post.username || 'User'}</span>
            {post.type === 'repost' && <span style={{ background: '#e6f4ea', color: '#1e7e34', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 3, marginLeft: 6 }}>↺ Repost</span>}
            {post.type === 'poll' && <span style={{ background: '#fff4cc', color: '#995500', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 3, marginLeft: 6 }}>📊 Poll</span>}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span className="sg-post-handle">@{post.username || 'user'}</span>
            <span style={{ color: '#dbdbdb' }}>·</span>
            <span className="sg-post-time">{formatTimestamp(post.timestamp)}</span>
          </div>
        </div>
        {currentUser?.uid === post.userId && (
          <button style={{ color: '#606060', padding: 4, borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15 }} onClick={() => { if (confirm('Delete this post?')) onDelete() }}>
            <i className="fas fa-ellipsis"></i>
          </button>
        )}
      </div>

      {/* Content */}
      {post.type === 'repost' ? (
        <>
          {post.headline && (
            <div className="sg-post-body" style={{ paddingBottom: 4 }}>
              <p className="sg-post-text" style={{ fontSize: 13, color: '#9aa0a6' }}>
                <i className="fas fa-retweet" style={{ color: '#34a853', marginRight: 4 }}></i>
                Reposted from <strong>{post.newsSource || 'NewsTally'}</strong>
              </p>
            </div>
          )}
          <div className="sg-repost-embed">
            {post.image && <img src={post.image} alt="news" loading="lazy" onError={e => e.target.style.display = 'none'} />}
            <div className="sg-repost-embed-body">
              <div className="sg-repost-source">📰 {post.newsSource || 'News'}</div>
              <div className="sg-repost-title">{post.headline || ''}</div>
            </div>
          </div>
        </>
      ) : post.type === 'poll' ? (
        <PollCard post={post} currentUser={currentUser} openAuth={openAuth} showToast={showToast} />
      ) : (
        <>
          {post.headline && (
            <div className="sg-post-body">
              <p className="sg-post-text">{processText(post.headline)}</p>
            </div>
          )}
          {post.image && (
            <div className="sg-post-image">
              <img src={post.image} loading="lazy" alt="post" onError={e => e.target.parentElement.style.display = 'none'} />
            </div>
          )}
        </>
      )}

      {/* Actions */}
      <div className="sg-post-actions" onClick={e => e.stopPropagation()}>
        <button className={`sg-action ${liked ? 'liked' : ''}`} onClick={!currentUser ? openAuth : onLike}>
          <i className={`${liked ? 'fas' : 'far'} fa-heart`}></i>
          <span>{likeCount ? `${likeCount} Gati` : 'Gati'}</span>
        </button>
        <button className="sg-action">
          <i className="far fa-comment"></i>
          <span>{post.commentsCount ? `${post.commentsCount} Comment` : 'Comment'}</span>
        </button>
        <button className="sg-action" onClick={share}>
          <i className="fas fa-share-nodes"></i>
        </button>
        <button className={`sg-action ${isSaved ? 'bookmarked' : ''}`} onClick={!currentUser ? openAuth : onBookmark}>
          <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i>
        </button>
      </div>
    </article>
  )
}

function PollCard({ post, currentUser, openAuth, showToast }) {
  const opts = post.pollOptions || []
  const total = opts.reduce((s, o) => s + (o.votes || 0), 0)
  const userVoted = opts.some(o => (o.voters || []).includes(currentUser?.uid))
  return (
    <div className="sg-poll">
      <div className="sg-poll-question">{post.headline || 'Vote below:'}</div>
      {opts.map((o, i) => {
        const pct = total ? Math.round((o.votes || 0) / total * 100) : 0
        const voted = (o.voters || []).includes(currentUser?.uid)
        return (
          <div key={i} className={`sg-poll-option ${voted ? 'voted' : ''}`} onClick={() => !currentUser ? openAuth() : showToast('Voting coming soon!')}>
            <div className="sg-poll-fill" style={{ width: userVoted ? pct + '%' : 0 }}></div>
            <span className="sg-poll-label">{o.text}</span>
            {userVoted && <span className="sg-poll-pct">{pct}%</span>}
          </div>
        )
      })}
      <div className="sg-poll-total" style={{ fontSize: 12, color: '#606060', marginTop: 4 }}>{total} vote{total !== 1 ? 's' : ''} · {userVoted ? 'Voted' : 'Tap to vote'}</div>
    </div>
  )
}

function SkeletonPost() {
  return (
    <div style={{ background: '#fff', padding: 14, marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }}></div>
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8, borderRadius: 4 }}></div>
          <div className="skeleton" style={{ height: 16, width: '90%', marginBottom: 6, borderRadius: 4 }}></div>
          <div className="skeleton" style={{ height: 16, width: '70%', borderRadius: 4 }}></div>
        </div>
      </div>
    </div>
  )
}
