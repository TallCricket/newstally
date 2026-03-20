// src/hooks/useNews.js
import { useState, useEffect, useCallback, useRef } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db, SHEET_ID, SHEETS_API_KEY, SHEET_NAME } from '../firebase'

const CACHE_KEY = 'nt_news_cache_v2'
const CACHE_TIME_KEY = 'nt_news_cache_time_v2'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function loadCache() {
  try {
    const ts = parseInt(localStorage.getItem(CACHE_TIME_KEY) || '0')
    if (!ts) return null
    if (Date.now() - ts >= CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY)
      localStorage.removeItem(CACHE_TIME_KEY)
      return null
    }
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? { data: JSON.parse(raw), ts } : null
  } catch { return null }
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data.slice(0, 100)))
    localStorage.setItem(CACHE_TIME_KEY, String(Date.now()))
  } catch { }
}

function normalizeDoc(d) {
  const n = d.data()
  return {
    id: n.id || d.id,
    title: n.title || n.headline || '',
    description: n.description || '',
    image: (n.image && n.image.startsWith('http')) ? n.image : '',
    category: n.category || 'General',
    source: n.source || 'NewsTally',
    date: n.date || n.savedAt || '',
    url: n.url || '#',
  }
}

export function useNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [searchQ, setSearchQ] = useState('')
  const initialized = useRef(false)

  const fetchFromFirestore = async (lim = 200) => {
    try {
      const snap = await getDocs(query(collection(db, 'news'), orderBy('savedAt', 'desc'), limit(lim)))
      if (!snap.empty) return snap.docs.map(normalizeDoc).filter(r => r.title)
    } catch { }
    // Fallback: no orderBy
    try {
      const snap = await getDocs(query(collection(db, 'news'), limit(lim)))
      if (!snap.empty) {
        const data = snap.docs.map(normalizeDoc).filter(r => r.title)
        data.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        return data
      }
    } catch { }
    return []
  }

  const fetchFromSheets = async () => {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${SHEETS_API_KEY}`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) throw new Error('Sheets ' + res.status)
    const json = await res.json()
    if (!json.values || json.values.length < 2) throw new Error('empty sheet')
    return json.values.slice(1).map((r, i) => ({
      id: r[0] || String(i),
      title: r[1] || '',
      source: r[2] || 'NewsTally',
      date: r[3] || '',
      description: r[4] || '',
      url: r[5] || '#',
      category: r[6] || 'General',
      image: (r[7] && r[7].startsWith('http')) ? r[7] : '',
    })).filter(r => r.title)
  }

  const loadNews = useCallback(async (force = false) => {
    if (!force) {
      const cached = loadCache()
      if (cached?.data?.length) {
        setNews(cached.data)
        setLoading(false)
        // stale → background refresh
        if (Date.now() - cached.ts >= CACHE_DURATION) {
          setTimeout(() => loadNews(true), 100)
        }
        return
      }
    }
    setLoading(true)
    try {
      // Fast: first 20
      const first20 = await fetchFromFirestore(20)
      if (first20.length) { setNews(first20); setLoading(false) }
      // Background: full 200
      fetchFromFirestore(200).then(all => {
        if (all.length > first20.length) { setNews(all); saveCache(all) }
        else saveCache(first20)
      })
    } catch {
      try {
        const sheets = await fetchFromSheets()
        setNews(sheets); saveCache(sheets)
      } catch { }
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      loadNews()
    }
  }, [loadNews])

  // Filtered + searched news
  const filteredNews = news.filter(n => {
    const matchCat = filter === 'All' || n.category === filter
    if (!searchQ.trim()) return matchCat
    const q = searchQ.toLowerCase()
    return matchCat && (
      n.title.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.category.toLowerCase().includes(q) ||
      n.source.toLowerCase().includes(q)
    )
  })

  const categories = ['All', ...new Set(news.map(n => n.category).filter(Boolean))].sort((a, b) =>
    a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)
  )

  return { news, filteredNews, loading, filter, setFilter, searchQ, setSearchQ, categories, refresh: () => loadNews(true) }
}
