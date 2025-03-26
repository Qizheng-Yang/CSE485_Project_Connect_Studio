import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useState } from 'react';

// Sample theme images - replace with your actual image paths
const themeImages = [
  { id: 1, src: '/themes/theme1.png', alt: 'Theme 1' },
  { id: 2, src: '/themes/theme2.png', alt: 'Theme 2' },
  { id: 3, src: '/themes/theme3.png', alt: 'Theme 3' },
  { id: 4, src: '/themes/theme4.png', alt: 'Theme 4' },
  { id: 5, src: '/themes/theme5.png', alt: 'Theme 5' },
  { id: 6, src: '/themes/theme6.png', alt: 'Theme 6' },
  { id: 7, src: '/themes/theme7.png', alt: 'Theme 7' },
  { id: 8, src: '/themes/theme8.png', alt: 'Theme 8' },
  { id: 9, src: '/themes/theme9.png', alt: 'Theme 9' },
  { id: 10, src: '/themes/theme10.png', alt: 'Theme 10' },
  { id: 11, src: '/themes/theme11.png', alt: 'Theme 11' },
  { id: 12, src: '/themes/theme12.png', alt: 'Theme 12' },
];

function Step2() {
  const [selectedTheme, setSelectedTheme] = useState<number | null>(null);

  const handleThemeSelect = (themeId: number): void => {
    setSelectedTheme(themeId);
    localStorage.setItem('selectedTheme', themeId.toString());
  };

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">THEME</h2>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Step 2: Choose a Theme</h2>
          <p>Select a theme for your video.</p>
          
          {/* Theme Selection Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px', 
            margin: '30px auto',
            maxWidth: '800px'
          }}>
            {themeImages.map((theme) => (
              <div 
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                style={{
                  border: selectedTheme === theme.id ? '3px solid #4CAF50' : '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <img 
                  src={theme.src} 
                  alt={theme.alt}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '5px'
                  }}
                />
                <p style={{ marginTop: '8px' }}>{theme.alt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/step/1">
            <button className="back-button">Back</button>
          </Link>

          {/* Next Button */}
          <Link to="/step/3">
            <button 
              className="next-button"
              disabled={!selectedTheme}
              style={{ opacity: selectedTheme ? 1 : 0.5 }}
            >
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step2;
