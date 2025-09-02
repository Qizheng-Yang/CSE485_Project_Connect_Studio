const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Project {
  id: string;
  name: string;
  intro: string;
  theme?: string;
  slides: Slide[];
  media: MediaFile[];
  music: MusicFile[];
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'processing' | 'completed';
}

export interface Slide {
  backgroundImage: string;
  customText: string;
  customFont: string;
  customColor: string;
  customDuration: string;
  transition?: string;
  effect?: string;
  border?: string;
  background?: string;
}

export interface MediaFile {
  id: string;
  originalName: string;
  filename: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

export interface MusicFile extends MediaFile {
  duration?: string;
}

// Project API
export const createProject = async (projectData: Partial<Project>): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create project');
  }

  return response.json();
};

export const updateProject = async (projectId: string, updates: Partial<Project>): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update project');
  }

  return response.json();
};

export const getProject = async (projectId: string): Promise<Project> => {
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get project');
  }

  return response.json();
};

export const getAllProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${API_BASE_URL}/projects`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get projects');
  }

  return response.json();
};

// Media API
export const uploadFile = async (file: File): Promise<MediaFile> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/media/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  const result = await response.json();
  return result.file;
};

export const uploadMultipleFiles = async (files: File[]): Promise<MediaFile[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_BASE_URL}/media/upload-multiple`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }

  const result = await response.json();
  return result.files;
};

export const deleteFile = async (filename: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/media/${filename}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete file');
  }
};

// Video API
export const generatePreview = async (projectData: any): Promise<{ previewId: string; url: string }> => {
  const response = await fetch(`${API_BASE_URL}/video/preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate preview');
  }

  return response.json();
};

export const generateVideo = async (projectData: any): Promise<{ videoId: string; status: string }> => {
  const response = await fetch(`${API_BASE_URL}/video/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(projectData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate video');
  }

  return response.json();
};

export const getVideoStatus = async (videoId: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/video/status/${videoId}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get video status');
  }

  return response.json();
};