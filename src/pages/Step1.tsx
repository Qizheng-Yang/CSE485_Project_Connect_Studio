import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepNavigation from '../components/StepNavigation';

function Step1() {
  return (
    <div className="container">
      {/* Navbar */}
      <Navbar />

      {/* Step Navigation */}
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">MAIN INFORMATION</h2>

        {/* Upload Main Image Section */}
        <div className="upload-main-image-section">
          <h3 className="upload-main-image-header">UPLOAD MAIN IMAGE</h3>
          <div className="upload-icon-container">
            {/* Icon Placeholder */}
            <span className="upload-icon">✎</span>
          </div>
        </div>

        {/* Introductory Text Section */}
        <div className="introductory-text-section">
          <h3 className="introductory-text-header">INTRODUCTORY TEXT</h3>
          <p className="introductory-text">In Loving Memory of</p>
        </div>

        {/* Title Section */}
        <div className="title-section">
          <h3 className="title-header">TITLE</h3>
          <input
            type="text"
            placeholder="Insert Name"
            className="title-input"
          />
        </div>

        {/* Toggle Switch Section */}
        <div className="toggle-switch-section">
          <label className="toggle-switch-label">
            Enable Full Access to Family
            <input type="checkbox" id="toggle-switch" className="toggle-switch-input" />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/create">
            <button className="back-button">Back</button>
          </Link>

          {/* Next Button */}
          <Link to="/step/2">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step1;