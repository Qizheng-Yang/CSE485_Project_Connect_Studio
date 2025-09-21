// src/components/PhotoGalleryLink.tsx

import React, { useState } from 'react';
import { useImage } from '../context/ImageContext';
import ToggleSwitch from './ToggleSwitch';

const PhotoGalleryLink = () => {
  const { name, isLinkEnabled, setIsLinkEnabled } = useImage();
  const [isCopied, setIsCopied] = useState(false);

  // Generate a URL-friendly version of the name
  const tributeIdentifier = name ? name.toLowerCase().replace(/\s+/g, '-') : 'your-tribute';
  const uploadLink = `${window.location.origin}/contribute/${tributeIdentifier}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(uploadLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  };

  const handleEmail = () => {
    const subject = `Contribute photos to the tribute for ${name || 'our loved one'}`;
    const body = `Hi there,\n\nWe're creating a tribute video and would love for you to contribute your favorite photos and videos. Please use the link below to upload your memories:\n\n${uploadLink}\n\nThank you!`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="photo-gallery-link-section">
      <h3>PHOTO GALLERY LINK</h3>
      <p>Send this link to your family and friends and allow them to contribute Photos and Videos</p>
      
      <div className="link-controls-horizontal">
        <div className="toggle-container">
          <ToggleSwitch checked={isLinkEnabled} onChange={setIsLinkEnabled} />
          <span className="toggle-text">Enable Upload Link</span>
        </div>

        {isLinkEnabled && (
          <div className="right-section">
            <input 
              type="text" 
              className="link-box" 
              value={uploadLink} 
              readOnly 
            />
            <div className="action-buttons">
              <button className="copy-button" onClick={handleCopy}>
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
              <button className="email-button" onClick={handleEmail}>
                Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoGalleryLink;