import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import ProjectSaver from '../components/ProjectSaver';
import LoadingSpinner from '../components/LoadingSpinner';
import { useImage } from '../context/ImageContext';
import { uploadFile } from '../services/api';
import { useState } from 'react';

function Step6() {
  const { music, setMusic, setError } = useImage();
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseAccepted, setLicenseAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLength] = useState('5.25 minutes');
  const [slideLength] = useState('3.5 Seconds');
  const [showCheckboxes, setShowCheckboxes] = useState(false);

  const handleUploadClick = () => {
    if (licenseAccepted) {
      const fileInput = document.getElementById('music-upload') as HTMLInputElement;
      fileInput.click();
    } else {
      setShowLicenseModal(true);
    }
  };

  const handleSelectClick = () => {
    setShowCheckboxes(!showCheckboxes);
    if (!showCheckboxes) {
      // Reset selections when showing checkboxes
      setMusic(music.map(m => ({ ...m, selected: false })));
    }
  };

  const handleCheckboxChange = (index: number) => {
    const updatedMusic = [...music];
    updatedMusic[index].selected = !updatedMusic[index].selected;
    setMusic(updatedMusic);
  };

  const handleAcceptLicense = () => {
    setLicenseAccepted(true);
    setShowLicenseModal(false);
    const fileInput = document.getElementById('music-upload') as HTMLInputElement;
    fileInput.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsLoading(true);
      setError(null);
      
      try {
        const file = files[0];
        const uploadedFile = await uploadFile(file);
        
        // Add duration calculation here if needed
        const musicFile = {
          ...uploadedFile,
          duration: '0:00', // Placeholder - implement audio duration calculation
          selected: false
        };
        
        setMusic([...music, musicFile]);
      } catch (error) {
        console.error('Error uploading audio file:', error);
        setError('Failed to upload music file');
      } finally {
        setIsLoading(false);
        e.target.value = '';
      }
    }
  };

  const handleDeleteMusic = (index: number) => {
    const updatedMusic = music.filter((_, i) => i !== index);
    setMusic(updatedMusic);
  };

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />
      <ProjectSaver />

      <div className="main-content">
        <h2 className="main-information-header">MUSIC</h2>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p className='small-text'>Select or upload the music you would like in your video</p>
        </div>

        {/* Music Selection Buttons */}
        <div className="button-group">
          <button className="action-button" onClick={handleUploadClick}>
            Upload Music
          </button>
          <button 
            className={`action-button secondary ${showCheckboxes ? 'active' : ''}`}
            onClick={handleSelectClick}
          >
            {showCheckboxes ? 'Cancel Selection' : 'Select Music'}
          </button>
          <input 
            id="music-upload"
            type="file" 
            accept="audio/*" 
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>

        {isLoading && <LoadingSpinner message="Uploading music file..." />}

        {music.length > 0 && (
          <div className="uploaded-music-list">
            <p className='small-text-inside'>Added Songs</p>
            {music.map((musicFile, index) => (
              <div key={musicFile.id} className="music-item">
                
                <span className="music-name">{musicFile.originalName}</span>
                <span className="music-duration">{musicFile.duration || '0:00'}</span>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteMusic(index)}
                >
                  🗑️
                </button>
                {showCheckboxes && (
                  <input
                    type="checkbox"
                    checked={musicFile.selected || false}
                    onChange={() => handleCheckboxChange(index)}
                    className="music-checkbox"
                  />
                )}
                
              </div>
            ))}
          </div>
        )}
        <div className="length-info">
          <p className='small-text'>Video Length: {videoLength}</p>
          <p className='small-text'>Slide Length: Match to Music OR {slideLength}</p>
        </div>

        {showLicenseModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button 
                className="close-modal"
                onClick={() => setShowLicenseModal(false)}
              >
                ✕
              </button>
              <h3>Custom Music Licensing</h3>
              <p className="small-text">
                By selecting "Agree and Accept," you confirm that you have the proper licenses 
                for any music you upload to MyBabbo Inc.. You also agree to defend, indemnify, 
                and hold MyBabbo Inc., as well as its owners, employees, agents, successors, 
                and assigns, harmless from any third-party claims arising from a violation 
                of this confirmation.
              </p>
              <button 
                className="action-button"
                onClick={handleAcceptLicense}
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        )}

        <div className="navigation-buttons">
          <Link to="/step/5">
            <button className="back-button">Back</button>
          </Link>
          <Link to="/step/7">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step6;