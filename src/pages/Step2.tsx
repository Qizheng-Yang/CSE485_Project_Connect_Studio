import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useState, useEffect } from 'react';

interface Theme {
  id: number;
  src: string;
  alt: string;
}

const themeImages: Theme[] = [
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
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);

  // Set first theme as default
  useEffect(() => {
    setSelectedTheme(themeImages[0]);
  }, []);

  const handleThemeSelect = (theme: Theme): void => {
    setSelectedTheme(theme);
    localStorage.setItem('selectedTheme', theme.id.toString());
  };

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      <div className="main-content">
        <h2 className="main-information-header">THEME</h2>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {/* Large preview of selected theme */}
          {selectedTheme && (
            <div style={{ 
              margin: '0 auto 30px', 
              maxWidth: '500px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              <img 
                src={selectedTheme.src} 
                alt={`Selected: ${selectedTheme.alt}`}
                style={{
                  width: '100%',
                  height: '250px',
                  objectFit: 'contain',
                  borderRadius: '4px'
                }}
              />
              <p style={{ 
                marginTop: '10px', 
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }}>
                {selectedTheme.alt}
              </p>
            </div>
          )}

          {/* 3x7 Grid of theme thumbnails */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
            maxWidth: '900px',
            margin: '0 auto 30px'
          }}>
            {themeImages.map((theme) => (
              <div 
                key={theme.id}
                onClick={() => handleThemeSelect(theme)}
                style={{
                  border: selectedTheme?.id === theme.id 
                    ? '3px solid #4CAF50' 
                    : '1px solid #ddd',
                  borderRadius: '6px',
                  padding: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fff'
                }}
              >
                <img 
                  src={theme.src} 
                  alt={theme.alt}
                  style={{
                    width: '100%',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '3px'
                  }}
                />
                <p style={{ 
                  margin: '5px 0 0',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {theme.alt}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="navigation-buttons" style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '20px 0'
          }}>
            <Link to="/step/1">
              <button className="back-button">Back</button>
            </Link>
            <Link to="/step/3">
              <button className="next-button">Next</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step2;