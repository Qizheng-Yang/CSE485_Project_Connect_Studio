import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useState, useEffect } from 'react';
import { getAudioDuration } from '../utils/audioUtils';
import { useImage } from '../context/ImageContext';
import { MediaItem } from '../context/ImageContext';


function Step4() {
  const { 
    mediaItems, 
    slides,
    setMediaItems, 
    uploadMusicFiles, 
    currentProject, 
    isLoading, 
    error 
  } = useImage();
  



  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [licenseAccepted, setLicenseAccepted] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  

  function parseDuration(val: string | number | undefined): number {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    if (typeof val === 'string' && val.includes(':')) {
      // handle "m:ss" strings
      const [min, sec] = val.split(':').map(Number);
      return (min * 60) + sec;
    }
    return Number(val) || 0;
  }
  
  
  let totalSeconds = 0;

  // Sum text slides
  if (slides) {
    totalSeconds += slides
      .filter(slide => slide.type === 'text')
      .reduce((sum: number, slide) => sum + parseDuration(slide.customDuration), 0);
  }
  
  // Sum photo/image slides (5 seconds each)
  totalSeconds += mediaItems
    .filter(item => item.type === 'image')
    .length * 5;
  
  // Sum video slides (parse string or number duration)
  totalSeconds += mediaItems
    .filter(item => item.type === 'video')
    .reduce((sum: number, item) => sum + parseDuration(item.duration), 0);
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedVidLength = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  



  // Get music files from mediaItems
  const musicFiles = mediaItems.filter(item => item.type === 'audio');
  
  // Convert music files to the format expected by the UI
  const uploadedMusic = musicFiles.map((file, index) => ({
    name: file.originalFilename || file.filename || 'Unknown',
    duration: file.duration || '0:00',
    selected: false,
    id: file.id
  }));

  // Calculate duration for music files that don't have it
  useEffect(() => {
    const calculateDurations = async () => {
      for (const file of musicFiles) {
        if (!file.duration || file.duration === '0:00') {
          try {
            // Create a temporary audio element to get duration
            const audio = new Audio(file.url);
            await new Promise((resolve, reject) => {
              audio.addEventListener('loadedmetadata', resolve);
              audio.addEventListener('error', reject);
            });
            
            const duration = Math.floor(audio.duration);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            const durationString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Update the media item with duration
            setMediaItems(prev => prev.map(item => 
              item.id === file.id ? { ...item, duration: durationString } : item
            ));
          } catch (error) {
            console.error('Error calculating duration for', file.filename, error);
          }
        }
      }
    };

    if (musicFiles.length > 0) {
      calculateDurations();
    }
  }, [musicFiles.length]); // Only run when number of music files changes

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
    // Note: Selection state would need to be managed separately in a full implementation
  };

  const handleCheckboxChange = (index: number) => {
    // For now, we'll just toggle the selection state
    // In a full implementation, you might want to store selected music in a separate state
    console.log('Music selection changed for index:', index);
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
      if (!currentProject) {
        alert('Please create a project first by going to Step 1');
        return;
      }

      try {
        // Upload files to backend
        const uploadedItems = await uploadMusicFiles(Array.from(files));
        console.log('Music files uploaded successfully:', uploadedItems);
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload music files. Please try again.');
      } finally {
        e.target.value = '';
      }
    }
  };

  const handleDeleteMusic = (index: number) => {
    const musicToDelete = musicFiles[index];
    if (musicToDelete) {
      // Remove from mediaItems
      const updatedMediaItems = mediaItems.filter(item => item.id !== musicToDelete.id);
      setMediaItems(updatedMediaItems);
    }
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
            Uploading music file...
          </div>
        )}

        {/* Show error if any */}
        {error && (
          <div style={{ 
            color: 'red', 
            fontSize: '14px', 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#ffebee', 
            borderRadius: '5px' 
          }}>
            {error}
          </div>
        )}
        
        {/* Show current project info */}
        {currentProject && (
          <div style={{ 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '10px',
            padding: '5px',
            backgroundColor: '#e8f5e8',
            borderRadius: '3px'
          }}>
            Project: {currentProject.title}
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
          <p className='small-text'>Video Length: {formattedVidLength}</p>
          <p className='small-text'>Slide Length: Loop OR Match to Video Length</p>
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