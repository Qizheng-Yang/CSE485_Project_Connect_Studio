import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import React, { useState } from 'react';
import { useImage } from '../context/ImageContext';

// Import local images
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';

function Step3() {
  const { slides, setSlides } = useImage();
  const [currentSlide, setCurrentSlide] = useState({ backgroundImage: '', customText: '' });

  const handleAddSlide = () => {
    if (currentSlide.backgroundImage && currentSlide.customText) {
      setSlides([...slides, currentSlide]); // Update context
      setCurrentSlide({ backgroundImage: '', customText: '' }); // Reset slide input
    }
  };

  const handleBackgroundChange = (backgroundUrl: string) => {
    setCurrentSlide((prev) => ({ ...prev, backgroundImage: backgroundUrl }));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSlide((prev) => ({ ...prev, customText: event.target.value }));
  };

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        <h2 className="main-information-header">ADD TITLE SLIDES</h2>

        {/* Preview Current Slide */}
        <div className="preview-section">
          <div
            className="slide-preview"
            style={{
              backgroundImage: `url(${currentSlide.backgroundImage})`,
            }}
          >
            <span className="slide-text">
              {currentSlide.customText || 'ENTER CUSTOM TEXT'}
            </span>
          </div>
        </div>

        <p className="background-choosing-text">Choose the background image</p>

        {/* Background Selection */}
        <div className="background-selection">
          {[image1, image2, image3, image4, image5, image6].map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl}
              alt={`Background ${index + 1}`}
              className={`background-image ${
                currentSlide.backgroundImage === imageUrl ? 'selected' : ''
              }`}
              onClick={() => handleBackgroundChange(imageUrl)}
            />
          ))}
        </div>

        {/* Custom Text Input */}
        <div className="text-input-section">
          <input
            type="text"
            placeholder="Enter Custom Text"
            value={currentSlide.customText}
            onChange={handleTextChange}
            className="custom-text-input"
          />
        </div>

        <p className="quote-choosing-text">Search Quotes</p>

        {/* Add Slide Button */}
        <div className="add-slide-button-section">
          <button
            onClick={handleAddSlide}
            className="add-slide-button"
            disabled={!currentSlide.backgroundImage || !currentSlide.customText}
          >
            <h2>+ ADD ANOTHER SLIDE</h2>
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <Link to="/step/2">
            <button className="back-button">Back</button>
          </Link>
          <Link to="/step/4">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step3;
