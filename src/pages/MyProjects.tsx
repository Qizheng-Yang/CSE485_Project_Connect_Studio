import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useImage } from '../context/ImageContext';
import { projectsAPI } from '../services/api';

interface Project {
  id: number;
  title: string;
  intro_text: string;
  theme_id: number | null;
  theme_name?: string;
  theme_thumbnail?: string;
  full_access_enabled: boolean;
  status: string;
  created_at: string;
  updated_at: string;
}

function MyProjects() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { loadProject, setCurrentProject } = useImage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getAll();
        setProjects(response.projects || []);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch projects:', err);
        setError(err.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [isAuthenticated, navigate]);

  const handleLoadProject = async (projectId: number) => {
    try {
      setLoading(true);
      await loadProject(projectId.toString());
      // Navigate to the first step to continue editing
      navigate('/step/1');
    } catch (err: any) {
      console.error('Failed to load project:', err);
      alert(`Failed to load project: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await projectsAPI.delete(projectId.toString());
      // Remove from local state
      setProjects(projects.filter(p => p.id !== projectId));
      alert('Project deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete project:', err);
      alert(`Failed to delete project: ${err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Navbar />
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 20px',
        marginTop: '80px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ fontSize: '36px', margin: 0 }}>My Projects</h1>
          <Link to="/step/1">
            <button style={{ 
              fontSize: '18px', 
              padding: '12px 24px',
              backgroundColor: '#b2cc55',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#fff'
            }}>
              + Create New Project
            </button>
          </Link>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#666' }}>
            Loading your projects...
          </div>
        )}

        {error && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            fontSize: '18px', 
            color: '#d32f2f',
            backgroundColor: '#ffebee',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px', 
            fontSize: '18px', 
            color: '#999',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <p style={{ marginBottom: '20px' }}>You don't have any projects yet.</p>
            <Link to="/step/1">
              <button style={{ 
                fontSize: '18px', 
                padding: '12px 24px',
                backgroundColor: '#b2cc55',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                color: '#fff'
              }}>
                Create Your First Project
              </button>
            </Link>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px'
          }}>
            {projects.map(project => (
              <div 
                key={project.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div onClick={() => handleLoadProject(project.id)}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <h3 style={{ 
                      fontSize: '20px', 
                      margin: 0,
                      color: '#333',
                      fontWeight: 'bold',
                      flex: 1
                    }}>
                      {project.title || 'Untitled Project'}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: project.status === 'completed' ? '#4caf50' : 
                                     project.status === 'processing' ? '#ff9800' : '#2196f3',
                      color: '#fff',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      marginLeft: '8px'
                    }}>
                      {project.status}
                    </span>
                  </div>

                  <p style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    marginBottom: '12px',
                    fontStyle: 'italic'
                  }}>
                    {project.intro_text || 'No intro text'}
                  </p>

                  <div style={{ 
                    fontSize: '13px', 
                    color: '#999',
                    marginBottom: '16px'
                  }}>
                    <div>Theme: {project.theme_name || `Theme ${project.theme_id || 1}`}</div>
                    <div>Last updated: {formatDate(project.updated_at)}</div>
                    <div>Created: {formatDate(project.created_at)}</div>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  gap: '8px',
                  borderTop: '1px solid #eee',
                  paddingTop: '16px'
                }}>
                  <button
                    onClick={() => handleLoadProject(project.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      fontSize: '14px',
                      backgroundColor: '#b2cc55',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: '#fff'
                    }}
                  >
                    Open Project
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id, project.title);
                    }}
                    style={{
                      padding: '10px 16px',
                      fontSize: '14px',
                      backgroundColor: '#fff',
                      border: '2px solid #d32f2f',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      color: '#d32f2f'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProjects;

