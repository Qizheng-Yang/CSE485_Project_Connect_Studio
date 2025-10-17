import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useImage } from '../context/ImageContext';
import 'react-slideshow-image/dist/styles.css';

import { useState, useEffect } from 'react';

// Define the item type for preview
interface PreviewItem {
  id: string;
  type: 'theme' | 'slide' | 'image' | 'video' | 'audio';
  src: string;
  duration: number;
  customText?: string;
  customFont?: string;
  customColor?: string;
  effect?: string;
  transition?: string;
}

// Added Fonts
import "@fontsource/montserrat"; 
import "@fontsource/alex-brush"; 
import "@fontsource/alegreya"; 
import "@fontsource/dancing-script"; 
import "@fontsource/great-vibes"; 
import "@fontsource/pacifico"; 
import "@fontsource/roboto-slab"; 
import "@fontsource/playfair-display"; 
import "@fontsource/lobster"; 
import "@fontsource/raleway"; 
import "@fontsource/open-sans";


function Step5() {
  const { slides, mediaItems, selectedTheme } = useImage();
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Combine theme, slides, and media items in order
  const allItems: PreviewItem[] = [];
  
  // Add theme as first item if selected
  if (selectedTheme) {
    allItems.push({
      id: 'theme',
      type: 'theme',
      src: selectedTheme.src,
      duration: 3000, // 3 seconds for theme
      customText: '',
      customFont: 'Montserrat',
      customColor: '#ffffff',
      effect: 'none',
      transition: 'fade'
    });
  }
  
  // Add slides
  slides.forEach(slide => {
    allItems.push({
      id: slide.id,
      type: 'slide',
      src: slide.backgroundImage || '',
      duration: parseInt(slide.customDuration || '5') * 1000,
      customText: slide.customText || '',
      customFont: slide.customFont || 'Montserrat',
      customColor: slide.customColor || '#ffffff',
      effect: slide.effect || 'none',
      transition: slide.transition || 'fade'
    });
  });
  

  mediaItems.forEach(item => {
    allItems.push({
      id: item.id,
      type: item.type,
      src: item.url,
      duration: 4000, // 4 seconds default for images/videos
      customText: '',
      customFont: 'Montserrat',
      customColor: '#ffffff',
      effect: 'none',
      transition: 'fade'
    });
  });

  useEffect(() => {
    if (allItems.length > 0 && isPlaying) {
      const currentItem = allItems[currentItemIndex];
      const duration = currentItem?.duration || 5000;

      const timer = setTimeout(() => {
        setCurrentItemIndex((prevIndex) => (prevIndex + 1) % allItems.length);
        setAnimKey((k) => k + 1);
        setProgress(0); // Reset progress for next item
      }, duration);

      // Update progress bar
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const increment = 100 / (duration / 100);
          return prev + increment > 100 ? 100 : prev + increment;
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [currentItemIndex, allItems, isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setProgress(0);
    }
  };

  const resetPreview = () => {
    setCurrentItemIndex(0);
    setProgress(0);
    setIsPlaying(false);
    setAnimKey(k => k + 1);
  };

  if (allItems.length === 0) {
    return (
      <div className="container">
        <NavbarBabbo />
        <StepNavigation />
        <div className="main-content">
          <h2 className="main-information-header">PREVIEW</h2>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <p>No content added yet. Please go back and add slides or photos.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = allItems[currentItemIndex];
  const transitionClass = currentItem?.transition
    ? currentItem.transition.toLowerCase()
    : "fade";

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      <div className="main-content">
        <h2 className="main-information-header">PREVIEW</h2>
        
        {/* Control Buttons */}
        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <button 
            onClick={togglePlayback}
            style={{
              backgroundColor: '#b2cc55',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              padding: '10px 20px',
              marginRight: '10px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {isPlaying ? '⏸️ Pause' : '▶️ Play'}
          </button>
          <button 
            onClick={resetPreview}
            style={{
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              padding: '10px 20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Reset
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ 
          width: '600px', 
          margin: '0 auto 20px', 
          backgroundColor: '#e0e0e0', 
          borderRadius: '10px', 
          height: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: '#b2cc55',
            borderRadius: '10px',
            transition: 'width 0.1s ease'
          }} />
        </div>

        {/* Current Item Info */}
        <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '14px', color: '#666' }}>
          {currentItemIndex + 1} of {allItems.length} | {currentItem?.type === 'theme' ? 'Theme' : currentItem?.type === 'slide' ? 'Text Slide' : 'Photo/Video'}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div
            className="theme-preview-slide"
            style={{
              width: '600px',
              height: '300px',
              margin: '0 auto',
              position: 'relative',
              border: '8px solid var(--slide-border)',
              filter: `var(--slide-filter) ${currentItem?.effect || ''}`.trim(),
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#000'
            }}
          >
            <div
              key={animKey}
              className={`slide-animator ${transitionClass}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `url(${currentItem?.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1
              }}
            >
              {currentItem?.customText && (
                <span style={{
                  color: currentItem?.customColor || '#fff',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  fontFamily: currentItem?.customFont || 'Montserrat',
                  textAlign: 'center',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  padding: '10px'
                }}>
                  {currentItem?.customText}
                </span>
              )}
            </div>
            <div
              className="theme-overlay-pattern"
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundImage: 'var(--slide-pattern)',
                backgroundSize: 'cover',
                opacity: 1,
                pointerEvents: 'none',
                zIndex: 2
              }}
            />
            {/* {selectedTheme?.frame && (
              <img
                src={selectedTheme.frame}
                alt="Frame overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                  pointerEvents: 'none',
                  opacity: 1,
                  zIndex: 2,
                  margin: 0, padding: 0, border: 'none'
                }}
              />
            )} */}

          </div>
        </div>

        </div>

        <div className="navigation-buttons">
          <Link to="/step/4">
            <button className="back-button">Back</button>
          </Link>
          <Link to="/step/6">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step5;