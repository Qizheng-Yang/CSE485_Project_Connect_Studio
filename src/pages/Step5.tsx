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
  { name: 'Solid', value: '5px solid #b2cc55' },
  { name: 'Dashed', value: '5px dashed #b2cc55' },
  { name: 'Double', value: '5px double #b2cc55' },
  { name: 'Ridge', value: '5px ridge #b2cc55' },
  { name: 'Inset', value: '5px inset #b2cc55' }
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


function Step5() {
  const { slides, setSlides } = useImage();
  const [selections, setSelections] = useState({
    transition: '',
    effect: '',
    background: '',
    border: ''
  });


  const handleTransitionChange = (transitionUrl: string) => {
    setSelections(prev => ({ ...prev, transition: transitionUrl }));
    
    const updatedSlides = slides.map(slide => ({
      ...slide,
      transition: transitionUrl
    }));
    setSlides(updatedSlides);
  };

  const handleEffectChange = (effect: string, index: number) => {
    setSelections(prev => ({ ...prev, effect }));

    const updatedSlides = slides.map(slide => ({
      ...slide,
      effect: filterEffects[index].value
    }));
    setSlides(updatedSlides);
  };

  const handleBackgroundChange = (backgroundValue: string) => {
    setSelections(prev => ({ ...prev, background: backgroundValue }));
    
    const updatedSlides = slides.map(slide => ({
      ...slide,
      background: backgroundValue 
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
            {[image1, image2, image3, image4, image5, image6].map((imageUrl, index) => (
              <div key={`background-${index}`} className="effect-container">
                <img
                  src={imageUrl}
                  alt={`Background ${index + 1}`}
                  className={`selection-image ${
                    selections.background === imageUrl ? 'selected' : ''
                  }`}
                  onClick={() => handleBackgroundChange(imageUrl)} // Pass image URL
                />
                <div className="effect-label">Background {index + 1}</div>
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