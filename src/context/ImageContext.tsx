// ImageContext.tsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { projectsAPI, mediaAPI, slidesAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface Theme {
  id: number;
  src: string;
  alt: string;
}

export interface Slide {
  id: string;
  type: 'text' | 'image';
  backgroundImage?: string;
  imageUrl?: string;
  mediaFileId?: string | null;
  customText?: string;
  customFont?: string;       
  customColor?: string;     
  customDuration?: string;
  order: number;
  
  transition?: string;
  effect?: string;
  border?: string;
  background?: string;

  filters?: { brightness: number; contrast: number; saturation: number; blur: number; }
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video' | 'audio';
  order: number;
  fileId?: string; // Backend file ID
  filename?: string;
  originalFilename?: string;
  duration?: string; // For audio files

  filters?: { brightness: number; contrast: number; saturation: number; blur: number; }
}

interface Project {
  id: string;
  title: string;
  intro_text: string;
  theme_id: number | null;
  full_access_enabled: boolean;
  status: string;
}

interface ImageContextType {
  // Project management
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  createProject: (title: string, intro: string, themeId?: number, fullAccess?: boolean) => Promise<Project | null>;
  updateProject: (updates: Partial<Project>) => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;

  // Legacy support (for existing components)
  uploadedImage: string | null;
  setUploadedImage: (imageUrl: string | null) => void;
  intro: string;
  setIntro: (intro: string) => void;
  name: string;
  setName: (name: string) => void;
  selectedTheme: Theme | null;
  setSelectedTheme: (theme: Theme | null) => void;
  
  // Media and slides
  slides: Slide[];
  mediaItems: MediaItem[];
  setMediaItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  setSlides: React.Dispatch<React.SetStateAction<Slide[]>>;

  // File upload functions
  uploadMainImage: (file: File) => Promise<string | null>;
  uploadMediaFiles: (files: File[]) => Promise<MediaItem[]>;
  uploadMusicFiles: (files: File[]) => Promise<MediaItem[]>;
  
  // Slide management functions
  saveSlides: (slidesToSave?: Slide[]) => Promise<void>;
  loadSlides: () => Promise<void>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;

  isLinkEnabled: boolean;
  setIsLinkEnabled: (enabled: boolean) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Project state
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  // Legacy state (for backward compatibility)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [intro, setIntro] = useState<string>('In Loving Memory of');
  const [name, setName] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  
  const [isLinkEnabled, setIsLinkEnabled] = useState(false);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create new project
  const createProject = async (title: string, intro: string, themeId?: number, fullAccess?: boolean): Promise<Project | null> => {
    if (!isAuthenticated) {
      setError('Please log in to create a project');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await projectsAPI.create({
        title,
        intro_text: intro,
        theme_id: themeId || 1,
        full_access_enabled: fullAccess || false
      });

      const project: Project = {
        id: response.project.id.toString(),
        title: response.project.title,
        intro_text: response.project.intro_text,
        theme_id: response.project.theme_id,
        full_access_enabled: response.project.full_access_enabled,
        status: response.project.status
      };

      setCurrentProject(project);
      
      // Update legacy state
      setName(title);
      setIntro(intro);
      
      return project;
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing project
  const updateProject = async (updates: Partial<Project>): Promise<void> => {
    if (!currentProject) {
      setError('No active project to update');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await projectsAPI.update(currentProject.id, updates);
      
      setCurrentProject(prev => prev ? { ...prev, ...updates } : null);
      
      // Update legacy state if needed
      if (updates.title) setName(updates.title);
      if (updates.intro_text) setIntro(updates.intro_text);
      
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
    } finally {
      setIsLoading(false);
    }
  };

  // Load existing project
  const loadProject = async (projectId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await projectsAPI.getById(projectId);
      const project = response.project;

      const projectData: Project = {
        id: project.id.toString(),
        title: project.title,
        intro_text: project.intro_text,
        theme_id: project.theme_id,
        full_access_enabled: project.full_access_enabled,
        status: project.status
      };

      setCurrentProject(projectData);
      
      // Update legacy state
      setName(project.title);
      setIntro(project.intro_text);
      
      // Load media files
      if (project.mediaFiles && project.mediaFiles.length > 0) {
        const mediaItems: MediaItem[] = project.mediaFiles.map((file: any) => ({
          id: file.id.toString(),
          url: mediaAPI.getFileUrl(file.id),
          type: file.file_type,
          order: file.order_index,
          fileId: file.id.toString(),
          filename: file.filename,
          originalFilename: file.original_filename,
          duration: file.duration || '0:00' // For audio files
        }));
        setMediaItems(mediaItems);
        
        // Set main image if exists
        const mainImage = project.mediaFiles.find((f: any) => f.is_main_image);
        if (mainImage) {
          setUploadedImage(mediaAPI.getFileUrl(mainImage.id));
        }
      }

      // Load slides for this project
      try {
        const slidesResponse = await slidesAPI.getProjectSlides(projectData.id);
        if (slidesResponse.slides) {
          const loadedSlides: Slide[] = slidesResponse.slides.map((slide: any) => ({
            id: slide.id,
            type: slide.type,
            backgroundImage: slide.backgroundImage,
            mediaFileId: slide.mediaFileId,
            order: slide.order,
            customText: slide.customText,
            customFont: slide.customFont,
            customColor: slide.customColor,
            customDuration: slide.customDuration,
            transition: slide.transition,
            effect: slide.effect,
            filters: slide.filters
          }));
          setSlides(loadedSlides);
        }
      } catch (slidesError) {
        console.warn('Could not load slides:', slidesError);
        // Continue without slides - not critical
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  };

  // Upload main image
  const uploadMainImage = async (file: File): Promise<string | null> => {
    let projectToUse = currentProject;
    
    if (!projectToUse) {
      // Create a project first if none exists
      projectToUse = await createProject(name || 'Untitled Project', intro);
      if (!projectToUse) return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaAPI.upload(projectToUse.id, [file]);
      
      if (response.files && response.files.length > 0) {
        const uploadedFile = response.files[0];
        const imageUrl = mediaAPI.getFileUrl(uploadedFile.id);
        
        // Set as main image
        try {
          await mediaAPI.setMainImage(projectToUse.id, uploadedFile.id);
        } catch (setMainError) {
          console.warn('Could not set as main image:', setMainError);
          // Continue anyway - the upload was successful
        }
        
        setUploadedImage(imageUrl);
        return imageUrl;
      }
      
      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Upload multiple media files
  const uploadMediaFiles = async (files: File[]): Promise<MediaItem[]> => {
    if (!currentProject) {
      setError('Please create a project first');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaAPI.upload(currentProject.id, files);
      
      if (response.files) {
        const newMediaItems: MediaItem[] = response.files.map((file: any) => ({
          id: file.id.toString(),
          url: mediaAPI.getFileUrl(file.id),
          type: file.fileType,
          order: file.orderIndex,
          fileId: file.id.toString(),
          filename: file.filename,
          originalFilename: file.originalFilename
        }));
        
        setMediaItems(prev => [...prev, ...newMediaItems]);
        return newMediaItems;
      }
      
      return [];
    } catch (err: any) {
      setError(err.message || 'Failed to upload files');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Upload music files specifically
  const uploadMusicFiles = async (files: File[]): Promise<MediaItem[]> => {
    if (!currentProject) {
      setError('Please create a project first');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await mediaAPI.upload(currentProject.id, files);
      
      if (response.files) {
        const newMusicItems: MediaItem[] = response.files.map((file: any) => ({
          id: file.id.toString(),
          url: mediaAPI.getFileUrl(file.id),
          type: file.fileType,
          order: file.orderIndex,
          fileId: file.id.toString(),
          filename: file.filename,
          originalFilename: file.originalFilename,
          duration: file.duration || '0:00' // Will be calculated on frontend
        }));
        
        // Add to mediaItems (music files are also media files)
        setMediaItems(prev => [...prev, ...newMusicItems]);
        return newMusicItems;
      }
      
      return [];
    } catch (err: any) {
      setError(err.message || 'Failed to upload music files');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Save slides to database
  const saveSlides = async (slidesToSave?: Slide[]): Promise<void> => {
    if (!currentProject) {
      setError('Please create a project first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use provided slides or fall back to state slides
      const slidesData = (slidesToSave || slides).map(slide => ({
        id: slide.id,
        type: slide.type,
        backgroundImage: slide.backgroundImage,
        mediaFileId: slide.mediaFileId || null,
        order: slide.order,
        duration: parseFloat(slide.customDuration || '5'),
        transition: slide.transition || 'fade',
        filters: slide.filters || null,
        customText: slide.customText || '',
        customFont: slide.customFont || 'Montserrat',
        customColor: slide.customColor || '#000000'
      }));

      await slidesAPI.saveProjectSlides(currentProject.id, slidesData);
      console.log('Slides saved successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to save slides');
    } finally {
      setIsLoading(false);
    }
  };

  // Load slides from database
  const loadSlides = async (): Promise<void> => {
    if (!currentProject) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await slidesAPI.getProjectSlides(currentProject.id);
      
      if (response.slides) {
        const loadedSlides: Slide[] = response.slides.map((slide: any) => ({
          id: slide.id,
          type: slide.type,
          backgroundImage: slide.backgroundImage,
          mediaFileId: slide.mediaFileId,
          order: slide.order,
          customText: slide.customText,
          customFont: slide.customFont,
          customColor: slide.customColor,
          customDuration: slide.customDuration,
          transition: slide.transition,
          effect: slide.effect,
          filters: slide.filters
        }));
        
        setSlides(loadedSlides);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load slides');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-create project when user starts entering data (disabled for now to avoid conflicts)
  // useEffect(() => {
  //   if (isAuthenticated && !currentProject && (name || intro !== 'In Loving Memory of')) {
  //     // Auto-create project when user starts working
  //     const timer = setTimeout(() => {
  //       if (!currentProject) {
  //         createProject(name || 'Untitled Project', intro);
  //       }
  //     }, 2000); // Wait 2 seconds before auto-creating

  //     return () => clearTimeout(timer);
  //   }
  // }, [name, intro, isAuthenticated, currentProject]);

  return (
    <ImageContext.Provider value={{ 
      // Project management
      currentProject,
      setCurrentProject,
      createProject,
      updateProject,
      loadProject,
      
      // Legacy support
      uploadedImage, 
      setUploadedImage, 
      intro, 
      setIntro, 
      name, 
      setName, 
      selectedTheme, 
      setSelectedTheme,
      slides, 
      setSlides,
      mediaItems,
      setMediaItems,
      
      // File uploads
      uploadMainImage,
      uploadMediaFiles,
      uploadMusicFiles,
      
      // Slide management
      saveSlides,
      loadSlides,
      
      // Loading states
      isLoading,
      error,
      
      isLinkEnabled,
      setIsLinkEnabled
      
    }}>
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
