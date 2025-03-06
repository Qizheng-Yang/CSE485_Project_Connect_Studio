import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';

function Step2() {
  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">THEME</h2>


        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Step 2: Choose a Theme</h2>
          <p>Select a theme for your video.</p>
          
        </div>



        {/* Navigation Buttons */}
        <div className="navigation-buttons">
            {/* Back Button */}
            <Link to="/step/1">
              <button className="back-button">Back</button>
            </Link>

            {/* Next Button */}
            <Link to="/step/3">
              <button className="next-button">Next</button>
            </Link>
          </div>
        </div>
    </div>
  );
}

export default Step2;
