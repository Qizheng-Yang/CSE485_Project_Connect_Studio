// ImageContext.tsx
import React, { createContext, useState, useContext } from 'react';


interface Slide {
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

interface ImageContextType {
  uploadedImage: string | null;
  setUploadedImage: (imageUrl: string | null) => void;
  intro: string;
  setIntro: (intro: string) => void;
  name: string;
  setName: (name: string) => void;
  slides: Slide[];
  setSlides: (slides: Slide[]) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [intro, setIntro] = useState<string>('In Loving Memory of');
  const [name, setName] = useState<string>('');
  const [slides, setSlides] = useState<Slide[]>([]);

  return (
    <ImageContext.Provider value={{ uploadedImage, setUploadedImage, intro, setIntro, name, setName, slides, setSlides }}>
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
