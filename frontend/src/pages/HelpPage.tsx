import React, { useState } from 'react';
import { HelpCircle, Search, Mail, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import './HelpPage.css';

const faqs = [
  {
    q: "How do I upload a video?",
    a: "Click on the 'Upload' button in the top navigation bar. You can then drag and drop your video file or click to browse your computer. Make sure your video meets our content guidelines."
  },
  {
    q: "How can I monetize my channel?",
    a: "To apply for the Streamify Partner Program, you need at least 1,000 subscribers and 4,000 valid public watch hours in the last 12 months. Once eligible, you can apply from the Creator Studio."
  },
  {
    q: "How do I edit my profile?",
    a: "Go to your Profile page by clicking on your avatar in the top right corner, then click on the 'Edit Profile' button. You can update your avatar, banner, bio, and social links there."
  },
  {
    q: "Can I make a playlist private?",
    a: "Yes. When creating or editing a playlist, you can set the privacy to Public, Unlisted, or Private. Private playlists are only visible to you."
  },
  {
    q: "How do I report inappropriate content?",
    a: "Click the three dots (...) under the video player and select 'Report'. Choose the reason that best describes the issue. Our moderation team will review it shortly."
  }
];

const HelpPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="help-page page-container">
      {/* Hero Section */}
      <div className="help-hero">
        <HelpCircle size={48} className="help-hero-icon" />
        <h1>How can we help you?</h1>
        <div className="help-search-wrap">
          <Search size={20} className="search-icon" />
          <input type="text" className="help-search" placeholder="Describe your issue..." />
        </div>
      </div>

      <div className="help-content">
        {/* FAQs */}
        <div className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className={`faq-item ${openFaq === i ? 'open' : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="faq-question">
                  <h3>{faq.q}</h3>
                  {openFaq === i ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {openFaq === i && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="support-section">
          <h2>Still need help?</h2>
          <p>If you couldn't find the answer to your question, our support team is here to help.</p>
          
          <div className="contact-cards">
            <div className="contact-card">
              <div className="contact-icon"><Mail size={24} /></div>
              <h3>Email Support</h3>
              <p>Send us an email and we'll get back to you within 24 hours.</p>
              <button className="btn btn-secondary">Contact Us</button>
            </div>
            
            <div className="contact-card">
              <div className="contact-icon"><MessageSquare size={24} /></div>
              <h3>Live Chat</h3>
              <p>Chat with our support team in real-time. Available 24/7.</p>
              <button className="btn btn-primary">Start Chat</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
