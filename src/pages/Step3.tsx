import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useImage } from '../context/ImageContext';
import { MediaItem, Slide } from '../context/ImageContext';
import { useDropzone } from 'react-dropzone';
import PhotoGalleryLink from '../components/PhotoGalleryLink'; // INTEGRATED: Added from local code
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

// Cropping import (from GitHub version)
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop';

// Import local images for text slide backgrounds
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';

// Quote category images (from GitHub version for advanced selection)
import memorialChoice from '../assets/memorialQuote.png';
import weddingChoice from '../assets/weddingQuote.png';
import retirementChoice from '../assets/retirementQuote.png';
import anniversaryChoice from '../assets/anniversaryQuote.png';


const fonts = [
  'Montserrat', 'Alex Brush', 'Alegreya', 'Dancing Script', 'Great Vibes',
  'Pacifico', 'Roboto Slab', 'Playfair Display', 'Lobster', 'Raleway', 'Open Sans'
];

const filterEffects = [
  { name: 'Normal', value: 'none' }, { name: 'Grayscale', value: 'grayscale(100%)' },
  { name: 'Sepia', value: 'sepia(100%)' }, { name: 'Blur', value: 'blur(2px)' },
  { name: 'Saturate', value: 'saturate(200%)' }
];

const transitionOptions = [
  { name: 'fade' }, { name: 'slide' }, { name: 'zoom' },
  { name: 'wipe' }, { name: 'dissolve' }
];

// Advanced quote categories (from GitHub version)
const quoteCategories = [
  {
    label: "Memorial", img: memorialChoice,
    quotes: ["In Loving Memory", "Those we love remain with us", "Your life was a blessing", "Forever in our hearts", "Gone but never forgotten"],
  },
  {
    label: "Wedding", img: weddingChoice,
    quotes: ["With Love Always", "Two hearts, one soul", "Our journey begins", "To have and to hold", "Celebrating our love"],
  },
  {
    label: "Retirement", img: retirementChoice,
    quotes: ["Celebrating a Life Well Lived", "Happy Retirement", "Endless adventures await", "Thank you for your dedication", "Enjoy your new chapter"],
  },
  {
    label: "Anniversary", img: anniversaryChoice,
    quotes: ["Cherished Moments", "Years of Love", "Growing Together", "Here's to many more", "Our love story continues"],
  },
];

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
}

// INTEGRATED: SortableItem from local code for full-card dragging
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
      {/* Full-card drag handle */}
      <div 
        {...listeners}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: '30px', // Leave space for delete button
          bottom: '20px', // Leave space for order text
          cursor: 'move',
          zIndex: 50,
          backgroundColor: 'transparent'
        }}
        title="Drag to reorder"
      />
      {children}
    </div>
  );
};

// Helper for cropping (from GitHub version)
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
  const { slides, setSlides, mediaItems, setMediaItems } = useImage();
  const [activeTab, setActiveTab] = useState<'slides' | 'photos'>('slides');
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState('Normal');
  const [selectedTransition, setSelectedTransition] = useState('fade');
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  const [currentSlide, setCurrentSlide] = useState({
    backgroundImage: '', customText: '', customFont: 'Montserrat',
    customColor: '#000000', customDuration: '5',
  });

  const [categoryIdx, setCategoryIdx] = useState(0); 
  
  // INTEGRATED: Popup color picker state from local code
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

  // --- Start of Image Editing State (from GitHub version) ---
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);

  const originalFilters = useRef({
    brightness: 100, contrast: 100, saturation: 100, blur: 0,
  });

  useEffect(() => { 
    if (selectedImage) {
      originalFilters.current = { brightness, contrast, saturation, blur };
      const foundMedia = mediaItems.find(item => item.id === selectedImage.id);
      const foundSlide = slides.find(slide => slide.backgroundImage === selectedImage.url);
      const filters = foundMedia?.filters || foundSlide?.filters || 
                      { brightness: 100, contrast: 100, saturation: 100, blur: 0 };
      setBrightness(filters.brightness);
      setContrast(filters.contrast);
      setSaturation(filters.saturation);
      setBlur(filters.blur);
    }
  }, [selectedImage, slides, mediaItems]);
  
  const filterStyle = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;

  const handleSaveAndExit = () => {
    if (!selectedImage) return;
    const filters = { brightness, contrast, saturation, blur };
    setMediaItems((prevItems: MediaItem[]) =>
      prevItems.map((item: MediaItem) => item.id === selectedImage.id ? { ...item, filters } : item)
    );
    setSlides((prevSlides: Slide[]) =>
      prevSlides.map((slide: Slide) => slide.backgroundImage === selectedImage.url ? { ...slide, filters } : slide)
    );
    setSelectedImage(null);
    setIsEditing(false);
    setIsCropping(false);
  };
  
  const handleCropSave = async () => {
    if (!selectedImage || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(selectedImage.url, croppedAreaPixels);
    setMediaItems(prev => prev.map(item => item.id === selectedImage.id ? { ...item, url: croppedImage } : item));
    setSlides(prev => prev.map(slide => slide.backgroundImage === selectedImage.url ? { ...slide, backgroundImage: croppedImage } : slide));
    setSelectedImage(prev => prev ? { ...prev, url: croppedImage } : null);
    setIsEditing(false);
    setIsCropping(false);
  };
  // --- End of Image Editing Logic ---
  
  // INTEGRATED: Popup color picker handler from local code
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems = acceptedFiles.map((file, index) => ({
      id: Date.now() + index + '',
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
      order: mediaItems.length + index
    }));
    setMediaItems(prev => [...prev, ...newItems]);
  }, [mediaItems.length, setMediaItems]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.gif'], 'video/*': ['.mp4', '.mov'] },
    maxSize: 50 * 1024 * 1024
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      if (activeTab === 'slides') {
        setSlides((items) => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex).map((item, index) => ({...item, order: index}));
        });
      } else {
        setMediaItems((items) => {
          const oldIndex = items.findIndex(item => item.id === active.id);
          const newIndex = items.findIndex(item => item.id === over.id);
          return arrayMove(items, oldIndex, newIndex).map((item, index) => ({...item, order: index}));
        });
      }
    }
  };

  const handleAddSlide = () => {
    if (currentSlide.backgroundImage && currentSlide.customText) {
      const newSlide = {
        id: Date.now().toString(), type: 'text' as const,
        backgroundImage: currentSlide.backgroundImage, customText: currentSlide.customText,
        customFont: currentSlide.customFont, customColor: currentSlide.customColor,
        customDuration: currentSlide.customDuration, order: slides.length,
        transition: selectedTransition,
        effect: filterEffects.find(e => e.name === selectedEffect)?.value || 'none'
      };
      setSlides([...slides, newSlide]);
      setCurrentSlide({
        backgroundImage: '', customText: '', customFont: 'Montserrat',
        customColor: '#000000', customDuration: '5',
      });
      setIsCreatingSlide(false);
    }
  };

  const removeSlide = (id: string) => {
    setSlides(prev => prev.filter(slide => slide.id !== id).map((s, i) => ({ ...s, order: i })));
  };

  const removeMediaItem = (id: string) => {
    const item = mediaItems.find(item => item.id === id);
    if (item) URL.revokeObjectURL(item.url);
    setMediaItems(prev => prev.filter(item => item.id !== id).map((i, idx) => ({ ...i, order: idx })));
  };

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      <div className="main-content">
        <h2 className="main-information-header">MEDIA SELECTION</h2>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '30px' }}>
          <button onClick={() => setActiveTab('slides')} style={{ padding: '10px 30px', backgroundColor: activeTab === 'slides' ? '#b2cc55' : '#f0f0f0', color: activeTab === 'slides' ? 'white' : '#333', border: 'none', borderRadius: '25px 0 0 25px', cursor: 'pointer', fontSize: '16px' }}>
            Text Slides
          </button>
          <button onClick={() => setActiveTab('photos')} style={{ padding: '10px 30px', backgroundColor: activeTab === 'photos' ? '#b2cc55' : '#f0f0f0', color: activeTab === 'photos' ? 'white' : '#333', border: 'none', borderRadius: '0 25px 25px 0', cursor: 'pointer', fontSize: '16px' }}>
            Photos & Videos
          </button>
        </div>

        {activeTab === 'slides' && (
          <div>
            {!isCreatingSlide && (
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <button onClick={() => setIsCreatingSlide(true)} style={{ backgroundColor: '#b2cc55', color: 'white', border: 'none', borderRadius: '25px', padding: '15px 30px', fontSize: '16px', cursor: 'pointer' }}>
                  + CREATE NEW TEXT SLIDE
                </button>
              </div>
            )}

            {isCreatingSlide && (
              <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px', marginBottom: '30px' }}>
                <h3>Create Text Slide</h3>
                
                <p>Choose Background:</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto' }}>
                  {[image1, image2, image3, image4, image5, image6].map((imageUrl, index) => (
                    <img key={index} src={imageUrl} alt={`Background ${index + 1}`} style={{ width: '120px', height: '80px', cursor: 'pointer', border: currentSlide.backgroundImage === imageUrl ? '3px solid #b2cc55' : '1px solid #ddd', borderRadius: '5px' }} onClick={() => setCurrentSlide(prev => ({ ...prev, backgroundImage: imageUrl }))} />
                  ))}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{fontSize: '16px'}}>Text:</label>
                  <input type="text" value={currentSlide.customText} onChange={(e) => setCurrentSlide(prev => ({ ...prev, customText: e.target.value }))} placeholder="Enter your text" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '15px'}} />
                </div>

                {/* Advanced quote selection from GitHub version */}
                <div style={{ marginBottom: 14 }}>
                  <div>Or choose a quote:</div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px', marginBottom: '20px', overflowX: 'auto' }}>
                    {quoteCategories.map((cat, idx) => (
                      <button key={cat.label} onClick={() => setCategoryIdx(idx)} style={{ border: "none", background: "none", outline: idx === categoryIdx ? "2.5px solid #b2cc55" : "none", borderRadius: 8, padding: 0, cursor: "pointer", opacity: idx === categoryIdx ? 1 : 0.75, boxShadow: idx === categoryIdx ? "0 0 8px #d6f5a6" : "none" }} tabIndex={0}>
                        <img src={cat.img} alt={cat.label} style={{ width: 200, borderRadius: 8 }} />
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", overflowX: "auto", gap: 8, marginTop: 0, marginBottom: 12, paddingBottom: 8 }}>
                    {quoteCategories[categoryIdx].quotes.map((quote, qidx) => (
                      <button key={qidx} style={{ background: currentSlide.customText === quote ? "#b2cc55" : "#f4f4f4", color: currentSlide.customText === quote ? "#fff" : "#333", border: "1.5px solid #eee", borderRadius: 8, minWidth: 120, minHeight: 44, padding: "6px 10px", fontSize: 14, marginRight: 7, cursor: "pointer", fontWeight: 500, boxShadow: currentSlide.customText === quote ? "0 1px 8px #e0eeca" : undefined }} onClick={() => setCurrentSlide((s) => ({ ...s, customText: quote }))}>
                        {quote}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Font:</label>
                    <select value={currentSlide.customFont} onChange={(e) => setCurrentSlide(prev => ({ ...prev, customFont: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '5px', fontSize: '15px'}}>
                      {fonts.map(font => (<option key={font} value={font} style={{ fontFamily: font }}>{font}</option>))}
                    </select>
                  </div>
                  
                  {/* INTEGRATED: Popup color picker UI from local code */}
                  <div style={{ flex: 1 }}>
                    <label>Color:</label>
                    <div style={{ marginTop: '5px', position: 'relative' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: currentSlide.customColor, border: '1px solid #ddd', borderRadius: '5px', cursor: 'pointer' }} onClick={() => setIsColorPickerVisible(!isColorPickerVisible)} />
                      {isColorPickerVisible && (
                        <div ref={colorPickerRef} style={{ position: 'absolute', zIndex: 1000, marginTop: '5px' }}>
                          <HexColorPicker color={currentSlide.customColor} onChange={(color) => setCurrentSlide(prev => ({ ...prev, customColor: color }))} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <label>Duration (seconds):</label>
                    <input type="number" min="1" max="60" value={currentSlide.customDuration} onChange={(e) => setCurrentSlide(prev => ({ ...prev, customDuration: e.target.value }))} style={{ width: '100%', padding: '8px', marginTop: '5px', fontSize: '15px' }} />
                  </div>
                </div>

                {currentSlide.backgroundImage && (
                  <div style={{ marginBottom: '20px' }}>
                    <p>Preview:</p>
                    <div style={{ width: '300px', height: '180px', backgroundImage: `url(${currentSlide.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', margin: '0 auto' }}>
                      <span style={{ color: currentSlide.customColor, fontFamily: currentSlide.customFont, fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '10px' }}>
                        {currentSlide.customText || 'Your text here'}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                  <button onClick={() => setIsCreatingSlide(false)} style={{ backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: 'pointer', marginTop: '15px', fontSize: '16px' }}>
                    Cancel
                  </button>
                  <button onClick={handleAddSlide} disabled={!currentSlide.backgroundImage || !currentSlide.customText} style={{ backgroundColor: currentSlide.backgroundImage && currentSlide.customText ? '#b2cc55' : '#ccc', color: 'white', border: 'none', borderRadius: '20px', padding: '10px 20px', cursor: currentSlide.backgroundImage && currentSlide.customText ? 'pointer' : 'not-allowed', marginTop: '15px', fontSize: '16px' }}>
                    Add Slide
                  </button>
                </div>
              </div>
            )}

            {slides.length > 0 && (
              <div>
                <h3 style={{ textAlign: 'center' }}>Your Text Slides (Drag to reorder)</h3>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={slides.map(slide => slide.id)} strategy={rectSortingStrategy}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
                      {slides.map((slide) => (
                        <SortableItem key={slide.id} id={slide.id}>
                          <div style={{ position: 'relative', backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '10px' }}>
                            <div style={{ width: '100%', height: '150px', backgroundImage: `url(${slide.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px', marginBottom: '10px', cursor: 'pointer', filter: slide.filters ? `brightness(${slide.filters.brightness}%) contrast(${slide.filters.contrast}%) saturate(${slide.filters.saturation}%) blur(${slide.filters.blur}px)` : 'none' }}
                                 onClick={() => { setSelectedImage({ id: slide.id, url: slide.backgroundImage ?? '', type: 'image', order: slide.order }); setIsEditing(true); setIsCropping(false); }}>
                              <span style={{ color: slide.customColor, fontFamily: slide.customFont, fontSize: '14px', fontWeight: 'bold', textAlign: 'center', padding: '5px' }}>{slide.customText}</span>
                            </div>
                            <p style={{ fontSize: '12px', margin: '5px 0' }}>Duration: {slide.customDuration}s</p>
                            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeSlide(slide.id); }} onMouseDown={(e) => { e.stopPropagation(); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              ×
                            </button>
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '30px' }}>
              <div {...getRootProps()} style={{ border: '2px dashed #b2cc55', borderRadius: '10px', padding: '40px', textAlign: 'center', backgroundColor: isDragActive ? '#f0f8ff' : '#f9f9f9', cursor: 'pointer' }}>
                <input {...getInputProps()} />
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>📷</div>
                {isDragActive ? <p>Drop the files here...</p> : ( <div> <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Upload Photos & Videos</p> <p>Drag & drop files here, or click to select</p> <p style={{ fontSize: '12px', color: '#666' }}>Supports: JPG, PNG, GIF, MP4, MOV (max 50MB)</p> </div> )}
              </div>
            </div>

            {mediaItems.length > 0 ? (
              <div>
                <h3 style={{ textAlign: 'center' }}>Your Media (Drag to reorder)</h3>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={mediaItems.map(item => item.id)} strategy={rectSortingStrategy}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px', maxWidth: '1000px', margin: '0 auto' }}>
                      {mediaItems.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                          <div style={{ position: 'relative', backgroundColor: '#f9f9f9', borderRadius: '10px', overflow: 'hidden' }}>
                            {item.type === 'image' ? (
                              <img src={item.url} alt="Uploaded content" style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer', filter: item.filters ? `brightness(${item.filters.brightness}%) contrast(${item.filters.contrast}%) saturate(${item.filters.saturation}%) blur(${item.filters.blur}px)` : 'none' }} onClick={() => { setSelectedImage(item); setIsEditing(true); }} />
                            ) : (
                              <div style={{ position: 'relative' }}>
                                <video src={item.url} style={{ width: '100%', height: '150px', objectFit: 'cover', filter: item.filters ? `brightness(${item.filters.brightness}%) contrast(${item.filters.contrast}%) saturate(${item.filters.saturation}%) blur(${item.filters.blur}px)` : 'none' }} />
                                <div style={{ position: 'absolute', bottom: '5px', left: '5px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '2px 8px', borderRadius: '3px', fontSize: '12px' }}>VIDEO</div>
                              </div>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); e.preventDefault(); removeMediaItem(item.id); }} onMouseDown={(e) => { e.stopPropagation(); }} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,0,0,0.8)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', fontSize: '14px', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              ×
                            </button>
                            <div style={{ padding: '5px', fontSize: '12px', textAlign: 'center' }}>Order: {item.order + 1}</div>
                          </div>
                        </SortableItem>
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            ) : ( <div style={{ textAlign: 'center', color: '#666' }}><p>No photos or videos uploaded yet.</p></div> )}
            
            {/* INTEGRATED: PhotoGalleryLink from local code */}
            <PhotoGalleryLink />
          </div>
        )}

        {/* --- Start of Image Editing UI (from GitHub version) --- */}
        {selectedImage && isEditing && (
          <>
            <div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, width: `calc(100vw - 400px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 300 }}>
              {!isCropping ? (
                <img src={selectedImage.url} alt="Selected" style={{ filter: filterStyle, maxWidth: '80%', maxHeight: '80%', borderRadius: 8, userSelect: 'none', boxShadow: '0 0 12px black' }} />
              ) : (
                <div style={{ width: '80%', height: '80%', position: 'relative' }}>
                  <Cropper image={selectedImage.url} crop={crop} zoom={zoom} aspect={1.73} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_c, pixels) => setCroppedAreaPixels(pixels)} />
                </div>
              )}
            </div>

            <div style={{ position: 'fixed', top: 0, right: 0, width: 400, height: '100%', background: '#fff', padding: 16, boxShadow: '-4px 0 12px rgba(0,0,0,0.2)', zIndex: 310, display: 'flex', flexDirection: 'column' }}>
              <button onClick={handleSaveAndExit} style={{ alignSelf: 'flex-end', background: '#97d154', fontSize: 17, marginBottom: 16 }} aria-label="Close">
                Save & Exit
              </button>
              <h2>Edit Image</h2>
              <h4 style={{ display: 'flex', alignItems: 'left', fontSize: '19px'}}>Crop</h4>
              {!isCropping ? (
                <button onClick={() => setIsCropping(true)} style={{ marginBottom: 16, fontSize: '16px', marginRight: '70px', marginLeft: '100px'}}>Start Crop</button>
              ) : (
                <>
                  <button onClick={handleCropSave} style={{ marginBottom: 12, fontSize: '16px', marginRight: '70px', marginLeft: '100px' }}>Crop & Save</button>
                  <button onClick={() => setIsCropping(false)} style={{fontSize: '16px', marginRight: '70px', marginLeft: '100px' }}>Cancel</button>
                </>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 15}}>
                  <h4 style={{ fontSize: '19px', marginBottom: 30}}>Adjust Filters</h4>
                  <button onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); setBlur(0); }} style={{ backgroundColor: '#f05a4f', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '5px', cursor: 'pointer', fontSize: '15px', marginLeft: '10px' }}>
                    Reset Filters
                  </button>
                </div>
                <style>{`input[type="range"]{-webkit-appearance:none;appearance:none}input[type="range"]:focus{outline:none}input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;background:#b2cc55;width:18px;height:18px;border-radius:50%;cursor:pointer;border:2px solid #669900;box-shadow:0 0 4px rgba(0,0,0,0.12);margin-top:-7px}input[type="range"]::-webkit-slider-runnable-track{height:3px;background:#bbb;border-radius:2px}`}</style>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}><label style={{ width: '90px', fontSize: '18px' }}>Brightness:</label><input type="range" min={0} max={200} onChange={(e) => setBrightness(Number(e.target.value))} style={{ flex: 1 }} value={brightness} /><span style={{ width: '50px', textAlign: 'right' }}>{brightness}%</span></div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}><label style={{ width: '90px', fontSize: '18px' }}>Contrast:</label><input type="range" min={0} max={200} onChange={(e) => setContrast(Number(e.target.value))} style={{ flex: 1 }} value={contrast} /><span style={{ width: '50px', textAlign: 'right' }}>{contrast}%</span></div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}><label style={{ width: '90px', fontSize: '18px' }}>Saturation:</label><input type="range" min={0} max={200} onChange={(e) => setSaturation(Number(e.target.value))} style={{ flex: 1 }} value={saturation} /><span style={{ width: '50px', textAlign: 'right' }}>{saturation}%</span></div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '18px' }}><label style={{ width: '90px', fontSize: '18px' }}>Blur:</label><input type="range" min={0} max={10} onChange={(e) => setBlur(Number(e.target.value))} style={{ flex: 1 }} value={blur} /><span style={{ width: '50px', textAlign: 'right' }}>{blur}px</span></div>
              </div>
            </div>
          </>
        )}
        {/* --- End of Image Editing UI --- */}

        <div className="navigation-buttons">
          <Link to="/step/2"><button className="back-button">Back</button></Link>
          <Link to="/step/4"><button className="next-button">Next</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Step3;
