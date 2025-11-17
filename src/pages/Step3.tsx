import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useImage } from '../context/ImageContext';
import { MediaItem, Slide } from '../context/ImageContext';
import PhotoGalleryLink from '../components/PhotoGalleryLink'; 
import { useDropzone } from 'react-dropzone';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { HexColorPicker } from "react-colorful";

// Font imports
import "@fontsource/montserrat"; 
import "@fontsource/alex-brush"; 
import "@fontsource/alegreya"; 
import "@fontsource/dancing-script"; 
import "@fontsource/great-vibes"; 
import "@fontsource/pacifico"; 
import "@fontsource/roboto-slab"; 
import "@fontsource/playfair-display"; 
import "@fontsource/lobster"; 
import "@fontsource/raleway"; 
import "@fontsource/open-sans"; 

// Cropping import
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';


// Blemish import
import * as StackBlur from 'stackblur-canvas';


// Import local images for text slide backgrounds
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';
//import testImage from '../assets/redEye.png';

import memorialChoice from '../assets/memorialQuote.png';
import weddingChoice from '../assets/weddingQuote.png';
import retirementChoice from '../assets/retirementQuote.png';
import anniversaryChoice from '../assets/anniversaryQuote.png';


const fonts = [
  'Montserrat',
  'Alex Brush',
  'Alegreya',
  'Dancing Script',
  'Great Vibes',
  'Pacifico',
  'Roboto Slab',
  'Playfair Display',
  'Lobster',
  'Raleway',
  'Open Sans'
];

// Filter effects for media
const filterEffects = [
  { name: 'Normal', value: 'none' },
  { name: 'Grayscale', value: 'grayscale(100%)' },
  { name: 'Sepia', value: 'sepia(100%)' },
  { name: 'Blur', value: 'blur(2px)' },
  { name: 'Saturate', value: 'saturate(200%)' }
];

// Transition options
const transitionOptions = [
  { name: 'fade' },
  { name: 'slide' },
  { name: 'zoom' },
  { name: 'wipe' },
  { name: 'dissolve' }
];

// --- QUOTE CATEGORIES and QUOTES ---
const quoteCategories = [
  {
    label: "Memorial",
    img: memorialChoice,
    quotes: [
      "In Loving Memory",
      "Those we love remain with us",
      "Your life was a blessing",
      "Forever in our hearts",
      "Gone but never forgotten",
    ],
  },
  {
    label: "Wedding",
    img: weddingChoice,
    quotes: [
      "With Love Always",
      "Two hearts, one soul",
      "Our journey begins",
      "To have and to hold",
      "Celebrating our love",
    ],
  },
  {
    label: "Retirement",
    img: retirementChoice,
    quotes: [
      "Celebrating a Life Well Lived",
      "Happy Retirement",
      "Endless adventures await",
      "Thank you for your dedication",
      "Enjoy your new chapter",
    ],
  },
  {
    label: "Anniversary",
    img: anniversaryChoice,
    quotes: [
      "Cherished Moments",
      "Years of Love",
      "Growing Together",
      "Here's to many more",
      "Our love story continues",
    ],
  },
];

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

interface SlideForm {
  backgroundImage: string;
  customText: string;
  customFont: string;
  customColor: string;
  customDuration: string;
  selectedQuote?: string;
}


const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {/* Drag Handle - small area in top-left corner */}
      <div 
        {...listeners}
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '24px',
          height: '24px',
          cursor: 'move',
          zIndex: 50,
          backgroundColor: 'rgba(178, 204, 85, 0.8)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          color: 'white',
          fontWeight: 'bold'
        }}
        title="Drag to reorder"
      >
        ⋮⋮
      </div>
      {children}
    </div>
  );
};


export function parseThemeAndQuote(quoteOverlay?: string): { theme: string; quoteNumber: number } | null {
  if (!quoteOverlay) return null;
  const match = quoteOverlay.match(/^quote(\d+)\.png$/);
  if (!match) return null;
  return {
    theme: match[1],
    
    quoteNumber: parseInt(match[2], 10),
  };
}


// Helper for cropping
async function getCroppedImg(imageSrc: string, crop: Area | null): Promise<string> {
  if (!crop) return imageSrc;
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');

      canvas.width = 1250;
      canvas.height = 760;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, 1250, 760);

      canvas.toBlob(blob => {
        if (!blob) reject(new Error('Canvas is empty'));
        else resolve(URL.createObjectURL(blob));
      }, 'image/png');
    };
    image.onerror = error => reject(error);
  });
}



function Step3() {
  const { 
    slides, 
    setSlides, 
    mediaItems, 
    setMediaItems, 
    uploadMediaFiles,
    currentProject,
    isLoading,
    error,
    saveSlides
  } = useImage();
  const [activeTab, setActiveTab] = useState<'slides' | 'photos'>('slides');
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState('Normal');
  const [selectedTransition, setSelectedTransition] = useState('fade');
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  // Current slide being created
  const [currentSlide, setCurrentSlide] = useState<SlideForm>({
    backgroundImage: '',
    customText: '',
    customFont: 'Montserrat',
    customColor: '#000000',
    customDuration: '5',
    selectedQuote: undefined,
  });


  const { selectedTheme } = useImage();


  const [categoryIdx, setCategoryIdx] = useState(0); // Category
  
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  // Cropping state
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // Filters state
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  // Blemish & red eye
  const [activeTool, setActiveTool] = useState<null | "blemish" | "redeye">(null);
  const [brushSize, setBrushSize] = useState(25);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState<{x: number, y: number} | null>(null);

  const [canvasSize, setCanvasSize] = useState({ width: 600, height:400 });


 useEffect(() => {
    if (!selectedImage || activeTool !== 'blemish' && activeTool !== 'redeye') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = selectedImage.url;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [selectedImage, activeTool]);
  
  // OG state stored
  const originalFilters = useRef({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
  });

  // Filters reset for new image for editing
  useEffect(() => { 
    if (selectedImage) {
      originalFilters.current = { brightness, contrast, saturation, blur };
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setBlur(0);
    }
  }, [selectedImage]);
  
  // CSS filter string
  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;


  // Save & Exit
  const handleSaveAndExit = () => {
    if (!selectedImage) return;
    const filters = { brightness, contrast, saturation, blur };
  
    setMediaItems((prevItems: MediaItem[]): MediaItem[] =>
      prevItems.map((item: MediaItem) =>
        item.id === selectedImage.id ? { ...item, filters } : item
      )
    );
  
    setSlides((prevSlides: Slide[]): Slide[] =>
      prevSlides.map((slide: Slide) =>
        slide.backgroundImage === selectedImage.url || slide.imageUrl === selectedImage.url 
          ? { ...slide, filters } 
          : slide
      )
    );
  
    setSelectedImage(null);
    setIsEditing(false);
    setIsCropping(false);
  
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
  };
  
  
  
  useEffect(() => {
    if (selectedImage) {
      // Try loading filters from slide or media (id or url match)
      const foundMedia = mediaItems.find(item => item.id === selectedImage.id);
      const foundSlide = slides.find(slide => slide.backgroundImage === selectedImage.url);
  
      const filters =
        foundMedia?.filters ||
        foundSlide?.filters || 
        { brightness: 100, contrast: 100, saturation: 100, blur: 0 };
      setBrightness(filters.brightness);
      setContrast(filters.contrast);
      setSaturation(filters.saturation);
      setBlur(filters.blur);
    }
  }, [selectedImage, slides, mediaItems]);
  
  
  

  // Handling the Crop
  const handleCropSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
  
    const croppedImage = await getCroppedImg(selectedImage.url, croppedAreaPixels);

    const updateMediaItems = (prevItems: MediaItem[]) => 
      prevItems.map(item => item.id === selectedImage.id ? { ...item, url: croppedImage } : item);

    const updateSlides = (prevSlides: Slide[]) =>
      prevSlides.map(slide =>
        slide.backgroundImage === selectedImage.url || slide.imageUrl === selectedImage.url 
          ? { ...slide, backgroundImage: croppedImage, imageUrl: croppedImage } 
          : slide
      );
    
    setSelectedImage(prev =>
      prev ? { ...prev, url: croppedImage } : null
    );
      
    
    setMediaItems(updateMediaItems(mediaItems));
    setSlides(updateSlides(slides));
      

    setIsEditing(false);
    setIsCropping(false);
  };
  
  // Handler Blemish
  function healBlemish(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    const d = radius * 2;
    const areaX = x - radius;
    const areaY = y - radius;
  
    // Pixel patch
    const imageData = ctx.getImageData(areaX, areaY, d, d);
  
    // StackBlur on it
    StackBlur.imageDataRGBA(imageData, 0, 0, d, d, Math.floor(radius * 0.1));
  
    // Blurred area into a temp canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = d;
    tempCanvas.height = d;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
  
    tempCtx.putImageData(imageData, 0, 0);
  
    // For soft edge
    tempCtx.globalCompositeOperation = 'destination-in';
    const gradient = tempCtx.createRadialGradient(
      radius, radius, radius * 0.6,  
      radius, radius, radius      
    );
    gradient.addColorStop(0, 'rgba(0,0,0,1)');  
    gradient.addColorStop(1, 'rgba(0,0,0,0)');   
  
    tempCtx.fillStyle = gradient;
    tempCtx.fillRect(0, 0, d, d);
    tempCtx.globalCompositeOperation = 'source-over';
  
    // Back on main
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.drawImage(tempCanvas, areaX, areaY);
    ctx.restore();
  }
  
  

  


  const handleBlemishSave = () => {
    if (!selectedImage || !canvasRef.current) return;
  
    const blemishedImage = canvasRef.current.toDataURL("image/png");
  
    // Update media items
    const updateMediaItems = (prevItems: MediaItem[]) =>
      prevItems.map(item => item.id === selectedImage.id ? { ...item, url: blemishedImage } : item);
  
    // Update slides
    const updateSlides = (prevSlides: Slide[]) =>
      prevSlides.map(slide =>
        slide.backgroundImage === selectedImage.url || slide.imageUrl === selectedImage.url 
          ? { ...slide, backgroundImage: blemishedImage, imageUrl: blemishedImage } 
          : slide
      );
  
    setSelectedImage(prev =>
      prev ? { ...prev, url: blemishedImage } : null
    );
    
    setMediaItems(updateMediaItems(mediaItems));
    setSlides(updateSlides(slides));
      
    setIsEditing(false); 
    setActiveTool(null); 
  };
  


  // Handler RedEye
  function removeRedEye(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ) {
    const canvas = ctx.canvas;
    const sx = Math.max(Math.floor(x - radius), 0);
    const sy = Math.max(Math.floor(y - radius), 0);
    const w = Math.min(radius * 2, canvas.width - sx);
    const h = Math.min(radius * 2, canvas.height - sy);
  
    const imageData = ctx.getImageData(sx, sy, w, h);
    const data = imageData.data;
  
    for (let px = 0; px < data.length; px += 4) {
      const r = data[px], g = data[px + 1], b = data[px + 2];

      // Only correcting the red
      const isRed = r > 90 && g < 100 && b < 100;
      const isWhite = r > 180 && g > 200 && b > 200;
      if (isRed && !isWhite) {
        data[px] = 50;      // R
        data[px + 1] = 40;  // G
        data[px + 2] = 45;  // B
      }

    }
    
    ctx.putImageData(imageData, sx, sy);
  }

  
  

  const handleRedEyeSave = () => {
    if (!selectedImage || !canvasRef.current) return;
  
    const redEyeImage = canvasRef.current.toDataURL("image/png");
  
    // Update media items
    const updateMediaItems = (prevItems: MediaItem[]) =>
      prevItems.map(item => item.id === selectedImage.id ? { ...item, url: redEyeImage } : item);
  
    // Update slides
    const updateSlides = (prevSlides: Slide[]) =>
      prevSlides.map(slide =>
        slide.backgroundImage === selectedImage.url || slide.imageUrl === selectedImage.url 
          ? { ...slide, backgroundImage: redEyeImage, imageUrl: redEyeImage } 
          : slide
      );
  
    setSelectedImage(prev =>
      prev ? { ...prev, url: redEyeImage } : null
    );
    
    setMediaItems(updateMediaItems(mediaItems));
    setSlides(updateSlides(slides));
      
    setIsEditing(false); 
    setActiveTool(null); 
  };


  

  // Click outside handler for color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerVisible(false);
      }
    };

    if (isColorPickerVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorPickerVisible]);

  // Auto-save slides when they change
  useEffect(() => {
    if (!currentProject || slides.length === 0) return;

    // Debounce the auto-save to avoid too many requests
    const timer = setTimeout(async () => {
      try {
        console.log('Auto-saving slides...');
        await saveSlides(slides);
        console.log('Slides auto-saved successfully');
      } catch (error) {
        console.error('Auto-save failed:', error);
        // Don't show alert for auto-save failures to avoid interrupting the user
      }
    }, 2000); // Wait 2 seconds after last change before saving

    return () => clearTimeout(timer);
  }, [slides, currentProject, saveSlides]);

  // Photo upload handling
  const [uploading, setUploading] = useState(false);
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!currentProject) {
      alert('Please create a project first by going to Step 1');
      return;
    }

    setUploading(true);
    
    try {
      // Upload files to backend
      const uploadedItems = await uploadMediaFiles(acceptedFiles);
      console.log('Files uploaded successfully:', uploadedItems);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [currentProject, uploadMediaFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov']
    },
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      if (activeTab === 'slides') {
        const oldIndex = slides.findIndex(item => item.id === active.id);
        const newIndex = slides.findIndex(item => item.id === over.id);
        const reorderedItems = arrayMove(slides, oldIndex, newIndex);
        const updatedSlides = reorderedItems.map((item, index) => ({ ...item, order: index }));
        setSlides(updatedSlides);
        
        // Save slides to database - pass the updated slides array directly
        try {
          await saveSlides(updatedSlides);
          console.log('Slides reordered and saved to database');
        } catch (error) {
          console.error('Failed to save slides:', error);
        }
      } else {
        const oldIndex = mediaItems.findIndex(item => item.id === active.id);
        const newIndex = mediaItems.findIndex(item => item.id === over.id);
        const reorderedItems = arrayMove(mediaItems, oldIndex, newIndex);
        const updatedItems = reorderedItems.map((item, index) => ({ ...item, order: index }));
        setMediaItems(updatedItems);
      }
    }
  };

  

const handleAddSlide = async () => {
  if (currentSlide.selectedQuote) {
    const newSlide = {
      id: Date.now().toString(),
      type: "themedQuote" as const,
      quoteOverlay: currentSlide.selectedQuote.replace(/^\/?themes\/themed_quotes\//, ""),
      customFont: currentSlide.customFont,
      customColor: currentSlide.customColor,
      customDuration: currentSlide.customDuration,
      order: slides.length,
      transition: selectedTransition,
      effect: filterEffects.find(e => e.name === selectedEffect)?.value || "none",
    };

    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);

    try {
      await saveSlides(updatedSlides);
      console.log("Themed quote slide saved to database");
    } catch (error) {
      console.error("Failed to save themed quote slide:", error);
    }
  } else if (currentSlide.customText) {
    // Find the mediaFileId if this backgroundImage is from an uploaded media file
    const matchingMedia = mediaItems.find(item => item.url === currentSlide.backgroundImage);
    
    const newSlide = {
      id: Date.now().toString(),
      type: "text" as const,
      backgroundImage: currentSlide.backgroundImage,
      imageUrl: currentSlide.backgroundImage,
      mediaFileId: matchingMedia?.fileId || null,
      customText: currentSlide.customText,
      customFont: currentSlide.customFont,
      customColor: currentSlide.customColor,
      customDuration: currentSlide.customDuration,
      order: slides.length,
      transition: selectedTransition,
      effect: filterEffects.find(e => e.name === selectedEffect)?.value || "none",
    };

    const updatedSlides = [...slides, newSlide];
    setSlides(updatedSlides);

    try {
      await saveSlides(updatedSlides);
      console.log("Slide saved to database");
    } catch (error) {
      console.error("Failed to save slide:", error);
    }
  } else {
    // In case not all info added that is required
    console.warn("Slide not added: missing required information");
    return;
  }

  // Reset form after adding the slide
  setCurrentSlide({
    backgroundImage: "",
    customText: "",
    customFont: "Montserrat",
    customColor: "#000000",
    customDuration: "5",
    selectedQuote: undefined, // reset quote selection
  });

  setIsCreatingSlide(false);
};


  



  const removeSlide = async (id: string) => {
    const filteredSlides = slides.filter(slide => slide.id !== id);
    // Reorder the remaining slides
    const reorderedSlides = filteredSlides.map((slide, index) => ({ ...slide, order: index }));
    setSlides(reorderedSlides);
    
    // Save slides to database - pass the updated slides array directly
    try {
      await saveSlides(reorderedSlides);
      console.log('Slides updated in database');
    } catch (error) {
      console.error('Failed to save slides:', error);
    }
  };

  const removeMediaItem = (id: string) => {
    const item = mediaItems.find(item => item.id === id);
    if (item) {
      URL.revokeObjectURL(item.url);
      const filteredItems = mediaItems.filter(item => item.id !== id);
      // Reorder the remaining items
      const reorderedItems = filteredItems.map((item, index) => ({ ...item, order: index }));
      setMediaItems(reorderedItems);
    }
  };

  const themeId = selectedTheme?.id || 1;
  const posterPath = `/themes/theme${themeId}_poster.png`;

  const {uploadedImage} = useImage();

  const displayMediaItems = mediaItems.filter(
    item => item.type !== 'audio' && item.url !== uploadedImage
  );

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      <div className="main-content">
        <h2 className="main-information-header">MEDIA SELECTION</h2>
        
        {/* Tab Navigation */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '30px' }}>
          <button 
            onClick={() => setActiveTab('slides')}
            style={{
              padding: '10px 30px',
              backgroundColor: activeTab === 'slides' ? '#b2cc55' : '#f0f0f0',
              color: activeTab === 'slides' ? 'white' : '#333',
              border: 'none',
              borderRadius: '25px 0 0 25px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Text Slides
          </button>
          <button 
            onClick={() => setActiveTab('photos')}
            style={{
              padding: '10px 30px',
              backgroundColor: activeTab === 'photos' ? '#b2cc55' : '#f0f0f0',
              color: activeTab === 'photos' ? 'white' : '#333',
              border: 'none',
              borderRadius: '0 25px 25px 0',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Photos & Videos
          </button>
        </div>

        {/* TEXT SLIDES TAB */}
        {activeTab === 'slides' && (
          <div>
            {/* Create New Slide Button */}
            {!isCreatingSlide && (
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <button 
                  onClick={() => setIsCreatingSlide(true)}
                  style={{
                    backgroundColor: '#b2cc55',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '15px 30px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  + CREATE NEW TEXT SLIDE
                </button>
              </div>
            )}


            

            {/* Create Slide Form */}
            {isCreatingSlide && (


              <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', marginBottom: '30px' }}>
                <h3>Create Text Slide</h3>

                {/* Text Input */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{fontSize: '16px'}}>Text:</label>
                  <input
                    type="text"
                    value={currentSlide.customText}
                    onChange={(e) => setCurrentSlide(prev => ({ ...prev, customText: e.target.value, selectedQuote: undefined }))}
                    placeholder="Enter your text"
                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '15px'}}
                  />
                </div>

                {/* Quote Categories */}
                <div style={{ marginBottom: 14 }}>
                  <div>Or choose a quote:</div>
                  <div style={{
                    display: 'flex', gap: '10px', marginTop: '5px', marginBottom: '20px', overflowX: 'auto'
                  }}>
                    {quoteCategories.map((cat, idx) => (
                      <button
                        key={cat.label}
                        onClick={() => setCategoryIdx(idx)}
                        style={{
                          border: "none",
                          background: "none",
                          outline: idx === categoryIdx ? "2.5px solid #b2cc55" : "none",
                          borderRadius: 8,
                          padding: 0,
                          cursor: "pointer",
                          opacity: idx === categoryIdx ? 1 : 0.75,
                          boxShadow: idx === categoryIdx ? "0 0 8px #d6f5a6" : "none"
                        }}
                        tabIndex={0}
                      >
                        <img src={cat.img} alt={cat.label} style={{ width: 200, borderRadius: 8 }} />
                      </button>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      gap: 8,
                      marginTop: 0,
                      marginBottom: 12,
                      paddingBottom: 8,
                    }}
                  >
                    {quoteCategories[categoryIdx].quotes.map((quote, qidx) => (
                      <button
                        key={qidx}
                        style={{
                          background:
                            currentSlide.customText === quote
                              ? "#b2cc55"
                              : "#f4f4f4",
                          color:
                            currentSlide.customText === quote
                              ? "#fff"
                              : "#333",
                          border: "1.5px solid #eee",
                          borderRadius: 8,
                          minWidth: 120,
                          minHeight: 44,
                          padding: "6px 10px",
                          fontSize: 14,
                          marginRight: 7,
                          cursor: "pointer",
                          fontWeight: 500,
                          boxShadow:
                            currentSlide.customText === quote
                              ? "0 1px 8px #e0eeca"
                              : undefined,
                        }}
                        onClick={() =>
                          setCurrentSlide((s) => ({ ...s, customText: quote , selectedQuote: undefined}))
                        }
                      >
                        {quote}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font and Color Selection */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Font:</label>
                    <select 
                      value={currentSlide.customFont}
                      onChange={(e) => setCurrentSlide(prev => ({ ...prev, customFont: e.target.value }))}
                      style={{ width: '100%', padding: '8px', marginTop: '5px', fontSize: '15px'}}
                    >
                      {fonts.map(font => (
                        <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '6px' }}>Color:</label>
                    <HexColorPicker
                      color={currentSlide.customColor}
                      onChange={color => setCurrentSlide(prev => ({ ...prev, customColor: color }))}
                      style={{ boxShadow: '0 2px 10px #ddd', borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: currentSlide.customColor,
                        border: '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                    />
                    <span style={{ display: 'block', marginTop: '8px', fontSize: '14px' }}>
                      {currentSlide.customColor}
                    </span>
                  </div>
                </div>


                  <div style={{ flex: 1 }}>
                    <label>Duration (seconds):</label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={currentSlide.customDuration}
                      onChange={(e) => setCurrentSlide(prev => ({ ...prev, customDuration: e.target.value }))}
                      style={{ width: '100%', padding: '8px', marginTop: '5px', fontSize: '15px' }}
                    />
                  </div>
                </div>


                {/* Add Themed Quote Slide Section */}
                {selectedTheme?.id && (
                  <div style={{ margin: '50px 0' }}>
                    <label style={{fontSize: '16px', marginBottom: '8px', display: 'block' }}>
                      Or Select a Theme Based Slide
                    </label>
                    <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => {
                        const themeId = selectedTheme.id;

                        const quotePath = `/themes/themed_quotes/quote${num}.png`;
                        const posterPath = `/themes/theme${themeId}_poster.png`;

                        return (
                          <img 
                            key={quotePath}
                            src={quotePath}
                            alt={`Quote ${num}`}
                            style={{
                              width: 240,
                              borderRadius: '6px',
                              cursor: 'pointer',
                              border: currentSlide.selectedQuote === quotePath ? '3px solid #4CAF50' : '2px solid transparent',
                              backgroundImage: `url(${posterPath})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              position: 'relative',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            onClick={() => {
                              setCurrentSlide({ 
                                ...currentSlide, 
                                selectedQuote: quotePath,
                                backgroundImage: '',
                                customText: '',  
                                customFont: 'Montserrat', 
                                customColor: '#000000'

                              });

                            }}

                          />
                        );
                      })}
                    </div>
                  </div>
                )}


                
                {/* Preview */}
                {(currentSlide.customText || currentSlide.selectedQuote) && (
                  <div style={{ marginBottom: '20px' }}>
                    <p>Preview:</p>
                    <div
                      style={{
                        width: '300px',
                        height: '180px',
                        backgroundImage: `url(${posterPath})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '5px',
                        margin: '0 auto',
                        position: 'relative'
                      }}
                    >
                      {/* Themed quote overlay */}
                      {currentSlide.selectedQuote ? (
                        <img
                          src={currentSlide.selectedQuote}
                          alt="Quote Overlay"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      ) : (
                        // Custom text
                        <span style={{
                          color: currentSlide.customColor,
                          fontFamily: currentSlide.customFont,
                          fontSize: '16px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          padding: '10px',
                          zIndex: 1,
                          position: 'relative'
                        }}>
                          {currentSlide.customText || 'Your text here'}
                        </span>
                      )}
                    </div>
                  </div>
                )}


                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setIsCreatingSlide(false)}
                    style={{
                      backgroundColor: '#ccc',
                      color: '#333',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '10px 20px',
                      cursor: 'pointer',
                      marginTop: '15px',
                      fontSize: '16px'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddSlide}
                    disabled={!(currentSlide.customText || currentSlide.selectedQuote)}
                    style={{
                      backgroundColor:(currentSlide.customText || currentSlide.selectedQuote)? '#b2cc55' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '10px 20px',
                      cursor: currentSlide.customText || currentSlide.selectedQuote? 'pointer' : 'not-allowed',
                      marginTop: '15px',
                      fontSize: '16px'
                    }}
                  >
                    Add Slide
                  </button>
                </div>
              </div>
            )}

            {/* Existing Slides Grid */}
            {slides.length > 0 && (
              <div>
                <h3 style={{ textAlign: 'center' }}>Your Text Slides (Drag to reorder)</h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={slides.map(slide => slide.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                      gap: '20px', 
                      maxWidth: '1000px', 
                      margin: '0 auto' 
                    }}>
                      {slides.map((slide) => {


                        const backgroundImageUrl = (slide.type === 'themedQuote' || slide.customText)
                        ? posterPath
                        : slide.backgroundImage || undefined;


                        return (
                        
                          <SortableItem key={slide.id} id={slide.id}>
                            <div style={{ 
                              position: 'relative',
                              backgroundColor: '#f9f9f9',
                              borderRadius: '10px',
                              padding: '10px'
                            }}>
                              <div
                                style={{
                                  width: '100%',
                                  height: '150px',
                                  backgroundImage: backgroundImageUrl ? `url(${backgroundImageUrl})` : undefined,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  borderRadius: '5px',
                                  marginBottom: '10px',
                                  cursor: slide.backgroundImage ? 'pointer' : 'default',

                                  filter: slide.filters
                                    ? `brightness(${slide.filters.brightness}%) contrast(${slide.filters.contrast}%) saturate(${slide.filters.saturation}%) blur(${slide.filters.blur}px)`
                                    : 'none'
                                }}
                                onClick={() => {
                                  if (!backgroundImageUrl) return;
                                  setSelectedImage({
                                    id: slide.id,
                                    url: backgroundImageUrl,
                                    type: 'image',
                                    order: slide.order
                                  });
                                  setIsEditing(true);
                                  setIsCropping(false);
                                }}
                              >
                                <span style={{
                                  color: slide.customColor,
                                  fontFamily: slide.customFont,
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  textAlign: 'center',
                                  padding: '5px'
                                }}>
                                  {slide.customText}
                                </span>

                                {slide.type === 'themedQuote' && slide.quoteOverlay && (
                                  <img
                                    src={`/themes/themed_quotes/${slide.quoteOverlay}`}
                                    alt="Quote overlay"
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '100%',
                                      height: '150px',
                                      pointerEvents: 'none',
                                      objectFit: 'contain',
                                      borderRadius: '5px',
                                    }}
                                    draggable={false}
                                  />
                                )}


                              </div>
                              <p style={{ fontSize: '12px', margin: '5px 0' }}>
                                Duration: {slide.customDuration}s
                              </p>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  removeSlide(slide.id);
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                }}
                                  style={{
                                    position: 'absolute',
                                    top: '8px',
                                    right: '8px',
                                    background: 'rgba(255,0,0,0.8)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    zIndex: 100,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                              >
                                ×
                              </button>
                            </div>
                          </SortableItem>
                        
                      ) } )  } 
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        )}



        {/* PHOTOS & VIDEOS TAB */}
        {activeTab === 'photos' && (
          <div>
            {/* Upload Area */}
            <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '30px' }}>
              <div {...getRootProps()} style={{
                border: '2px dashed #b2cc55',
                borderRadius: '10px',
                padding: '40px',
                textAlign: 'center',
                backgroundColor: isDragActive ? '#f0f8ff' : (uploading ? '#fff3cd' : '#f9f9f9'),
                cursor: uploading ? 'not-allowed' : 'pointer',
                opacity: uploading ? 0.7 : 1
              }}>
                <input {...getInputProps()} disabled={uploading || !currentProject} />
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                  {uploading ? '⏳' : '📷'}
                </div>
                {uploading ? (
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Uploading files...</p>
                    <p>Please wait while your files are being uploaded to the server</p>
                  </div>
                ) : isDragActive ? (
                  <p>Drop the files here...</p>
                ) : !currentProject ? (
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#666' }}>No Project Active</p>
                    <p>Please go to Step 1 first to create a project</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Upload Photos & Videos</p>
                    <p>Drag & drop files here, or click to select</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>Supports: JPG, PNG, GIF, MP4, MOV (max 50MB)</p>
                  </div>
                )}
              </div>
              
              {/* Show error if any */}
              {error && (
                <div style={{ 
                  color: 'red', 
                  fontSize: '14px', 
                  marginTop: '10px', 
                  padding: '10px', 
                  backgroundColor: '#ffebee', 
                  borderRadius: '5px' 
                }}>
                  {error}
                </div>
              )}
              
              {/* Show current project info */}
              {currentProject && (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#666', 
                  marginTop: '10px',
                  padding: '5px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '3px'
                }}>
                  Project: {currentProject.title}
                </div>
              )}
            </div>

            {/* Media Effects Settings */}
            {mediaItems.length > 0 && (
              <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                <h3>Apply Effects to All Media</h3>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Effect:</label>
                    <select 
                      value={selectedEffect}
                      onChange={(e) => setSelectedEffect(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                      {filterEffects.map(effect => (
                        <option key={effect.name} value={effect.name}>{effect.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label>Transition:</label>
                    <select 
                      value={selectedTransition}
                      onChange={(e) => setSelectedTransition(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                      {transitionOptions.map(transition => (
                        <option key={transition.name} value={transition.name}>{transition.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Media Grid */}
            {mediaItems.length > 0 ? (
              <div>
                <h3 style={{ textAlign: 'center' }}>Your Media (Drag to reorder)</h3>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  
                  <SortableContext 
                    items={mediaItems.map(item => item.id)}
                    strategy={rectSortingStrategy}
                  >
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
                      gap: '15px', 
                      maxWidth: '1000px', 
                      margin: '0 auto' 
                    }}>
                      {displayMediaItems.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                          <div
                            style={{
                              position: 'relative',
                              backgroundColor: '#f9f9f9',
                              borderRadius: 10,
                              padding: 10,
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              if (item.type === 'image') {
                                setSelectedImage(item);
                                setIsEditing(true);
                                setIsCropping(false);
                              }
                            }}
                          >
                            {item.type === 'image' ? (
                              <img
                                src={item.url}
                                alt="Uploaded content"
                                style={{
                                  width: '100%',
                                  height: '150px',
                                  objectFit: 'cover',
                                  borderRadius: '5px',
                                  filter: item.filters
                                    ? `brightness(${item.filters.brightness}%) contrast(${item.filters.contrast}%) saturate(${item.filters.saturation}%) blur(${item.filters.blur}px)`
                                    : 'none',
                                }}
                                draggable={false}
                              />
                            ) : item.type === 'video' ? (
                              <video
                                src={item.url}
                                style={{
                                  width: '100%',
                                  height: '150px',
                                  objectFit: 'cover',
                                  borderRadius: '5px',
                                }}
                                draggable={false}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '100%',
                                  height: '150px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  color: '#999',
                                  fontSize: 14,
                                  fontStyle: 'italic',
                                  borderRadius: '5px',
                                  backgroundColor: '#e0e0e0'
                                }}
                              >
                                {item.type === 'audio' ? '🎵 Audio' : 'No Preview'}
                              </div>
                            )}
                            <p style={{ fontSize: '12px', margin: '5px 0', textAlign: 'center' }}>
                              {item.originalFilename || 'Media file'}
                            </p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                removeMediaItem(item.id);
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'rgba(255,0,0,0.8)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '24px',
                                height: '24px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                zIndex: 100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        </SortableItem>
                      ))}


                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#666' }}>
                <p>No photos or videos uploaded yet.</p>
              </div>
            )}
            
            <PhotoGalleryLink /> 
          </div>
        )}

        {/* Slider UI */}
        <style>
        {`
          input[type="range"] {
            -webkit-appearance: none;
            appearance: none;
          }
          input[type="range"]:focus {
            outline: none;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            background: #b2cc55;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            cursor: pointer;
            border: 2px solid #669900;
            box-shadow: 0 0 4px rgba(0,0,0,0.12);
            margin-top: -7px;
          }
          input[type="range"]::-webkit-slider-runnable-track {
            height: 3px;
            background: #bbb;
            border-radius: 2px;
          }
        `}
        </style>

        {/*Editing Image*/}
        {selectedImage && !isCropping && activeTool !== 'blemish' && activeTool !== 'redeye'&& (
          <>
          {/* Preview PopUp */}
          <div style={{
            position: 'fixed',
            top: 0, bottom: 0, left: 0,
            width: 'calc(100vw - 400px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 300,
          }}>
            <img
              src={selectedImage.url}
              alt="Selected"
              style={{
                filter: filterStyle,
                maxWidth: '80%',
                maxHeight: '80%',
                borderRadius: 8,
                userSelect: 'none',
                boxShadow: '0 0 12px black'
              }}
            />
          </div>


          {/* Right Side Panel */}
          <div style={{
            position: 'fixed',
            top: 0, right: 0,
            width: 400, height: '100%',
            background: '#fff',
            padding: 16,
            boxShadow: '-4px 0 12px rgba(0,0,0,0.2)',
            zIndex: 310,
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Save & Exit button top-right */}
            <button
              onClick= {handleSaveAndExit}
              
              style={{
                alignSelf: 'flex-end',
                background: '#97d154',
                fontSize: 17,
                marginBottom: 16
              }}
              aria-label="Close"
            >
              Save & Exit
            </button>


            <h2>Edit Image</h2>

            <h4 style={{ display: 'flex', alignItems: 'left', fontSize: '19px'}}>Image Position</h4>
              <>
                <button onClick={() => setIsCropping(true)} style={{ marginBottom: 16, fontSize: '16px', marginRight: '70px', marginLeft: '100px'}}>Crop</button>
              </>

            <div>
              {/*Title & reset for filters*/}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 15}}>
                <h4 style={{ fontSize: '19px', marginBottom: 30}}>Adjust Filters</h4>
                <button 
                  onClick={() => {
                    setBrightness(100);
                    setContrast(100);
                    setSaturation(100);
                    setBlur(0);
                  }}
                  style={{
                    backgroundColor: '#f05a4f',
                    border: 'none',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    marginLeft: '10px',
                  }}
                >
                  Reset Filters
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px', marginTop: '1px'}}>
                <label style={{textAlign: 'left' , marginLeft: '30px', fontSize: '18px'}}>Brightness: </label>
                <input 
                  type="range" 
                  min={0} max={200}  
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  style={{ flex: '1 1 auto', marginLeft:'22px'}}
                  value={brightness}
                />
                <label style={{textAlign: 'right', marginLeft: '20px' }}>{brightness}%</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px', marginTop: '1px'}}>
                <label style={{textAlign: 'left' , marginLeft: '30px', fontSize: '18px'}}>Contrast: </label>
                <input 
                  type="range" 
                  min={0} max={200}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  style={{ flex: '1 1 auto', marginLeft:'43px'}}
                  value={contrast}
                />
                <label style={{textAlign: 'right', marginLeft: '20px' }}>{contrast}%</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px', marginTop: '1px'}}>
                <label style={{textAlign: 'left' , marginLeft: '30px', fontSize: '18px'}}>Saturation: </label>
                <input 
                  type="range" 
                  min={0} max={200} 
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  style={{ flex: '1 1 auto', marginLeft:'26px'}}
                  value={saturation}
                  
                />
                <label style={{textAlign: 'right', marginLeft: '20px' }}>{saturation}%</label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px', marginTop: '1px'}}>
                <label style={{textAlign: 'left' , marginLeft: '30px', fontSize: '18px'}}>Blur: </label>
                <input 
                  type="range" 
                  min={0} max={10} 
                  onChange={(e) => setBlur(Number(e.target.value))}
                  style={{ flex: '1 1 auto', marginLeft:'83px'}}
                  value={blur}
                />
                <label style={{textAlign: 'right', marginLeft: '36px' }}>{blur}px</label>
              </div>
            </div>

            <h4 style={{ display: 'flex', alignItems: 'left', fontSize: '19px'}}>Adjust Image</h4>
              <>
                <button onClick={() => setActiveTool('blemish')} style={{ marginBottom: 16, fontSize: '16px', marginRight: '70px', marginLeft: '100px'}}>Blemish Concealer</button>
                <button onClick={() => setActiveTool('redeye')} style={{ marginBottom: 16, fontSize: '16px', marginRight: '70px', marginLeft: '100px'}}>Red Eye Remover</button>
              </>

          </div>
          </>
        )}

        {/* Cropping Tool */}
        {selectedImage && isCropping && (
          <div style={{
            position: 'fixed',
            top: 0, bottom: 0, left: 0, right: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            // display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            zIndex: 400,
          }}>
            {/* Cropper in center */}
            <div style={{
              width: '80vw', 
              height: '60vh',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              borderRadius: 12,
              marginBottom: 32
            }}>
              <Cropper
                image={selectedImage.url}
                crop={crop}
                zoom={zoom}
                aspect={1.73}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_c, pixels) => setCroppedAreaPixels(pixels)}
              />
            </div>
            {/* Action popup */}
            <div style={{
              background: "#fff",
              borderRadius: "24px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
              display: "flex",
              alignItems: "center"
            }}>

            <div style={{
              position: 'fixed',
              bottom: 0,
              width: '100%', height: 120,
              background: '#fff',
              zIndex: 310,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center'
            }}>
              {/* Action buttons */}
              <button onClick={handleCropSave} style={{alignSelf: 'flex-end',fontSize: "25px", padding: "14px 27px", marginBottom: 25, marginRight: 85}}>Crop & Save</button>
              <button onClick={() => setIsCropping(false)} style={{alignSelf: 'flex-end', fontSize: "25px", padding: "15px 27px", marginBottom: 25}}>Cancel</button>


              </div>
            </div>
          </div>
        )}

        {/* Blemish Tool */}
        {selectedImage && activeTool === 'blemish' && (
          <div style={{
            position: 'fixed',
            top: 0, bottom: 0, left: 0, right: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            zIndex: 400,
          }}>
            <div style={{
              width: '80vw', height: '60vh',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 12, marginBottom: 32
            }}>
              <div style={{ marginTop: 320,marginLeft: 430, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: canvasSize.width*2.3, height: canvasSize.height*2.3}}>
                
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width*2.3}
                  height={canvasSize.height*2.3}
                  style={{
                    position: "static", left: 0, top: 0,
                    borderRadius: 12, pointerEvents: "auto", zIndex: 1,
                    // width: '100%', height: '100%'
                    width: canvasSize.width*2.3, height: canvasSize.height*2.3
                  }}
                  
                  onMouseMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) * ((canvasSize.width * 2.3) / rect.width);
                    const y = (e.clientY - rect.top) * ((canvasSize.height * 2.3) / rect.height);
                    setMousePos({ x, y });
                  }}
                  
                  
                  onMouseLeave={() => setMousePos(null)}
                  onClick={e => {
                    if (!mousePos) return;
                    const canvas = canvasRef.current;
                    const ctx = canvas?.getContext('2d');
                    if (!canvas || !ctx) return;
                  
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(mousePos.x, mousePos.y, brushSize / 2, 0, 2 * Math.PI);
                    ctx.clip();
                  
                    healBlemish(ctx, mousePos.x, mousePos.y, brushSize / 2);
                  
                    ctx.restore();
                  }}
                  
                  
                />
                {mousePos && (
                  <div style={{
                    position: 'absolute',
                    left: mousePos.x - brushSize / 2,
                    top: mousePos.y - brushSize / 2,
                    width: brushSize,
                    height: brushSize,
                    borderRadius: '50%',
                    border: '2px solid #b2cc55',
                    pointerEvents: 'none',
                    background: 'rgba(178,204,85,0.10)',
                    zIndex: 10
                  }} />
                  
                )}
              </div>
            </div>

            <div style={{
              position: 'fixed',
              bottom: 0, left: 0,
              width: '100%',
              height: 175,
              background: '#fff',
              zIndex: 310,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Brush Size Slider*/}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginBottom: 25 
              }}>
                <label style={{ fontSize: "20px", marginRight: 16 }}>Brush Size</label>
                <input
                  style={{ width: 1700 }} 
                  type="range"
                  min={10}
                  max={220}
                  value={brushSize}
                  onChange={e => setBrushSize(Number(e.target.value))}
                />

              </div>

              {/* Action buttons*/}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginBottom: -20,
                gap: 24
              }}>
                <button onClick={handleBlemishSave}
                  style={{ fontSize: "25px", padding: "14px 27px", marginBottom: 10 }}>
                  Save & Exit
                </button>
                <button onClick={() => setActiveTool(null)}
                  style={{ fontSize: "25px", padding: "15px 27px", marginBottom: 10 }}>
                  Cancel
                </button>
              </div>
            </div>
            </div>

        )}

        {/* Red Eye Tool*/}
        {selectedImage && activeTool === 'redeye' && (
          <div style={{
            position: 'fixed',
            top: 0, bottom: 0, left: 0, right: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            zIndex: 400,
          }}>
            <div style={{
              width: '80vw', height: '60vh',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 12, marginBottom: 32
            }}>
              <div style={{ marginTop: 320,marginLeft: 430, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: canvasSize.width*2.3, height: canvasSize.height*2.3}}>
                
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width*2.3}
                  height={canvasSize.height*2.3}
                  style={{
                    position: "static", left: 0, top: 0,
                    borderRadius: 12, pointerEvents: "auto", zIndex: 1,
                    // width: '100%', height: '100%'
                    width: canvasSize.width*2.3, height: canvasSize.height*2.3
                  }}
                  
                  onMouseMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) * ((canvasSize.width * 2.3) / rect.width);
                    const y = (e.clientY - rect.top) * ((canvasSize.height * 2.3) / rect.height);
                    setMousePos({ x, y });
                  }}
                  
                  
                  onMouseLeave={() => setMousePos(null)}
                  onClick={e => {
                    if (!mousePos) return;
                    const canvas = canvasRef.current;
                    const ctx = canvas?.getContext('2d');
                    if (!canvas || !ctx) return;
                  
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(mousePos.x, mousePos.y, brushSize / 2, 0, 2 * Math.PI);
                    ctx.clip();
                  
                    removeRedEye(ctx, mousePos.x, mousePos.y, brushSize / 2);
                  
                    ctx.restore();
                  }}
                  
                  
                />
                {mousePos && (
                  <div style={{
                    position: 'absolute',
                    left: mousePos.x - brushSize / 2,
                    top: mousePos.y - brushSize / 2,
                    width: brushSize,
                    height: brushSize,
                    borderRadius: '50%',
                    border: '2px solid #b2cc55',
                    pointerEvents: 'none',
                    background: 'rgba(178,204,85,0.10)',
                    zIndex: 10
                  }} />
                  
                )}
              </div>
            </div>

            <div style={{
              position: 'fixed',
              bottom: 0, left: 0,
              width: '100%',
              height: 175,
              background: '#fff',
              zIndex: 310,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Pupil Size Slider*/}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginBottom: 25 
              }}>
                <label style={{ fontSize: "20px", marginRight: 16 }}>Pupil Size</label>
                <input
                  style={{ width: 1700 }} 
                  type="range"
                  min={10}
                  max={220}
                  value={brushSize}
                  onChange={e => setBrushSize(Number(e.target.value))}
                />

              </div>

              {/* Action buttons*/}
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                marginBottom: -20,
                gap: 24
              }}>
                <button onClick={handleRedEyeSave}
                  style={{ fontSize: "25px", padding: "14px 27px", marginBottom: 10 }}>
                  Save & Exit
                </button>
                <button onClick={() => setActiveTool(null)}
                  style={{ fontSize: "25px", padding: "15px 27px", marginBottom: 10 }}>
                  Cancel
                </button>
              </div>
            </div>
            </div>

        )}




        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <Link to="/step/2">
            <button className="back-button">Back</button>
          </Link>
          <Link to="/step/4">
            <button className="next-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Step3;
