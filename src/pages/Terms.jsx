// src/pages/Terms.jsx
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
export default function Terms() {
  const navigate = useNavigate()
  return (
    <div className="main-wrapper">
      <div className="static-page">
        <button onClick={() => navigate(-1)} className="page-back-btn" style={{ marginBottom: 16 }}><i className="fas fa-arrow-left"></i></button>
        <h1>Terms of Service</h1>
        <p><em>Last updated: January 2025</em></p>
        <h2>Acceptance of Terms</h2>
        <p>By using NewsTally and Socialgati, you agree to these Terms of Service. If you do not agree, please do not use our services.</p>
        <h2>User Accounts</h2>
        <p>You must be 13 years or older to create an account. You are responsible for maintaining the security of your account and all activities that occur under your account.</p>
        <h2>Content Policy</h2>
        <p>You agree not to post content that is illegal, abusive, harassing, or violates others' rights. NewsTally reserves the right to remove any content that violates these guidelines and suspend accounts that repeatedly violate our policies.</p>
        <h2>Intellectual Property</h2>
        <p>News content is aggregated from third-party sources. Original community posts remain the property of their creators. By posting, you grant NewsTally a non-exclusive license to display your content.</p>
        <h2>Disclaimers</h2>
        <p>NewsTally provides news content for informational purposes only. We do not guarantee the accuracy of third-party news sources. Community posts represent the views of individual users, not NewsTally.</p>
        <h2>Limitation of Liability</h2>
        <p>NewsTally shall not be liable for any indirect or consequential damages arising from your use of the platform.</p>
        <h2>Changes to Terms</h2>
        <p>We may update these Terms from time to time. Continued use of the platform after changes constitutes acceptance of the new Terms.</p>
        <h2>Contact</h2>
        <p>Questions? Email us at <a href="mailto:newstallyofficial@gmail.com" style={{ color: '#1a73e8' }}>newstallyofficial@gmail.com</a></p>
      </div>
      <Footer />
    </div>
  )
}
