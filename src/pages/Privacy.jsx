// src/pages/Privacy.jsx
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
export default function Privacy() {
  const navigate = useNavigate()
  return (
    <div className="main-wrapper">
      <div className="static-page">
        <button onClick={() => navigate(-1)} className="page-back-btn" style={{ marginBottom: 16 }}><i className="fas fa-arrow-left"></i></button>
        <h1>Privacy Policy</h1>
        <p><em>Last updated: January 2025</em></p>
        <h2>Information We Collect</h2>
        <p>When you create an account, we collect your name, email address, and profile picture (if using Google Sign-In). We also collect content you post on Socialgati and your reading preferences.</p>
        <h2>How We Use Your Information</h2>
        <p>Your information is used to provide and improve our services, personalize your news feed, send notifications (if enabled), and ensure platform safety.</p>
        <h2>Data Storage</h2>
        <p>Your data is securely stored using Firebase (Google Cloud). We do not sell your personal data to third parties.</p>
        <h2>Cookies & Local Storage</h2>
        <p>We use browser local storage to cache news data, save your preferences (dark mode, saved articles), and improve load times.</p>
        <h2>Third-Party Services</h2>
        <p>We use Firebase (authentication and database), Google Analytics (anonymous usage data), and Google Sheets API (news content delivery).</p>
        <h2>Your Rights</h2>
        <p>You can delete your account at any time from Settings → Delete Account. This will permanently remove your posts and profile data.</p>
        <h2>Contact</h2>
        <p>For privacy concerns, email us at <a href="mailto:newstallyofficial@gmail.com" style={{ color: '#1a73e8' }}>newstallyofficial@gmail.com</a></p>
      </div>
      <Footer />
    </div>
  )
}
