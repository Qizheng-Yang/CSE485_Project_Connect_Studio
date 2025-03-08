import React from 'react';

function StepIndicator({ currentStep }) {
  const steps = ['Info', 'Theme', 'Title Slides', 'Gallery', 'Effects', 'Music', 'Preview', 'Finalize'];

  return (
    <div className="step-indicator">
      {steps.map((stepName, index) => (
        <div key={index} className={`step ${index + 1 === currentStep ? 'active' : ''}`}>
          <div className="circle">{index + 1}</div>
          <div className="label">{stepName}</div>
        </div>
      ))}
    </div>
  );
}
export default StepIndicator;
