import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';


import { useState } from 'react';
// import React, { useState } from 'react';
import { useImage } from '../context/ImageContext';


import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';

// Filter effects
const filterEffects = [
  { name: 'Normal', value: 'none' },
  { name: 'Grayscale', value: 'grayscale(100%)' },
  { name: 'Sepia', value: 'sepia(100%)' },
  { name: 'Invert', value: 'invert(100%)' },
  { name: 'Blur', value: 'blur(2px)' },
  { name: 'Saturate', value: 'saturate(200%)' }
];

// Border styles
const borderStyles = [
  { name: 'None', value: 'none' },
  { name: 'Solid', value: '5px solid #000000' },
  { name: 'Dashed', value: '5px dashed #000000' },
  { name: 'Double', value: '5px double #000000' },
  { name: 'Ridge', value: '5px ridge #000000' },
  { name: 'Inset', value: '5px inset #000000' }
];

// Transitions
const transitionOptions = [
  { image: image1, name: 'fade' },
  { image: image2, name: 'slide' },
  { image: image3, name: 'zoom' },
  { image: image4, name: 'wipe' },
  { image: image5, name: 'blur' },
  { image: image6, name: 'dissolve' }
]

// Color options
const backgroundColors = [
  { name: 'Black', value: '#000000' },
  { name: 'Deep Blue', value: '#355c7d' },
  { name: 'Sage Green', value: '#99B898' },
  { name: 'Corral Pink', value: '#FF8C94' },
  { name: 'Pastel Cyan', value: '#a4d8d8' },
  { name: 'Pastel Rose', value: '#f6b8d0' },
  { name: 'Indigo', value: '#5c62d6' }, 
  { name: 'Pastel Lime', value: '#E1F5C4' },
  { name: 'Teal', value: '#45ADA8' },
  { name: 'Blue', value: '#3a86ff' },
  { name: 'Green', value: '#b2cc55' },
  { name: 'White', value: '#ffffff' },
  { name: 'Dark Gray', value: '#474747' },
  { name: 'Gray', value: '#6c757d' }
];

function Step5() {
  const { slides, setSlides } = useImage();
  const [selections, setSelections] = useState({
    transition: '',
    effect: '',
    background: '',
    border: ''
  });

  const handleEffectChange = (effect: string, index: number) => {
    setSelections(prev => ({ ...prev, effect }));

    const updatedSlides = slides.map(slide => ({
      ...slide,
      effect: filterEffects[index].value
    }));
    setSlides(updatedSlides);
  };

  const handleBackgroundChange = (colorValue: string) => {
    setSelections(prev => ({ ...prev, background: colorValue }));
    
    const updatedSlides = slides.map(slide => ({
      ...slide,
      background: colorValue
    }));
    setSlides(updatedSlides);
  };

  const handleBorderChange = (border: string, index: number) => {
    setSelections(prev => ({ ...prev, border }));

    const updatedSlides = slides.map(slide => ({
      ...slide,
      border: borderStyles[index].value
    }));
    setSlides(updatedSlides);
  };

  
  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">SLIDE AND TRANSITION EFFECTS</h2>

        {/* Transitions Section */}
        <div className="effects-section">
          <p className="section-heading">TRANSITIONS</p>
          <div className="selection-row">
            {[image1, image2, image3, image4, image5, image6].map((imageUrl, index) => (
              <div key={`transition-${index}`} className="effect-container">
                <img
                  src={imageUrl}
                  alt={`Transition ${index + 1}`}
                  className={`selection-image ${
                    selections.transition === transitionOptions[index].name ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setSelections(prev => ({ ...prev, transition: transitionOptions[index].name }));
                    setSlides(slides.map(slide => ({
                      ...slide,
                      transition: transitionOptions[index].name
                    })));
                  }}
                />
                <div className="effect-label">{transitionOptions[index].name}</div>
              </div>
            ))}
          </div>
        </div>


        {/* Effects Section */}
        <div className="effects-section">
          <p className="section-heading">EFFECTS</p>
          <div className="selection-row">
          {filterEffects.map((effect, index) => (
              <div key={`effect-${index}`} className="effect-container">
                <img
                  src={image1}
                  alt={effect.name}
                  className={`selection-image ${
                    selections.effect === effect.name ? 'selected' : ''
                  }`}
                  style={{ filter: effect.value }}
                  onClick={() => handleEffectChange(effect.name, index)}
                />
                <div className="effect-label">{effect.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Backgrounds Section */}
        <div className="effects-section">
          <p className="section-heading">BACKGROUNDS</p>
          <div className="selection-row">
            {backgroundColors.map((color, index) => (
              <div key={`background-${index}`} className="effect-container">
                <div
                  className={`selection-image color-swatch ${
                    selections.background === color.value ? 'selected' : ''
                  }`}
                  style={{
                    backgroundColor: color.value,
                    border: '2px solid #eee'
                  }}
                  onClick={() => handleBackgroundChange(color.value)}
                ></div>
                <div className="effect-label">{color.name}</div>
              </div>
            ))}
          </div>
        </div>


        {/* Borders Section */}
        <div className="effects-section">
          <p className="section-heading">BORDERS</p>
          <div className="selection-row-border">
            {borderStyles.map((border, index) => (
              <div key={`border-${index}`} className="effect-container">
                <div
                    className={`selection-image-border border-preview ${
                      selections.border === border.name ? 'selected' : ''
                    }`}
                    style={{
                      border: border.value !== 'none' ? border.value : '1px solid #eee',
                      outline: selections.border === border.name ? '3px solid #b2cc55' : 'none',
                      backgroundImage: `url(${image1})`,
                      backgroundSize: 'cover',
                    }}
                    onClick={() => handleBorderChange(border.name, index)}
                  ></div>
                <div className="effect-label">{border.name}</div>
              </div>
            ))}
          </div>
        </div>




        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/step/4">
            <button className="back-button">Back</button>
          </Link>

          {/* Next Button */}
          <Link to="/step/6">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step5;