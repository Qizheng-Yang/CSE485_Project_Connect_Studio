import React, { createContext, useState, useContext } from 'react';

// Define the context type
interface ImageContextType {
  uploadedImage: string | null;
  setUploadedImage: (imageUrl: string | null) => void;
  name: string;
  setName: (name: string) => void;
}

// Create the context
const ImageContext = createContext<ImageContextType | undefined>(undefined);

// Create a provider component
export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [name, setName] = useState<string>('');

  return (
    <ImageContext.Provider value={{ uploadedImage, setUploadedImage, name, setName }}>
      {children}
    </ImageContext.Provider>
  );
};

// Custom hook to use the ImageContext
export const useImage = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};