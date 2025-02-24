import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepNavigation from '../components/StepNavigation';

function Step1() {
  return (
    <div>
      <Navbar />
      <StepNavigation />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Step 1: Upload Main Image</h2>
        <input type="file" accept="image/*" />
        <h3>Title:</h3>
        <input type="text" placeholder="Insert Name" />
        <div style={{ marginTop: '20px' }}>
          <Link to="/create"><button>Back</button></Link>
          <Link to="/step/2"><button>Next</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Step1;
