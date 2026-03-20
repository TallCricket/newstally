// src/pages/NewsTally.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../App'
import { useNews } from '../hooks/useNews'
import { formatDate, buildShareUrl } from '../utils/helpers'
import Footer from '../components/Footer'

const PAGE_SIZE = 9

export default function NewsTally() {
  const { showToast } = useApp()
  const { filteredNews, loading, filter, setFilter, searchQ, setSearchQ, categories, refresh } = useNews()
  const [displayed, setDisplayed] = useState(PAGE_SIZE)
  const navigate = useNavigate()

  const savedIds = JSON.parse(localStorage.getItem('nt_saved_news') || '[]')

  const toggleSave = (id, e) => {
    e.stopPropagation()
    const saved = JSON.parse(localStorage.getItem('nt_saved_news') || '[]')
    if (saved.includes(id)) {
      localStorage.setItem('nt_saved_news', JSON.stringify(saved.filter(x => x !== id)))
      showToast('Removed from saved')
    } else {
      localStorage.setItem('nt_saved_news', JSON.stringify([...saved, id]))
      showToast('Article saved!')
    }
  }

  const openArticle = (item) => {
    navigate(`/newstallyopen?nid=${encodeURIComponent(item.id)}&q=${encodeURIComponent(item.title || '')}&cat=${encodeURIComponent(item.category || '')}&src=${encodeURIComponent(item.source || '')}`)
  }

  const visibleNews = filteredNews.slice(0, displayed)

  return (
    <div className="main-wrapper">
      <div style={{ padding: '24px 16px 0' }}>
        {/* Hero Carousel */}
        {!loading && filteredNews.length > 0 && (
          <Carousel items={filteredNews.slice(0, 8)} onOpen={openArticle} />
        )}

        {/* Search bar */}
        <div style={{ padding: '16px 0 0', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)', color: '#9aa0a6', fontSize: 14, pointerEvents: 'none' }}></i>
            <input
              type="text"
              placeholder="Search news, topics, sources..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              style={{ width: '100%', padding: '11px 44px', border: '1.5px solid #e8eaed', borderRadius: 24, background: '#fff', fontSize: 14, color: '#202124', outline: 'none', fontFamily: 'var(--font-body)' }}
            />
            {searchQ && (
              <button onClick={() => setSearchQ('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: '#e8eaed', border: 'none', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#5f6368' }}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div style={{ padding: '16px 0 0', overflowX: 'auto', scrollbarWidth: 'none', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'inline-flex', gap: 8 }}>
            {categories.map(cat => (
              <button key={cat} className={`cat-btn ${filter === cat ? 'active' : ''}`} onClick={() => { setFilter(cat); setDisplayed(PAGE_SIZE) }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '24px 0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 4, height: 28, background: '#1a73e8', borderRadius: 2 }}></div>
            <h2 style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 500, color: '#202124' }}>
              {searchQ ? `Results for "${searchQ}"` : filter === 'All' ? 'Latest Headlines' : filter}
            </h2>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', fontFamily: 'monospace', background: 'var(--paper-2)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: 99 }}>
              {filteredNews.length}
            </span>
          </div>
          <button onClick={refresh} className="icon-btn" title="Refresh">
            <i className="fas fa-rotate-right"></i>
          </button>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="news-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 280, borderRadius: 16 }}></div>
            ))}
          </div>
        ) : filteredNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
            <i className="fas fa-newspaper" style={{ fontSize: 32, marginBottom: 12, display: 'block' }}></i>
            <p>No articles found</p>
          </div>
        ) : (
          <div className="news-grid">
            {visibleNews.map((item, idx) => (
              <NewsCard key={item.id} item={item} idx={idx} isSaved={savedIds.includes(item.id)} onOpen={() => openArticle(item)} onSave={e => toggleSave(item.id, e)} showToast={showToast} />
            ))}
          </div>
        )}

        {/* Load more */}
        {displayed < filteredNews.length && (
          <div style={{ textAlign: 'center', padding: '36px 0 20px' }}>
            <button className="btn-load-more" onClick={() => setDisplayed(d => d + PAGE_SIZE)}>
              <i className="fas fa-plus"></i> Load More
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

function NewsCard({ item, idx, isSaved, onOpen, onSave, showToast }) {
  const readMins = Math.max(1, Math.ceil(((item.title || '').length + (item.description || '').length) / 200))

  const share = (e) => {
    e.stopPropagation()
    const url = buildShareUrl(item)
    navigator.share?.({ title: item.title, url }).catch(() =>
      navigator.clipboard?.writeText(url).then(() => showToast('🔗 Link copied!'))
    ) || navigator.clipboard?.writeText(url).then(() => showToast('🔗 Link copied!'))
  }

  return (
    <article className="news-card" style={{ animationDelay: `${Math.min(idx * 0.04, 0.2)}s` }} onClick={onOpen}>
      <div className="news-card-img-wrapper" style={idx === 0 ? { aspectRatio: '21/9' } : {}}>
        <img
          src={item.image || ''}
          alt=""
          loading={idx < 3 ? 'eager' : 'lazy'}
          onLoad={e => e.target.classList.add('loaded')}
          onError={e => { e.target.classList.add('loaded'); e.target.style.display = 'none' }}
        />
        <span className="news-card-badge">{item.category}</span>
      </div>
      <div className="news-card-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <div className="news-card-category">{item.category}</div>
          <span style={{ fontSize: 11, color: '#9aa0a6', fontFamily: 'monospace', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <i className="far fa-clock" style={{ fontSize: 10 }}></i>{readMins} min
          </span>
        </div>
        <h3 className="news-card-title">{item.title}</h3>
        {item.description && (
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.description}
          </p>
        )}
        <div className="news-card-meta">
          <span style={{ fontWeight: 400, fontSize: 11, color: '#5f6368', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{item.source}</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: 11 }}>{formatDate(item.date)}</span>
        </div>
      </div>
      <div className="news-card-actions" onClick={e => e.stopPropagation()}>
        <button className={`nc-action-btn ${isSaved ? 'saved' : ''}`} onClick={onSave}>
          <i className={`${isSaved ? 'fas' : 'far'} fa-bookmark`}></i> {isSaved ? 'Saved' : 'Save'}
        </button>
        <button className="nc-action-btn" onClick={share}>
          <i className="fas fa-share-alt"></i> Share
        </button>
      </div>
    </article>
  )
}

function Carousel({ items, onOpen }) {
  const [idx, setIdx] = useState(0)
  const prev = () => setIdx(i => (i - 1 + items.length) % items.length)
  const next = () => setIdx(i => (i + 1) % items.length)
  const item = items[idx]

  return (
    <div className="carousel-wrapper" style={{ marginBottom: 0 }}>
      <div style={{ height: '100%', position: 'relative', cursor: 'pointer' }} onClick={() => onOpen(item)}>
        <img src={item.image || ''} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.background = 'linear-gradient(135deg,#1a73e8,#4285f4)'} />
        <div className="carousel-overlay"></div>
        <div className="carousel-content">
          <span className="carousel-category">{item.category}</span>
          <h2 className="carousel-title">{item.title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, opacity: 0.75, color: 'white' }}>
            <span>{item.source}</span>
            <span>{formatDate(item.date)}</span>
          </div>
        </div>
      </div>
      <button className="carousel-nav" style={{ left: 14 }} onClick={e => { e.stopPropagation(); prev() }}><i className="fas fa-chevron-left"></i></button>
      <button className="carousel-nav" style={{ right: 14 }} onClick={e => { e.stopPropagation(); next() }}><i className="fas fa-chevron-right"></i></button>
      <div style={{ position: 'absolute', bottom: 14, right: 28, display: 'flex', gap: 6, zIndex: 5 }}>
        {items.map((_, i) => (
          <div key={i} onClick={e => { e.stopPropagation(); setIdx(i) }} style={{ width: i === idx ? 20 : 6, height: 6, borderRadius: 99, background: i === idx ? 'white' : 'rgba(255,255,255,0.4)', transition: 'all 0.3s', cursor: 'pointer' }}></div>
        ))}
      </div>
    </div>
  )
}
