import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import ProjectSaver from '../components/ProjectSaver';
import LoadingSpinner from '../components/LoadingSpinner';
import { uploadFile } from '../services/api';

import { useImage } from '../context/ImageContext';
import ToggleSwitch from '../components/ToggleSwitch';


import React, { useRef, useState } from 'react';

function Step1() {
  const fileInputRef = useRef<HTMLInputElement>(null); // Create a reference to the file input
  const { 
    setUploadedImage, 
    setIntro, 
    setName, 
    intro, 
    name,
    isLoading,
    setIsLoading,
    setError 
  } = useImage();
  
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setError(null);
      
      try {
        // Upload to server
        const uploadedFile = await uploadFile(file);
        const imageURL = `/uploads/${uploadedFile.filename}`;
        setUploadedImage(imageURL);
      } catch (error) {
        console.error('Upload failed:', error);
        setError('Failed to upload image. Please try again.');
        
        // Fallback to local preview
        const imageURL = URL.createObjectURL(file);
        setUploadedImage(imageURL);
      } finally {
        setIsUploading(false);
      }
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

  const isFormValid = name.trim().length > 0 && intro.trim().length > 0;

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />
      <ProjectSaver />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">MAIN INFORMATION</h2>

        {/* Upload Main Image Section */}
        <div className="upload-main-image-section">
          <h3 className="upload-main-image-header">UPLOAD MAIN IMAGE</h3>
          <div 
            className="upload-icon-container" 
            onClick={handleUploadClick} 
            style={{ 
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.6 : 1 
            }}
          >
            {/* File Input (Hidden) */}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              ref={fileInputRef}
              disabled={isUploading}
            />
            {/* Icon Placeholder */}
            <span className="upload-icon">
              {isUploading ? '⏳' : '✎'}
            </span>
          </div>
          {isUploading && <LoadingSpinner size="small" message="Uploading image..." />}
        </div>

        {/* Introductory Text Section */}
        <div className="introductory-text-section">
          <h3 className="introductory-text-header">INTRODUCTORY TEXT</h3>
          <input
            type="text"
            placeholder="Insert Intro"
            value={intro}
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
            value={name}
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
            <button 
              className="next-button"
              disabled={!isFormValid || isUploading}
              style={{
                opacity: (!isFormValid || isUploading) ? 0.6 : 1,
                cursor: (!isFormValid || isUploading) ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step1;


