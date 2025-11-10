import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useImage } from '../context/ImageContext';

function Home() {
  const { isAuthenticated } = useAuth();
  const { clearProject } = useImage();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    clearProject(); // Clear any existing project state
    navigate('/step/1');
  };

  return (
    <div>
      <Navbar />
      <div style={{ 
        textAlign: 'center', 
        marginTop: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', marginTop: '100px' }}>
          Welcome to Connect Studio
        </h1>
        
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={handleCreateNew}
            style={{ 
              fontSize: '28px', 
              padding: '20px 40px',
              backgroundColor: '#b2cc55',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#fff',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Create New Project
          </button>

          {isAuthenticated && (
            <Link to="/my-projects">
              <button style={{ 
                fontSize: '28px', 
                padding: '20px 40px',
                backgroundColor: '#4a90e2',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#fff',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                My Projects
              </button>
            </Link>
          )}
        </div>

        {!isAuthenticated && (
          <p style={{ fontSize: '18px', color: '#666', marginTop: '20px' }}>
            Please <Link to="/auth" style={{ color: '#4a90e2', textDecoration: 'underline' }}>log in</Link> to access your saved projects
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
