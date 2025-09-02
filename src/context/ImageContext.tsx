import React, { createContext, useState, useContext, useEffect } from 'react';
import { Project, Slide, MediaFile, MusicFile } from '../services/api';

interface ImageContextType {
  // Project data
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  
  // Legacy support (keeping for compatibility)
  uploadedImage: string | null;
  setUploadedImage: (imageUrl: string | null) => void;
  intro: string;
  setIntro: (intro: string) => void;
  name: string;
  setName: (name: string) => void;
  slides: Slide[];
  setSlides: (slides: Slide[]) => void;
  
  // New enhanced features
  media: MediaFile[];
  setMedia: (media: MediaFile[]) => void;
  music: MusicFile[];
  setMusic: (music: MusicFile[]) => void;
  selectedTheme: string | null;
  setSelectedTheme: (theme: string | null) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Error handling
  error: string | null;
  setError: (error: string | null) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [intro, setIntro] = useState<string>('In Loving Memory of');
  const [name, setName] = useState<string>('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [music, setMusic] = useState<MusicFile[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-save project data when it changes
  useEffect(() => {
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        name,
        intro,
        theme: selectedTheme,
        slides,
        media,
        music,
        updatedAt: new Date().toISOString()
      };
      setCurrentProject(updatedProject);
    }
  }, [name, intro, selectedTheme, slides, media, music]);

  const value = {
    currentProject,
    setCurrentProject,
    uploadedImage,
    setUploadedImage,
    intro,
    setIntro,
    name,
    setName,
    slides,
    setSlides,
    media,
    setMedia,
    music,
    setMusic,
    selectedTheme,
    setSelectedTheme,
    isLoading,
    setIsLoading,
    error,
    setError
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};
