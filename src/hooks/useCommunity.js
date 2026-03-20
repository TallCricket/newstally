// src/hooks/useCommunity.js
import { useState, useEffect, useRef } from 'react'
import {
  collection, query, orderBy, limit, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs,
  serverTimestamp, arrayUnion, arrayRemove, increment, where
} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage, APP_ID } from '../firebase'

const POSTS_REF = (id) => doc(db, 'artifacts', APP_ID, 'public', 'data', 'reposts', id)
const POSTS_COL = collection(db, 'artifacts', APP_ID, 'public', 'data', 'reposts')

export function useCommunity(currentUser, showToast) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastDoc, setLastDoc] = useState(null)
  const unsubRef = useRef(null)

  useEffect(() => {
    loadFeed(true)
    return () => { if (unsubRef.current) unsubRef.current() }
  }, [])

  function loadFeed(reset = true) {
    if (reset && unsubRef.current) { unsubRef.current(); unsubRef.current = null }
    setLoading(reset)
    const q = query(POSTS_COL, orderBy('timestamp', 'desc'), limit(15))
    let firstLoad = true
    unsubRef.current = onSnapshot(q, (snap) => {
      if (firstLoad) {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }))
        setPosts(data)
        setLastDoc(snap.docs[snap.docs.length - 1] || null)
        setLoading(false)
        firstLoad = false
      } else {
        // Smart patch
        snap.docChanges().forEach(change => {
          const pid = change.doc.id
          const data = { id: pid, ...change.doc.data() }
          if (change.type === 'added') {
            setPosts(prev => prev.find(p => p.id === pid) ? prev : [data, ...prev])
          } else if (change.type === 'modified') {
            setPosts(prev => prev.map(p => p.id === pid ? data : p))
          } else if (change.type === 'removed') {
            setPosts(prev => prev.filter(p => p.id !== pid))
          }
        })
      }
    }, () => setLoading(false))
  }

  const loadMore = async () => {
    if (!lastDoc) return
    const { startAfter } = await import('firebase/firestore')
    const q = query(POSTS_COL, orderBy('timestamp', 'desc'), limit(10), startAfter(lastDoc))
    const snap = await getDocs(q)
    const more = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    setPosts(prev => [...prev, ...more.filter(p => !prev.find(x => x.id === p.id))])
    setLastDoc(snap.docs[snap.docs.length - 1] || lastDoc)
  }

  const toggleLike = async (postId) => {
    if (!currentUser) return showToast('Sign in to give Gati!')
    const post = posts.find(p => p.id === postId)
    if (!post) return
    const liked = (post.likes || []).includes(currentUser.uid)
    // Optimistic
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p, likes: liked
        ? (p.likes || []).filter(u => u !== currentUser.uid)
        : [...(p.likes || []), currentUser.uid]
    } : p))
    updateDoc(POSTS_REF(postId), {
      likes: liked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
    }).catch(() => loadFeed(true))
  }

  const toggleBookmark = async (postId) => {
    if (!currentUser) return showToast('Sign in to bookmark!')
    const saved = JSON.parse(localStorage.getItem('nt_sg_saved') || '[]')
    const isSaved = saved.includes(postId)
    const updated = isSaved ? saved.filter(x => x !== postId) : [...saved, postId]
    localStorage.setItem('nt_sg_saved', JSON.stringify(updated))
    showToast(isSaved ? 'Removed from bookmarks' : '🔖 Bookmarked!')
    updateDoc(doc(db, 'users', currentUser.uid), {
      savedPosts: isSaved ? arrayRemove(postId) : arrayUnion(postId)
    }).catch(() => {})
  }

  const submitTextPost = async (text) => {
    if (!currentUser) return showToast('Sign in to post!')
    if (!text.trim()) return showToast('Write something first!')
    const uSnap = await getDoc(doc(db, 'users', currentUser.uid)).catch(() => null)
    const uData = uSnap?.data() || {}
    await addDoc(POSTS_COL, {
      userId: currentUser.uid,
      username: uData.username || currentUser.displayName || 'User',
      userAvatar: currentUser.photoURL || '',
      headline: text.trim(),
      likes: [], commentsCount: 0,
      timestamp: serverTimestamp(),
      type: 'text'
    })
    showToast('Posted! ✅')
  }

  const submitRepost = async (newsItem) => {
    if (!currentUser) return showToast('Sign in to repost!')
    const uSnap = await getDoc(doc(db, 'users', currentUser.uid)).catch(() => null)
    const uData = uSnap?.data() || {}
    await addDoc(POSTS_COL, {
      userId: currentUser.uid,
      username: uData.username || currentUser.displayName || 'User',
      userAvatar: currentUser.photoURL || '',
      image: newsItem.image || '',
      headline: newsItem.title,
      newsUrl: newsItem.url || '',
      newsSource: newsItem.source || '',
      likes: [], commentsCount: 0,
      timestamp: serverTimestamp(),
      type: 'repost'
    })
    showToast('✅ Reposted to Socialgati!')
  }

  const deletePost = async (postId) => {
    await deleteDoc(POSTS_REF(postId))
    showToast('Post deleted')
  }

  return { posts, loading, loadMore, toggleLike, toggleBookmark, submitTextPost, submitRepost, deletePost, refresh: () => loadFeed(true) }
}
