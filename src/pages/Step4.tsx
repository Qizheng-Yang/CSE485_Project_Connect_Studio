import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import ProjectSaver from '../components/ProjectSaver';
import Gallery from '../components/Gallery';
import { useState } from 'react';

function Step4() {
  const [uploadLinkEnabled, setUploadLinkEnabled] = useState(false);
  const [shareableLink] = useState('https://mybabbostudio/NAME.com');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      alert('Link copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleEmailLink = () => {
    const subject = encodeURIComponent('Share Your Photos and Videos');
    const body = encodeURIComponent(`Please share your photos and videos using this link: ${shareableLink}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />
      <ProjectSaver />

      {/* Main Content */}
      <div className="main-content">
        {/* Photos Section */}
        <div className="photos-section">
          <h2>PHOTOS</h2>
          <p>If you would like your photos in a specific order please drag and drop them in the order you prefer.</p>
          <Gallery />
        </div>

        {/* Photo Gallery Link Section - Updated to match screenshot */}
        <div className="photo-gallery-link-section">
  <h3>PHOTO GALLERY LINK</h3>
  <p>Send this link to your family and friends and allow them to contribute Photos and Videos</p>
  
  <div className="toggle-switch-container">
    <label className="toggle-switch">
      <input 
        type="checkbox" 
        id="upload-toggle"
        checked={uploadLinkEnabled}
        onChange={(e) => setUploadLinkEnabled(e.target.checked)}
      />
      <span className="slider"></span>
    </label>
    <span className="toggle-text">Enable Upload Link</span>
  </div>

  <div className="link-and-buttons">
    <div className="link-box">
      <span>{shareableLink}</span>
    </div>
    <div className="action-buttons" style={{ opacity: uploadLinkEnabled ? 1 : 0.5 }}>
      <button 
        className="copy-button"
        onClick={handleCopyLink}
        disabled={!uploadLinkEnabled}
      >
        Copy
      </button>
      <button 
        className="email-button"
        onClick={handleEmailLink}
        disabled={!uploadLinkEnabled}
      >
        Email
      </button>
    </div>
  </div>
</div>

        {/* Navigation Buttons - Updated to match screenshot */}
        <div className="navigation-buttons">
          <Link to="/step/3">
            <button className="back-button">Back</button>
          </Link>
          <Link to="/step/5">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step4;
