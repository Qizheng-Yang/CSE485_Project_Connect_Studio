import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepNavigation from '../components/StepNavigation';

function Step6() {
  return (
    <div>
      <Navbar />
      <StepNavigation />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Step 6: MUSIC</h2>
        <p>Select a theme for your video.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/step/5"><button>Back</button></Link>
          <Link to="/step/7"><button>Next</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Step6;
