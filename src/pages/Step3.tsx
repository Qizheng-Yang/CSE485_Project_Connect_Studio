import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import React, { useState } from 'react';
import { useImage } from '../context/ImageContext';
import { HexColorPicker } from "react-colorful";  // Color selection (also installed)

// Font imports (Fonts were also installed)
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

// Import local images
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';


import memorialChoice from '../assets/memorialQuote.png';
import weddingChoice from '../assets/weddingQuote.png';
import retirementChoice from '../assets/retirementQuote.png';
import anniversaryChoice from '../assets/anniversaryQuote.png';

const quotes = [
  'Time With Those We Love',
  'Footprints',
  'Life Is Measured',
  'Memories Last Forever',
  'Cherished Moments',
  'Add other quotes',
  'Add other quotes',
  'Add other quotes',
  'Add other quotes',
  'Add other quotes',
  'Add other quotes',
  'Add other quotes',
  'Add other quotes'
];

const fonts = [
  'Montserrat',
  'Alex Brush',
  'Alegreya',
  'Memories Last Forever',
  'Cherished Moments',
  'Dancing Script',
  'Great Vibes',
  'Pacifico',
  'Roboto Slab',
  'Playfair Display',
  'Lobster',
  'Raleway',
  'Open Sans'
];

function Step3() {
  const { slides, setSlides } = useImage();
  const [currentSlide, setCurrentSlide] = useState({
    backgroundImage: '',
    customText: '',
    customFont: 'Montserrat',
    customColor: '#000000',
    customDuration: '5 seconds',
  });
  const [selectedQuote, setSelectedQuote] = useState('');
  const [isCustomizationVisible, setIsCustomizationVisible] = useState(false); 

  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  const handleAddSlide = () => {
    if (currentSlide.backgroundImage && currentSlide.customText) {
      setSlides([...slides, currentSlide]); 
      resetState();
    }
  };

  const handleBackgroundChange = (backgroundUrl: string) => {
    setCurrentSlide((prev) => ({ ...prev, backgroundImage: backgroundUrl }));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSlide((prev) => ({ ...prev, customText: event.target.value }));
  };

  const handleQuoteChange = (quote: string) => {
    setCurrentSlide((prev) => ({ ...prev, customText: quote }));
    setIsCustomizationVisible(true); 
  };

  const handleFontChange = (font: string) => {
    setCurrentSlide((prev) => ({ ...prev, customFont: font }));
    // setIsCustomizationVisible(true); 
  };

  const handleColorChange = (color: string) => {
    setCurrentSlide((prev) => ({ ...prev, customColor: color }));
  };



  const resetState = () => {
    setCurrentSlide({
      backgroundImage: '',
      customText: '',
      customFont: 'Montserrat',
      customColor: '#000000',
      // duration: '5 seconds',
      customDuration: '5 seconds',

    });
    setSelectedQuote('');
    setIsCustomizationVisible(false); 
  };

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        <h2 className="main-information-header">ADD TITLE SLIDES</h2>

        {/* Top Preview Section - Only visible when not in customization mode */}
        {!isCustomizationVisible && (
          <div className="preview-section">
            <div
              className="slide-preview"
              style={{
                backgroundImage: currentSlide.backgroundImage
                    ? `url(${currentSlide.backgroundImage})` : 'none', backgroundColor: currentSlide.backgroundImage ? 'transparent' : '#f7f7f7',
              }}
            >
              <span
                className="slide-text"
                style={{
                  fontFamily: currentSlide.customFont,
                  color: currentSlide.customColor,
                }}
              >
                {currentSlide.customText || 'ENTER CUSTOM TEXT'}
              </span>
            </div>
          </div>
        )}

        {/* Background Selection */}
        {!isCustomizationVisible && (
          <>
            <p className="background-choosing-text">Choose the background image</p>
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

            {/* Quote Selection */}
            <p className="quote-choosing-text">Search Quotes</p>
            <div className="quote-selection">
              {[
                { src: memorialChoice, label: 'Tester' },
                { src: weddingChoice, label: 'Wedding' },
                { src: retirementChoice, label: 'Retirement' },
                { src: anniversaryChoice, label: 'Anniversary' },
              ].map((quoteOption) => (
                <img
                  key={quoteOption.label}
                  src={quoteOption.src}
                  alt={quoteOption.label}
                  className={`quote-image ${
                    selectedQuote === quoteOption.label ? 'selected' : ''
                  }`}
                  onClick={() => handleQuoteChange(quoteOption.label)}
                />
              ))}
            </div>
          </>
        )}

        {/* Quote Selection and Preview Section */}
        {isCustomizationVisible && (
          <div className="content-wrapper">
            {/* Scrollable Quote List */}
            <div className="quote-list">
              <h3 className="quote-list-header">Select a Quote:</h3>
              <div className="quote-scrollable">
                {quotes.map((quote, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuoteChange(quote)}
                    className={`quote-button ${
                      currentSlide.customText === quote ? 'selected' : ''
                    }`}
                  >
                    {quote}
                  </button>
                ))}
              </div>
            </div>

            {/* Slide Preview */}
            <div className="preview-section">
              <div
                className="slide-preview"
                style={{
                  backgroundImage: currentSlide.backgroundImage
                    ? `url(${currentSlide.backgroundImage})` : 'none', backgroundColor: currentSlide.backgroundImage ? 'transparent' : '#f7f7f7',
                }}
              >
                <span
                  className="slide-text"
                  style={{
                    fontFamily: currentSlide.customFont,
                    color: currentSlide.customColor,
                  }}
                >
                  {currentSlide.customText || 'ENTER CUSTOM TEXT'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Customization Options */}
        {isCustomizationVisible && (
          <div className="customization-section">

            
            {/* Font Selection */}

            
            <p className="font-section">FONT:</p>
            <div className="font-list">
              {/* <h3 className="font-list-header">FONT:</h3> */}
              <div className="font-scrollable">
                {fonts.map((font, index) => (
                  <button
                    key={index}
                    onClick={() => handleFontChange(font)}
                    className={`font-button ${
                      currentSlide.customFont === font ? 'selected' : ''
                    }`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            </div>

              
            {/* Color Selection */}
            <p className="color-section">COLOR:</p>
              <div className="color-selection">
                <div
                  className="color-box"
                  style={{
                    backgroundColor: currentSlide.customColor,
                  }}
                  onClick={() => setIsColorPickerVisible(!isColorPickerVisible)}
                ></div>

                {isColorPickerVisible && (
                  <div className="color-picker-wrapper">
                    <HexColorPicker
                      color={currentSlide.customColor}
                      onChange={handleColorChange}
                    />
                  </div>
                )}
              </div> 




            {/* Duration Selection */}
            <p className="duration-section">SLIDE TIME:</p>
            <div className="duration-selection">
              <div className="duration-input-container">
                <span className="automatic-label">Automatic:</span>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={parseInt(currentSlide.customDuration || "5")} 
                  onChange={(e) =>
                    setCurrentSlide((prev) => ({
                      ...prev,
                      customDuration: `${e.target.value} seconds`, 
                    }))
                  }
                  className="duration-input"
                />
                <span className="seconds-label">seconds</span>
              </div>
            </div>





          </div>
        )}

        {/* Add Slide Button */}
        <div className="add-slide-button-section">
          <button onClick={handleAddSlide} className="add-slide-button">
            + ADD ANOTHER SLIDE
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
