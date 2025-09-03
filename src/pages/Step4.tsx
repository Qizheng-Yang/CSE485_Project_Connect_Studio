import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import Gallery from '../components/Gallery';

function Step4() {
  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Photos Section */}
        <div className="photos-section">
          <h2>PHOTOS</h2>
          <p>If you would like your photos in a specific order please drag and drop them in the order you prefer.</p>
          <Gallery />
        </div>

        {/* Photo Gallery Link Section - Updated to match screenshot */}
        <div className="photo-gallery-link-section">
  <h3>PHOTO GALLERY LINK</h3>
  <p>Send this link to your family and friends and allow them to contribute Photos and Videos</p>
  
  <div className="toggle-switch-container">
    <label className="toggle-switch">
      <input type="checkbox" id="upload-toggle" />
      <span className="slider"></span>
    </label>
    <span className="toggle-text">Enable Upload Link</span>
  </div>

  <div className="link-and-buttons">
    <div className="link-box">
      <span>https://mybabbostudio/NAME.com</span>
    </div>
    <div className="action-buttons">
      <button className="copy-button">Copy</button>
      <button className="email-button">Email</button>
    </div>
  </div>
</div>

        {/* Navigation Buttons - Updated to match screenshot */}
        <div className="navigation-buttons">
          <Link to="/step/3">
            <button className="back-button">Back</button>
          </Link>
          <Link to="/step/5">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step4;
