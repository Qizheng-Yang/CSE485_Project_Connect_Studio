import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepNavigation from '../components/StepNavigation';

function Step3() {
  return (
    <div>
      <Navbar />
      <StepNavigation />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Step 3: ADD TITLE SLIDES</h2>
        <p>Choose the background image.</p>
        <div style={{ marginTop: '20px' }}>
          <Link to="/step/2"><button>Back</button></Link>
          <Link to="/step/4"><button>Next</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Step3;
