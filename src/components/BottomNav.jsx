// src/components/BottomNav.jsx
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../App'
import { useState } from 'react'
import TextPostModal from './TextPostModal'

export default function BottomNav() {
  const navigate = useNavigate()
  const loc = useLocation()
  const { currentUser, openAuth } = useApp()
  const [showPost, setShowPost] = useState(false)
  const path = loc.pathname

  const navItems = [
    { id: 'home', icon: 'fa-bolt', label: 'Home', path: '/' },
    { id: 'news', icon: 'fa-newspaper', label: 'News', path: '/newstally' },
    null, // compose button
    { id: 'sarju', icon: 'fa-robot', label: 'Sarju', path: '/sarju' },
    { id: 'links', icon: 'fa-link', label: 'Links', path: '/links' },
  ]

  const isActive = (p) => {
    if (p === '/') return path === '/' || path.includes('socialgati')
    return path.startsWith(p.split('.')[0])
  }

  return (
    <>
      <nav className="bottom-nav">
        {navItems.map((item, i) => {
          if (item === null) return (
            <div key="compose" className="bottom-nav-btn" onClick={() => currentUser ? setShowPost(true) : openAuth()}>
              <div className="compose-btn-inner">
                <i className="fas fa-pen" style={{ fontSize: 18 }}></i>
              </div>
            </div>
          )
          return (
            <button
              key={item.id}
              className={`bottom-nav-btn ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <i className={`fas ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
      {showPost && <TextPostModal onClose={() => setShowPost(false)} />}
    </>
  )
}
