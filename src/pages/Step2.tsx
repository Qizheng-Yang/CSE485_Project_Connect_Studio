import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useState, useEffect } from 'react';
import { useImage } from '../context/ImageContext';
import { useAuth } from '../context/AuthContext';

export interface Theme {
  id: number;
  src: string;
  alt: string;
  frame?: string;
}

const themeImages: Theme[] = [
  
  { id: 1, src: '/themes/theme1.mp4', alt: 'Theme 1' },
  { id: 2, src: '/themes/theme2.mp4', alt: 'Theme 2' },
  { id: 3, src: '/themes/theme3.mp4', alt: 'Theme 3' },
  { id: 4, src: '/themes/theme4.mp4', alt: 'Theme 4' },
  { id: 5, src: '/themes/theme5.mp4', alt: 'Theme 5' },
  { id: 6, src: '/themes/theme6.mp4', alt: 'Theme 6' },
  { id: 7, src: '/themes/theme7.mp4', alt: 'Theme 7' },
  { id: 8, src: '/themes/theme8.mp4', alt: 'Theme 8' },
  { id: 9, src: '/themes/theme9.mp4', alt: 'Theme 9' },
  { id: 10, src: '/themes/theme10.mp4', alt: 'Theme 10' },
  { id: 11, src: '/themes/theme11.mp4 ', alt: 'Theme 11' },


  // { id: 1, src: '/themes/theme1.png', alt: 'Theme 1' },
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
];

function Step2() {
  const { selectedTheme, setSelectedTheme, currentProject, updateProject } = useImage();
  const { isAuthenticated } = useAuth();
  const [localSelectedTheme, setLocalSelectedTheme] = useState<Theme | null>(null);

  // Helper function to check if the source is a video
  const isVideo = (src: string): boolean => {
    return src.endsWith('.mp4') || src.endsWith('.webm') || src.endsWith('.ogg');
  };

  useEffect(() => {
    const defaultTheme = themeImages[0];
    setLocalSelectedTheme(defaultTheme);
    setSelectedTheme(defaultTheme);
  }, [setSelectedTheme]);

  useEffect(() => {
    if (localSelectedTheme?.frame) {
      document.body.style.setProperty('--slide-pattern', `url(${localSelectedTheme.frame})`);
    } else {
      document.body.style.setProperty('--slide-pattern', 'none');
    }
  }, [localSelectedTheme]);

  const handleThemeSelect = async (theme: Theme): Promise<void> => {
    setLocalSelectedTheme(theme);
    setSelectedTheme(theme);
    localStorage.setItem('selectedTheme', theme.id.toString());
  
    document.body.style.setProperty('--slide-pattern', theme.frame ? `url(${theme.frame})` : 'none');
    
    // Save theme to project if authenticated and project exists
    if (isAuthenticated && currentProject) {
      try {
        await updateProject({ theme_id: theme.id });
        console.log('Theme saved to project');
      } catch (error) {
        console.error('Failed to save theme to project:', error);
      }
    }
  };
  

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      <div className="main-content">
        <h2 className="main-information-header">THEME</h2>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          {/* Large preview of selected theme */}
          {localSelectedTheme && (
            <div style={{ position: 'relative', margin: '0 auto 30px', width: 500, height: 300, padding: 0 }}>
              {isVideo(localSelectedTheme.src) ? (
                <video 
                  src={localSelectedTheme.src} 
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                    padding: 0, margin: 0, border: 'none'
                  }}
                />
              ) : (
                <img 
                  src={localSelectedTheme.src} 
                  alt={`Selected: ${localSelectedTheme.alt}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    objectFit: 'cover',
                    padding: 0, margin: 0, border: 'none'
                  }}
                />
              )}
              {localSelectedTheme.frame && (
                <img
                  src={localSelectedTheme.frame}
                  alt="Frame overlay"
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    pointerEvents: 'none',
                    opacity: 1,
                    objectFit: 'fill',
                    zIndex: 2,
                    margin: 0, padding: 0, border: 'none'
                  }}
                />
              )}
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
                  border: localSelectedTheme?.id === theme.id 
                    ? '3px solid #4CAF50' 
                    : '1px solid #ddd',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fff',
                  overflow: 'hidden'
                }}
              >
                {isVideo(theme.src) ? (
                  <video 
                    src={theme.src} 
                    poster={`/themes/theme${theme.id}_poster.png`}
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                      width: '100%',
                      height: '80px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : (
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
                )}
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