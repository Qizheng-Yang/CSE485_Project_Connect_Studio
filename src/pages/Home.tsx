import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  return (
    <div>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <Link to="/create">
          <button style={{ fontSize: '24px', padding: '10px 20px' }}>Create Video</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
