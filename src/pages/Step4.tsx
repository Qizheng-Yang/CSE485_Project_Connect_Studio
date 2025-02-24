import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepNavigation from '../components/StepNavigation';

function Step4() {
  return (
    <div>
      <Navbar />
      <StepNavigation />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Step 4: PHOTOS</h2>
        <p>Select a theme for your video.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/step/3"><button>Back</button></Link>
          <Link to="/step/5"><button>Next</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Step4;
