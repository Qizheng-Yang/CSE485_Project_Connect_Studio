// ImageContext.tsx
import React, { createContext, useState, useContext } from 'react';


interface Theme {
  id: number;
  src: string;
  alt: string;
}

interface Slide {
  id: string;
  type: 'text' | 'image';
  backgroundImage?: string;
  imageUrl?: string;
  customText?: string;
  customFont?: string;       
  customColor?: string;     
  customDuration?: string;
  order: number;
  
  transition?: string;
  effect?: string;
  border?: string;
  background?: string;
}

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  order: number;
}

interface ImageContextType {
  uploadedImage: string | null;
  setUploadedImage: (imageUrl: string | null) => void;
  intro: string;
  setIntro: (intro: string) => void;
  name: string;
  setName: (name: string) => void;
  selectedTheme: Theme | null;
  setSelectedTheme: (theme: Theme | null) => void;
  slides: Slide[];
  setSlides: (slides: Slide[]) => void;
  mediaItems: MediaItem[];
  setMediaItems: (items: MediaItem[]) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [intro, setIntro] = useState<string>('In Loving Memory of');
  const [name, setName] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  return (
    <ImageContext.Provider value={{ 
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
      setMediaItems
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
