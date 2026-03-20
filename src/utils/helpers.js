export function formatDate(str) {
  if (!str) return ''
  const d = new Date(str)
  if (isNaN(d)) return str
  const now = new Date()
  const diff = now - d
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago'
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago'
  if (diff < 604800000) return Math.floor(diff / 86400000) + 'd ago'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function formatTimestamp(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return formatDate(d.toISOString())
}

export function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return String(n || 0)
}

export function processText(text) {
  if (!text) return ''
  // Split on hashtags and mentions
  const parts = text.split(/(#\w+|@\w+)/g)
  return parts.map((part, i) => {
    if (part.startsWith('#')) return <span key={i} style={{ color: '#065fd4', fontWeight: 600 }}>{part}</span>
    if (part.startsWith('@')) return <span key={i} style={{ color: '#065fd4', fontWeight: 600 }}>{part}</span>
    return part
  })
}

export function getAvatar(user) {
  if (!user) return 'https://ui-avatars.com/api/?name=U&background=efefef'
  return user.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user.displayName || 'U')}`
}

export function buildShareUrl(item) {
  const base = window.location.origin + '/newstallyopen'
  const params = new URLSearchParams({
    nid: item.id || '',
    q: item.title || '',
    cat: item.category || '',
    src: item.source || ''
  })
  return `${base}?${params.toString()}`
}

export function shareViaWhatsApp(item) {
  const url = buildShareUrl(item)
  const desc = (item.description || '').substring(0, 100)
  const text = encodeURIComponent(`📰 *${item.title}*\n\n${desc}…\n\n🔗 ${url}\n\n_NewsTally_`)
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

export function shareViaTwitter(item) {
  const url = buildShareUrl(item)
  const text = encodeURIComponent(`📰 ${item.title}\n\nvia @newstallyofficial`)
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank')
}

export function shareViaTelegram(item) {
  const url = buildShareUrl(item)
  const text = encodeURIComponent(`📰 ${item.title}\n\nNewsTally`)
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, '_blank')
}

export function copyLink(url, showToast) {
  navigator.clipboard?.writeText(url)
    .then(() => showToast('🔗 Link copied!'))
    .catch(() => showToast('Copy: ' + url))
}

export const LOGO = 'https://i.postimg.cc/dLTgRxbL/cropped-circle-image.png'
