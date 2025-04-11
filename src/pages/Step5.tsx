import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';


import React, { useState } from 'react';
import { useImage } from '../context/ImageContext';


import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';

function Step5() {
  const [selections, setSelections] = useState({
    transition: '',
    effect: '',
    background: '',
    border: ''
  });


  const handleTransitionChange = (transitionUrl: string) => {
    setSelections(prev => ({ ...prev, transition: transitionUrl }));
  };

  const handleEffectChange = (effectUrl: string) => {
    setSelections(prev => ({ ...prev, effect: effectUrl }));
  };

  const handleBackgroundChange = (backgroundUrl: string) => {
    setSelections(prev => ({ ...prev, background: backgroundUrl }));
  };

  const handleBorderChange = (borderUrl: string) => {
    setSelections(prev => ({ ...prev, border: borderUrl }));
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
              <img
                key={`transition-${index}`}
                src={imageUrl}
                alt={`Transition ${index + 1}`}
                className={`selection-image ${
                  selections.transition === imageUrl ? 'selected' : ''
                }`}
                onClick={() => handleTransitionChange(imageUrl)}
              />
            ))}
          </div>
        </div>

        {/* Effects Section */}
        <div className="effects-section">
          <p className="section-heading">EFFECTS</p>
          <div className="selection-row">
            {[image1, image2, image3, image4, image5, image6].map((imageUrl, index) => (
              <img
                key={`effect-${index}`}
                src={imageUrl}
                alt={`Effect ${index + 1}`}
                className={`selection-image ${
                  selections.effect === imageUrl ? 'selected' : ''
                }`}
                onClick={() => handleEffectChange(imageUrl)}
              />
            ))}
          </div>
        </div>

        {/* Backgrounds Section */}
        <div className="effects-section">
          <p className="section-heading">BACKGROUNDS</p>
          <div className="selection-row">
            {[image1, image2, image3, image4, image5, image6].map((imageUrl, index) => (
              <img
                key={`background-${index}`}
                src={imageUrl}
                alt={`Background ${index + 1}`}
                className={`selection-image ${
                  selections.background === imageUrl ? 'selected' : ''
                }`}
                onClick={() => handleBackgroundChange(imageUrl)}
              />
            ))}
          </div>
        </div>

        {/* Borders Section */}
        <div className="effects-section">
          <p className="section-heading">BORDERS</p>
          <div className="selection-row">
            {[image1, image2, image3, image4, image5, image6].map((imageUrl, index) => (
              <img
                key={`border-${index}`}
                src={imageUrl}
                alt={`Border ${index + 1}`}
                className={`selection-image ${
                  selections.border === imageUrl ? 'selected' : ''
                }`}
                onClick={() => handleBorderChange(imageUrl)}
              />
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