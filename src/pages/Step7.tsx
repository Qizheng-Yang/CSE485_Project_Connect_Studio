import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useImage } from '../context/ImageContext';
// import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import { useState, useEffect } from 'react';


function Step7() {
  const { slides } = useImage(); // Gets slides

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (slides.length > 0) {
      const currentSlide = slides[currentSlideIndex];
      const duration = currentSlide?.customDuration
        ? parseInt(currentSlide.customDuration.split(' ')[0]) * 1000 
        : 5000; 

      const timer = setTimeout(() => {
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length); 
      }, duration);

      return () => clearTimeout(timer); 
    }
  }, [currentSlideIndex, slides]);

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        <h2 className="main-information-header">PREVIEW</h2>

        {/* Slideshow Section */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>

          {slides.length > 0 ? (
            <div className="slide-container" style={{ width: '600px', margin: '0 auto' }}>
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    style={{
                      display: index === currentSlideIndex ? "flex" : "none",
                      height: '300px',
                      backgroundImage: `url(${slide.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '10px',
                    }}
                  >
                    <span style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold', }}>
                      {slide.customText}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p>No slides added yet. Please go back and add some slides.</p>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/step/6">
            <button className="back-button">Back</button>
          </Link>

          {/* Next Button */}
          <Link to="/step/8">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step7;
