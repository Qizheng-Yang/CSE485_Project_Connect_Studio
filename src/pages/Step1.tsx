import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';

import { useImage } from '../context/ImageContext';
import { useAuth } from '../context/AuthContext';
import ToggleSwitch from '../components/ToggleSwitch';

import React, { useRef, useState } from 'react';

function Step1() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    uploadedImage, 
    setUploadedImage, 
    setIntro, 
    setName, 
    uploadMainImage, 
    createProject,
    currentProject,
    updateProject,
    isLoading, 
    error 
  } = useImage();
  const { isAuthenticated } = useAuth();

  const [fullAccessEnabled, setFullAccessEnabled] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      alert('Please log in first to upload images');
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Upload to backend
      const imageUrl = await uploadMainImage(file);
      
      if (imageUrl) {
        setUploadedImage(imageUrl);
        console.log('Image uploaded successfully:', imageUrl);
      } else {
        alert('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleIntroChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIntro = event.target.value;
    setIntro(newIntro);
    
    // Create or update project
    if (currentProject) {
      try {
        await updateProject({ intro_text: newIntro });
      } catch (error) {
        console.error('Failed to update intro:', error);
      }
    } else if (isAuthenticated && newIntro) {
      // Auto-create project when user starts entering data
      try {
        await createProject('Untitled Project', newIntro);
      } catch (error) {
        console.error('Failed to create project:', error);
      }
    }
  };

  const handleNameChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setName(newName);
    
    // Create or update project
    if (currentProject) {
      try {
        await updateProject({ title: newName });
      } catch (error) {
        console.error('Failed to update title:', error);
      }
    } else if (isAuthenticated && newName) {
      // Auto-create project when user starts entering data
      try {
        await createProject(newName, 'In Loving Memory of');
      } catch (error) {
        console.error('Failed to create project:', error);
      }
    }
  };

  const handleToggleChange = async (checked: boolean) => {
    setFullAccessEnabled(checked);
    
    // Update project if it exists
    if (currentProject) {
      try {
        await updateProject({ full_access_enabled: checked });
      } catch (error) {
        console.error('Failed to update access setting:', error);
      }
    }
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
          <div className="upload-icon-container" onClick={handleUploadClick} style={{ 
            cursor: uploading || !isAuthenticated ? 'not-allowed' : 'pointer',
            opacity: uploading || !isAuthenticated ? 0.5 : 1
          }}>
            {/* File Input (Hidden) */}
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                ref={fileInputRef}
                disabled={uploading || !isAuthenticated}
            />
            {/* Icon Placeholder - keep original styling */}
            {uploading ? (
              <span className="upload-icon">⏳</span>
            ) : (
              <span className="upload-icon">✎</span>
            )}
          </div>
          
          {/* Show uploaded image preview below the icon */}
          {uploadedImage && (
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <img 
                src={uploadedImage} 
                alt="Uploaded main image" 
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  border: '2px solid #b2cc55'
                }} 
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                Main image uploaded ✓
              </div>
            </div>
          )}
          
          {/* Status messages */}
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            {uploading ? (
              <div style={{ fontSize: '12px', color: '#666' }}>
                Uploading image...
              </div>
            ) : !isAuthenticated ? (
              <div style={{ fontSize: '12px', color: '#999' }}>
                Please log in first
              </div>
            ) : !uploadedImage ? (
              <div style={{ fontSize: '12px', color: '#666' }}>
                Click to upload image
              </div>
            ) : null}
          </div>
          
          {/* Show error if any */}
          {error && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              {error}
            </div>
          )}
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


