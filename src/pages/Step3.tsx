import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';

function Step3() {
  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">ADD TITLE SLIDES</h2>


        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Step 3: ADD TITLE SLIDES</h2>
          <p>Choose the background image.</p>
        </div>



        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/step/2">
            <button className="back-button">Back</button>
          </Link>

          {/* Next Button */}
          <Link to="/step/4">
            <button className="next-button">Next</button>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Step3;
