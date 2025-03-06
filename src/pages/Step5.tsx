import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';

function Step5() {
  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">SLIDES AND TRASITION EFFECTS</h2>




      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Step 5: SLIDE AND TRANSISTION EFFECTS</h2>
        <p>Select a theme for your video.</p>
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
