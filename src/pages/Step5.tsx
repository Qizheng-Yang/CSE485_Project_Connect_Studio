import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepNavigation from '../components/StepNavigation';

function Step5() {
  return (
    <div>
      <Navbar />
      <StepNavigation />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Step 5: SLIDE AND TRANSISTION EFFECTS</h2>
        <p>Select a theme for your video.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/step/4"><button>Back</button></Link>
          <Link to="/step/6"><button>Next</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Step5;
