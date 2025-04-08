import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useState } from 'react';

function Step6() {
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [uploadedMusic, setUploadedMusic] = useState<{name: string, duration: string}[]>([]);

  const handleUploadClick = () => {
    setShowLicenseModal(true);
  };

  const handleAcceptLicense = () => {
    setShowLicenseModal(false);
    // Trigger file input click programmatically
    const fileInput = document.getElementById('music-upload') as HTMLInputElement;
    fileInput.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // In a real app, you would process the file and get its duration
      const newMusic = {
        name: file.name,
        duration: '2:30' // Placeholder - you'd calculate this in a real app
      };
      setUploadedMusic([...uploadedMusic, newMusic]);
    }
  };

  const handleDeleteMusic = (index: number) => {
    const updatedMusic = uploadedMusic.filter((_, i) => i !== index);
    setUploadedMusic(updatedMusic);
  };

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">MUSIC</h2>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p className='small-text'>Select or upload the music you would like in your video</p>
        </div>

        {/* Music Selection Buttons */}
        <div>
          <button  onClick={handleUploadClick}>
            Upload Music
          </button>
          <button>
            Select Music
          </button>
          <input 
            id="music-upload"
            type="file" 
            accept="audio/*" 
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>

        {/* Uploaded Music List */}
        {uploadedMusic.length > 0 && (
          <div className="uploaded-music-list">
            <h3>Added Songs</h3>
            {uploadedMusic.map((music, index) => (
              <div key={index} className="music-item">
                <span className="music-name">{music.name}</span>
                <span className="music-duration">{music.duration}</span>
                <button 
                  className="delete-button"
                  onClick={() => handleDeleteMusic(index)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        {/* License Modal */}
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
              <p>
                By selecting "Agree and Accept," you confirm that you have the proper licenses 
                for any music you upload to MyBabbo Inc.. You also agree to defend, indemnify, 
                and hold MyBabbo Inc., as well as its owners, employees, agents, successors, 
                and assigns, harmless from any third-party claims arising from a violation 
                of this confirmation.
              </p>
              <button 
                onClick={handleAcceptLicense}
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/step/5">
            <button className="back-button">Back</button>
          </Link>

          {/* Next Button */}
          <Link to="/step/7">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step6;