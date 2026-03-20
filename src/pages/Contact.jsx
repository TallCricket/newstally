// src/pages/Contact.jsx
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
export default function Contact() {
  const navigate = useNavigate()
  return (
    <div className="main-wrapper">
      <div className="static-page">
        <button onClick={() => navigate(-1)} className="page-back-btn" style={{ marginBottom: 16 }}><i className="fas fa-arrow-left"></i></button>
        <h1>Contact Us</h1>
        <p>Have questions, feedback, or want to collaborate? We'd love to hear from you!</p>
        <h2>Email</h2>
        <p><a href="mailto:newstallyofficial@gmail.com" style={{ color: '#1a73e8' }}>newstallyofficial@gmail.com</a></p>
        <h2>Social Media</h2>
        <p>
          <a href="https://youtube.com/@newstallyofficial" target="_blank" rel="noopener" style={{ color: '#1a73e8', display: 'block', marginBottom: 8 }}>
            <i className="fab fa-youtube" style={{ marginRight: 8 }}></i> YouTube: @newstallyofficial
          </a>
          <a href="https://instagram.com/newstallyofficial" target="_blank" rel="noopener" style={{ color: '#1a73e8', display: 'block' }}>
            <i className="fab fa-instagram" style={{ marginRight: 8 }}></i> Instagram: @newstallyofficial
          </a>
        </p>
        <h2>Response Time</h2>
        <p>We typically respond within 24–48 hours on business days. For urgent matters, please email us directly.</p>
        <p style={{ marginTop: 24, fontSize: 12, color: '#9aa0a6' }}>© 2025 NewsTally. All rights reserved.</p>
      </div>
      <Footer />
    </div>
  )
}
