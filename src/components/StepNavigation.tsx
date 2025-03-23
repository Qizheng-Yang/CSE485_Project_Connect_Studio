import { NavLink } from 'react-router-dom';
import cameraIcon from '../assets/cameraIcon.png';
import { useImage } from '../context/ImageContext';


const labels = [
  'Info',
  'Theme',
  'Title Slides',
  'Gallery',
  'Effects',
  'Music',
  'Preview',
  'Finalize',
];

function StepNavigation() {
  const { uploadedImage, intro, name } = useImage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
      {/* Image Placeholder and Text Section */}
      <div className="image-memory-section">
        <div 
          className="image-placeholder" 
          style={{ 
            position: 'relative',
            cursor: 'pointer',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: '#DDDDDD'
          }}
          // onClick={handleCameraClick}
        >
          {uploadedImage ? (
            <img 
              src={uploadedImage} 
              alt="Uploaded Memory" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }} 
            />
          ) : (
            <img src={cameraIcon} className="camera-icon" alt="Camera Icon" />
          )}
          
        </div>
        <span className="in-loving-memory">{intro}</span>
        <span className="in-loving-memory">{name}</span>
      </div>
      
      {/* Step Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num, index) => (
          <div
            key={num}
            style={{
              display: 'flex',
              flexDirection: 'column', 
              alignItems: 'center',
              marginBottom: '30px', 
              marginRight: '45px',
            }}
          >
            {/* Button */}
            <NavLink
              to={`/step/${num}`}
              className={({ isActive }) =>
                isActive ? 'step_buttons active' : 'step_buttons'
              }
            >
              {num}
            </NavLink>
            {/* Text Below Button */}
            <span
              style={{
                marginTop: '15px', 
                fontSize: '14px',
                color: '#929396',
                textAlign: 'center',
              }}
            >
              {labels[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StepNavigation;