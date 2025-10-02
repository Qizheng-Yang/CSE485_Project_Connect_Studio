// API service for connecting to backend
const API_BASE_URL = 'http://localhost:3001/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Auth API calls
export const authAPI = {
  register: async (email: string, password: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  verifyToken: async () => {
    return apiRequest('/auth/verify');
  },
};

// Projects API calls
export const projectsAPI = {
  getAll: async () => {
    return apiRequest('/projects');
  },

  getById: async (id: string) => {
    return apiRequest(`/projects/${id}`);
  },

  create: async (projectData: {
    title: string;
    intro_text?: string;
    theme_id?: number;
    full_access_enabled?: boolean;
  }) => {
    return apiRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  update: async (id: string, projectData: any) => {
    return apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Media API calls
export const mediaAPI = {
  upload: async (projectId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/media/upload/${projectId}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    return response.json();
  },

  getProjectMedia: async (projectId: string) => {
    return apiRequest(`/media/project/${projectId}`);
  },

  deleteFile: async (fileId: string) => {
    return apiRequest(`/media/${fileId}`, {
      method: 'DELETE',
    });
  },

  getFileUrl: (fileId: string) => {
    return `${API_BASE_URL}/media/file/${fileId}`;
  },

  setMainImage: async (projectId: string, fileId: string) => {
    return apiRequest(`/media/main-image/${projectId}/${fileId}`, {
      method: 'PUT',
    });
  },
};

// Themes API calls
export const themesAPI = {
  getAll: async () => {
    return apiRequest('/themes');
  },

  getById: async (id: string) => {
    return apiRequest(`/themes/${id}`);
  },
};

// Slides API calls
export const slidesAPI = {
  getProjectSlides: async (projectId: string) => {
    return apiRequest(`/slides/project/${projectId}`);
  },

  saveProjectSlides: async (projectId: string, slides: any[]) => {
    return apiRequest(`/slides/project/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({ slides }),
    });
  },

  deleteProjectSlides: async (projectId: string) => {
    return apiRequest(`/slides/project/${projectId}`, {
      method: 'DELETE',
    });
  },
};

export { getAuthToken, setAuthToken, removeAuthToken };
