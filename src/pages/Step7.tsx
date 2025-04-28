import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useImage } from '../context/ImageContext';
// import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import { useState, useEffect } from 'react';

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


function Step7() {
  const { slides } = useImage();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (slides.length > 0) {
      const currentSlide = slides[currentSlideIndex];
      const duration = currentSlide?.customDuration
        ? parseInt(currentSlide.customDuration.split(' ')[0]) * 1000
        : 5000;

      const timer = setTimeout(() => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
        setAnimKey((k) => k + 1);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [currentSlideIndex, slides]);

  if (!slides.length) {
    return (
      <div className="container">
        <NavbarBabbo />
        <StepNavigation />
        <div className="main-content">
          <p>No slides added yet. Please go back and add some slides.</p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];
  const transitionClass = currentSlide.transition
    ? currentSlide.transition.toLowerCase()
    : "fade";

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      <div className="main-content">
        <h2 className="main-information-header">PREVIEW</h2>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <div 
            className="slide-frame"
            style={{
              width: '600px',
              height: '300px',
              margin: '0 auto',
              backgroundColor: currentSlide.background || '#000',
              borderRadius: '2.5px',
              overflow: 'hidden',
              position: 'relative' ,
              boxSizing: 'border-box'
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
                backgroundImage: `url(${currentSlide.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                filter: currentSlide.effect || 'none',
                border: currentSlide.border || 'none'
              }}
            >
              <span style={{
                color: currentSlide.customColor || '#fff',
                fontSize: '24px',
                fontWeight: 'bold',
                fontFamily: currentSlide.customFont || 'Montserrat'
              }}>
                {currentSlide.customText}
              </span>
            </div>
          </div>
        </div>

        <div className="navigation-buttons">
          <Link to="/step/6">
            <button className="back-button">Back</button>
          </Link>
          <Link to="/step/8">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step7;