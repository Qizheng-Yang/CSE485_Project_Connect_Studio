// src/context/ImageContext.tsx

import { createContext, useState, useContext, ReactNode } from 'react';

// --- Interfaces ---
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
  isLinkEnabled: boolean;
  setIsLinkEnabled: (enabled: boolean) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [intro, setIntro] = useState<string>('In Loving Memory of');
  const [name, setName] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLinkEnabled, setIsLinkEnabled] = useState(false);

  
  const value = { 
    uploadedImage, setUploadedImage, 
    intro, setIntro, 
    name, setName, 
    selectedTheme, setSelectedTheme,
    slides, setSlides,
    mediaItems, setMediaItems,
    isLinkEnabled,
    setIsLinkEnabled // This line is the key to fixing the bug.
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};
