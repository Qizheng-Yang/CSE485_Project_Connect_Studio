import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepNavigation from '../components/StepNavigation';

import React, { useRef } from 'react';

function Step1() {
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a reference to the file input

    const handleUploadClick = () => {
        fileInputRef.current?.click(); // Programmatically click the file input
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Handle the selected file here (e.g., display preview, upload to server)
            console.log('Selected file:', file);
            alert(`Selected file: ${file.name}`); // Simple alert for demonstration
        }
    };

  return (
    <div className="container">
      {/* Navbar */}
      <Navbar />

      {/* Step Navigation */}
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">MAIN INFORMATION</h2>

        {/* Upload Main Image Section */}
        <div className="upload-main-image-section">
          <h3 className="upload-main-image-header">UPLOAD MAIN IMAGE</h3>
          <div className="upload-icon-container" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
            {/* File Input (Hidden) */}
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileInputRef} // Assign the reference
            />
            {/* Icon Placeholder */}
            <span className="upload-icon">✎</span>
          </div>
        </div>

        {/* Introductory Text Section */}
        <div className="introductory-text-section">
          <h3 className="introductory-text-header">INTRODUCTORY TEXT</h3>
          <p className="introductory-text">In Loving Memory of</p>
        </div>

        {/* Title Section */}
        <div className="title-section">
          <h3 className="title-header">TITLE</h3>
          <input
            type="text"
            placeholder="Insert Name"
            className="title-input"
          />
        </div>

        {/* Toggle Switch Section */}
        <div className="toggle-switch-section">
          <label className="toggle-switch-label">
            Enable Full Access to Family
            <input type="checkbox" id="toggle-switch" className="toggle-switch-input" />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/create">
            <button className="back-button">Back</button>
          </Link>

          {/* Next Button */}
          <Link to="/step/2">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step1;