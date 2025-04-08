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