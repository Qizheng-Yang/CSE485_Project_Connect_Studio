import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';

import { useImage } from '../context/ImageContext';
import ToggleSwitch from '../components/ToggleSwitch';


import React, { useRef, useState } from 'react';

function Step1() {
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a reference to the file input
    const { setUploadedImage, setIntro, setName } = useImage(); 

    const handleUploadClick = () => {
        fileInputRef.current?.click(); // Programmatically click the file input
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {

            const imageURL = URL.createObjectURL(file);
            setUploadedImage(imageURL);

        }
    };

    const handleIntroChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setIntro(event.target.value);
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    };

    // Toggle
    const [fullAccessEnabled, setFullAccessEnabled] = useState(false);
    const handleToggleChange = (checked: boolean) => {
      setFullAccessEnabled(checked);
    };

  return (
    <div className="container">

      <NavbarBabbo />
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
          <input
            type="text"
            placeholder="Insert Intro"
            defaultValue="In Loving Memory of"
            className="introductory-input"
            onChange={handleIntroChange} 
          />

        </div>

        {/* Title Section */}
        <div className="title-section">
          <h3 className="title-header">TITLE</h3>
          <input
            type="text"
            placeholder="Insert Name"
            className="title-input"
            onChange={handleNameChange} 
          />
        </div>

        {/* Toggle Switch Section */}
        <div className="toggle-switch-section">
          <label className="toggle-switch-label">
            <ToggleSwitch checked={fullAccessEnabled} onChange={handleToggleChange} />
            <div className="toggle-switch-text">Enable Full Access to Family</div>
          </label>
        </div>


        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/">
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


