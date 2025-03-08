import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import InputField from './components/InputField';
import StepIndicator from './components/StepIndicator';
import Button from './components/Button';
import './App.css';
import * as api from './services/api';


function App() {
  const [introText, setIntroText] = useState('');
  const [title, setTitle] = useState('');
  const [imageFilename, setImageFilename] = useState('');
  const [step, setStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true); // Disable "Next" initially
  const [message, setMessage] = useState(''); // For displaying messages to the user


    // Enable/disable "Next" button based on input
    useEffect(() => {
        setIsNextDisabled(!(introText && title && imageFilename));
    }, [introText, title, imageFilename]);

    const handleImageUpload = (filename) => {
        setImageFilename(filename);
        setMessage('Image uploaded successfully!'); // Display a success message
    };

    const handleNext = async () => {
        if (isNextDisabled) return;  // Prevent clicking if disabled

        setMessage('Processing...'); // Show a processing message

        try {
            const response = await api.processData({ introText, title, imageFilename, step });
            if (response.data && response.data.data) {
                // Update state based on the processed data
                setIntroText(response.data.data.introText);
                setTitle(response.data.data.title);
                setStep(response.data.data.step);
                setMessage(`Step ${step} completed!`);  // Display a success message
            } else {
                setMessage('Processing failed. Please check the console.'); // Generic error
            }
        } catch (error) {
          setMessage(`Error: ${error.response ? error.response.data.error : error.message}`);
        }
    };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1); //go back a step
    }
  };

  return (
    <div className="app">
      <div className="header">
        <h1>STUDIO</h1>
        {/*  Logo would go here */}
      </div>
      <div className="main-content">
        <div className="image-placeholder">
          {/* Display uploaded image or placeholder */}
            {imageFilename ? (
                <img src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${imageFilename}`} alt="Uploaded" />
            ) : (
                <div className="placeholder-circle">
                    <span>+</span>
                </div>
            )}
            <p>In loving memory of</p>
        </div>

        <StepIndicator currentStep={step} />

        <p className="section-title">MAIN INFORMATION</p>

        <ImageUpload onImageUpload={handleImageUpload} />

        <InputField
          label="INTRODUCTORY TEXT"
          placeholder="In Loving Memory of"
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
        />

        <InputField
          label="TITLE"
          placeholder="Insert Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/* Message display */}
        {message && <div className="message">{message}</div>}


        <div className="button-row">
            <Button text="Back" onClick={handleBack} disabled={step === 1} />
            <Button text="Next" onClick={handleNext} disabled={isNextDisabled} />

        </div>

      </div>
    </div>
  );
}

export default App;
