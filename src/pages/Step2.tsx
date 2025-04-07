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
  { id: 13, src: '/themes/theme13.png', alt: 'Theme 13' },
  { id: 14, src: '/themes/theme14.png', alt: 'Theme 14' },
  { id: 15, src: '/themes/theme15.png', alt: 'Theme 15' },
  { id: 16, src: '/themes/theme16.png', alt: 'Theme 16' },
  { id: 17, src: '/themes/theme17.png', alt: 'Theme 17' },
  // { id: 18, src: '/themes/theme18.png', alt: 'Theme 18' },
  // { id: 19, src: '/themes/theme19.png', alt: 'Theme 19' },
  // { id: 20, src: '/themes/theme20.png', alt: 'Theme 20' },
  // { id: 21, src: '/themes/theme21.png', alt: 'Theme 21' },
  // { id: 22, src: '/themes/theme22.png', alt: 'Theme 22' },
  // { id: 23, src: '/themes/theme23.png', alt: 'Theme 23' },
  // { id: 24, src: '/themes/theme24.png', alt: 'Theme 24' },
  // { id: 25, src: '/themes/theme25.png', alt: 'Theme 25' },
  // { id: 26, src: '/themes/theme26.png', alt: 'Theme 26' },
  // { id: 27, src: '/themes/theme27.png', alt: 'Theme 27' },
  // { id: 28, src: '/themes/theme28.png', alt: 'Theme 28' },
  // { id: 29, src: '/themes/theme29.png', alt: 'Theme 29' },
  // { id: 30, src: '/themes/theme30.png', alt: 'Theme 30' },
  // { id: 31, src: '/themes/theme31.png', alt: 'Theme 31' },
  // { id: 32, src: '/themes/theme32.png', alt: 'Theme 32' },
  // { id: 33, src: '/themes/theme33.png', alt: 'Theme 33' },

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
              padding: '0px',
            }}>
              <img 
                src={selectedTheme.src} 
                alt={`Selected: ${selectedTheme.alt}`}
                style={{
                  width: '100%',
                  height: '100%'
                }}
              />
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
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fff',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={theme.src} 
                  alt={theme.alt}
                  style={{
                    width: '100%',
                    height: '80px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
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