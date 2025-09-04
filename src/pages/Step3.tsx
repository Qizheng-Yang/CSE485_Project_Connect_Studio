import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useImage } from '../context/ImageContext';
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

// Import local images for text slide backgrounds
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import image6 from '../assets/image6.png';

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

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
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
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div 
        {...listeners}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 30, // Leave space for delete button
          bottom: 20, // Leave space for order text
          cursor: 'move',
          zIndex: 1,
          backgroundColor: 'transparent'
        }}
        title="Drag to reorder"
      />
      {children}
    </div>
  );
};

function Step3() {
  const { slides, setSlides, mediaItems, setMediaItems } = useImage();
  const [activeTab, setActiveTab] = useState<'slides' | 'photos'>('slides');
  const [isCreatingSlide, setIsCreatingSlide] = useState(false);
  const [selectedEffect, setSelectedEffect] = useState('Normal');
  const [selectedTransition, setSelectedTransition] = useState('fade');
  const colorPickerRef = useRef<HTMLDivElement>(null);
  
  // Current slide being created
  const [currentSlide, setCurrentSlide] = useState({
    backgroundImage: '',
    customText: '',
    customFont: 'Montserrat',
    customColor: '#000000',
    customDuration: '5',
  });
  
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);

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

  // Photo upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newItems = acceptedFiles.map((file, index) => ({
      id: Date.now() + index + '',
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
      order: mediaItems.length + index
    }));
    setMediaItems([...mediaItems, ...newItems]);
  }, [mediaItems, setMediaItems]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      if (activeTab === 'slides') {
        const oldIndex = slides.findIndex(item => item.id === active.id);
        const newIndex = slides.findIndex(item => item.id === over.id);
        const reorderedItems = arrayMove(slides, oldIndex, newIndex);
        const updatedSlides = reorderedItems.map((item, index) => ({ ...item, order: index }));
        setSlides(updatedSlides);
      } else {
        const oldIndex = mediaItems.findIndex(item => item.id === active.id);
        const newIndex = mediaItems.findIndex(item => item.id === over.id);
        const reorderedItems = arrayMove(mediaItems, oldIndex, newIndex);
        const updatedItems = reorderedItems.map((item, index) => ({ ...item, order: index }));
        setMediaItems(updatedItems);
      }
    }
  };

  const handleAddSlide = () => {
    if (currentSlide.backgroundImage && currentSlide.customText) {
      const newSlide = {
        id: Date.now().toString(),
        type: 'text' as const,
        backgroundImage: currentSlide.backgroundImage,
        customText: currentSlide.customText,
        customFont: currentSlide.customFont,
        customColor: currentSlide.customColor,
        customDuration: currentSlide.customDuration,
        order: slides.length,
        transition: selectedTransition,
        effect: filterEffects.find(e => e.name === selectedEffect)?.value || 'none'
      };
      setSlides([...slides, newSlide]);
      
      // Reset form
      setCurrentSlide({
        backgroundImage: '',
        customText: '',
        customFont: 'Montserrat',
        customColor: '#000000',
        customDuration: '5',
      });
      setIsCreatingSlide(false);
    }
  };

  const removeSlide = (id: string) => {
    console.log('removeSlide called with id:', id);
    const filteredSlides = slides.filter(slide => slide.id !== id);
    // Reorder the remaining slides
    const reorderedSlides = filteredSlides.map((slide, index) => ({ ...slide, order: index }));
    setSlides(reorderedSlides);
  };

  const removeMediaItem = (id: string) => {
    console.log('removeMediaItem called with id:', id);
    const item = mediaItems.find(item => item.id === id);
    if (item) {
      URL.revokeObjectURL(item.url);
      const filteredItems = mediaItems.filter(item => item.id !== id);
      // Reorder the remaining items
      const reorderedItems = filteredItems.map((item, index) => ({ ...item, order: index }));
      setMediaItems(reorderedItems);
    }
  };

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
                
                {/* Background Selection */}
                <p>Choose Background:</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto' }}>
                  {[image1, image2, image3, image4, image5, image6].map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Background ${index + 1}`}
                      style={{
                        width: '120px',
                        height: '80px',
                        cursor: 'pointer',
                        border: currentSlide.backgroundImage === imageUrl ? '3px solid #b2cc55' : '1px solid #ddd',
                        borderRadius: '5px'
                      }}
                      onClick={() => setCurrentSlide(prev => ({ ...prev, backgroundImage: imageUrl }))}
                    />
                  ))}
                </div>

                {/* Text Input */}
                <div style={{ marginBottom: '20px' }}>
                  <label>Text:</label>
                  <input
                    type="text"
                    value={currentSlide.customText}
                    onChange={(e) => setCurrentSlide(prev => ({ ...prev, customText: e.target.value }))}
                    placeholder="Enter your text"
                    style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ddd' }}
                  />
                </div>

                {/* Quick Quote Selection */}
                <p>Or choose a quote:</p>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', overflowX: 'auto' }}>
                  {[memorialChoice, weddingChoice, retirementChoice, anniversaryChoice].map((quoteImg, index) => {
                    const labels = ['Memorial', 'Wedding', 'Retirement', 'Anniversary'];
                    const categoryQuotes = [
                      'In Loving Memory',
                      'With Love Always', 
                      'Celebrating a Life Well Lived',
                      'Cherished Moments'
                    ];
                    return (
                      <div key={index} style={{ textAlign: 'center', cursor: 'pointer' }}>
                        <img
                          src={quoteImg}
                          alt={labels[index]}
                          style={{ width: '100px', height: '60px', borderRadius: '5px' }}
                          onClick={() => setCurrentSlide(prev => ({ ...prev, customText: categoryQuotes[index] }))}
                        />
                        <p style={{ fontSize: '12px', margin: '5px 0' }}>{labels[index]}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Font and Color Selection */}
                <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ flex: 1 }}>
                    <label>Font:</label>
                    <select 
                      value={currentSlide.customFont}
                      onChange={(e) => setCurrentSlide(prev => ({ ...prev, customFont: e.target.value }))}
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    >
                      {fonts.map(font => (
                        <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <label>Color:</label>
                    <div style={{ marginTop: '5px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: currentSlide.customColor,
                          border: '1px solid #ddd',
                          borderRadius: '5px',
                          cursor: 'pointer'
                        }}
                        onClick={() => setIsColorPickerVisible(!isColorPickerVisible)}
                      />
                      {isColorPickerVisible && (
                        <div ref={colorPickerRef} style={{ position: 'absolute', zIndex: 1000, marginTop: '5px' }}>
                          <div style={{ position: 'relative' }}>
                            <HexColorPicker
                              color={currentSlide.customColor}
                              onChange={(color) => setCurrentSlide(prev => ({ ...prev, customColor: color }))}
                            />
                            <button
                              onClick={() => setIsColorPickerVisible(false)}
                              style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#ccc',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
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
                      style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                  </div>
                </div>

                {/* Preview */}
                {currentSlide.backgroundImage && (
                  <div style={{ marginBottom: '20px' }}>
                    <p>Preview:</p>
                    <div
                      style={{
                        width: '300px',
                        height: '180px',
                        backgroundImage: `url(${currentSlide.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '5px',
                        margin: '0 auto'
                      }}
                    >
                      <span style={{
                        color: currentSlide.customColor,
                        fontFamily: currentSlide.customFont,
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: '10px'
                      }}>
                        {currentSlide.customText || 'Your text here'}
                      </span>
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
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddSlide}
                    disabled={!currentSlide.backgroundImage || !currentSlide.customText}
                    style={{
                      backgroundColor: currentSlide.backgroundImage && currentSlide.customText ? '#b2cc55' : '#ccc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '10px 20px',
                      cursor: currentSlide.backgroundImage && currentSlide.customText ? 'pointer' : 'not-allowed'
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
                      {slides.map((slide) => (
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
                                backgroundImage: `url(${slide.backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '5px',
                                marginBottom: '10px'
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
                                top: '5px',
                                right: '5px',
                                background: 'rgba(255,0,0,0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '25px',
                                height: '25px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                zIndex: 100
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
                backgroundColor: isDragActive ? '#f0f8ff' : '#f9f9f9',
                cursor: 'pointer'
              }}>
                <input {...getInputProps()} />
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>📷</div>
                {isDragActive ? (
                  <p>Drop the files here...</p>
                ) : (
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Upload Photos & Videos</p>
                    <p>Drag & drop files here, or click to select</p>
                    <p style={{ fontSize: '12px', color: '#666' }}>Supports: JPG, PNG, GIF, MP4, MOV (max 50MB)</p>
                  </div>
                )}
              </div>
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
                      {mediaItems.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                          <div style={{ 
                            position: 'relative',
                            backgroundColor: '#f9f9f9',
                            borderRadius: '10px',
                            overflow: 'hidden'
                          }}>
                            {item.type === 'image' ? (
                              <img 
                                src={item.url} 
                                alt="Uploaded content"
                                style={{ 
                                  width: '100%', 
                                  height: '150px', 
                                  objectFit: 'cover',
                                  filter: filterEffects.find(e => e.name === selectedEffect)?.value || 'none'
                                }}
                              />
                            ) : (
                              <div style={{ position: 'relative' }}>
                                <video 
                                  src={item.url} 
                                  style={{ 
                                    width: '100%', 
                                    height: '150px', 
                                    objectFit: 'cover',
                                    filter: filterEffects.find(e => e.name === selectedEffect)?.value || 'none'
                                  }}
                                />
                                <div style={{
                                  position: 'absolute',
                                  bottom: '5px',
                                  left: '5px',
                                  backgroundColor: 'rgba(0,0,0,0.7)',
                                  color: 'white',
                                  padding: '2px 8px',
                                  borderRadius: '3px',
                                  fontSize: '12px'
                                }}>
                                  VIDEO
                                </div>
                              </div>
                            )}
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
                                top: '5px',
                                right: '5px',
                                background: 'rgba(255,0,0,0.7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '25px',
                                height: '25px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                zIndex: 100
                              }}
                            >
                              ×
                            </button>
                            <div style={{ padding: '5px', fontSize: '12px', textAlign: 'center' }}>
                              Order: {item.order + 1}
                            </div>
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
