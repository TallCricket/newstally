// src/components/Toast.jsx
export default function Toast({ msg, visible }) {
  return (
    <div className="toast" style={{ opacity: visible ? 1 : 0, pointerEvents: 'none' }}>
      {msg}
    </div>
  )
}
