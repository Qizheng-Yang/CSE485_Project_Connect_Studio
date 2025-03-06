import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';

function Step8() {
  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Main Information Section */}
        <h2 className="main-information-header">CHECK OUT</h2>


        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h2>Step 8: CHECK OUT</h2>
          <p>Select a theme for your video.</p>
        </div>




          {/* Navigation Buttons */}
          <div className="navigation-buttons">
            {/* Back Button */}
            <Link to="/step/7">
              <button className="back-button">Back</button>
            </Link>

            {/* Next Button */}
            <Link to="/step/8">
              <button className="next-button">Place Order</button>
            </Link>
          </div>

        </div>
    </div>
  );
}

export default Step8;
