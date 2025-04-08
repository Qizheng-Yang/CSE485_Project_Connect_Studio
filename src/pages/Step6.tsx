import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useState } from 'react';
import { getAudioDuration } from '../utils/audioUtils';

function Step6() {
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [uploadedMusic, setUploadedMusic] = useState<{name: string, duration: string, selected: boolean}[]>([]);
  const [licenseAccepted, setLicenseAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoLength] = useState('5.25 minutes');
  const [slideLength] = useState('3.5 Seconds');
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  // const [selectedMusic, setSelectedMusic] = useState<number[]>([]);

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
      // When showing checkboxes, reset all selections
      setUploadedMusic(uploadedMusic.map(music => ({...music, selected: false})));
    }
  };

  const handleCheckboxChange = (index: number) => {
    const updatedMusic = [...uploadedMusic];
    updatedMusic[index].selected = !updatedMusic[index].selected;
    setUploadedMusic(updatedMusic);
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
      try {
        const file = files[0];
        const duration = await getAudioDuration(file);
        const newMusic = {
          name: file.name,
          duration: duration,
          selected: false
        };
        setUploadedMusic([...uploadedMusic, newMusic]);
      } catch (error) {
        console.error('Error processing audio file:', error);
      } finally {
        setIsLoading(false);
        e.target.value = '';
      }
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

        

        {isLoading && (
          <div className="loading-indicator">
            Processing audio file...
          </div>
        )}

        {uploadedMusic.length > 0 && (
          <div className="uploaded-music-list">
            <p className='small-text-inside'>Added Songs</p>
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
                {showCheckboxes && (
                  <input
                    type="checkbox"
                    checked={music.selected}
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