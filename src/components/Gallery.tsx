import React, { useState, useCallback } from 'react';
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
import './Gallery.css';

interface GalleryProps {}

interface GalleryItem {
  url: string;
  type: 'image' | 'video';
}

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
    cursor: 'move'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const Gallery: React.FC<GalleryProps> = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);



  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null);
    const newItems = acceptedFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' as const : 'image' as const
    }));
    setItems(prev => [...prev, ...newItems]);
  }, []);


  
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
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.url === active.id);
        const newIndex = items.findIndex(item => item.url === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const removeImage = (url: string) => {
    setItems(items.filter(item => item.url !== url));
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    items.forEach((item, index) => {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = `media-${index + 1}.${item.type === 'image' ? 'jpg' : 'mp4'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="gallery-container">
      <div className="upload-actions">
        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
          <input {...getInputProps()} />
          <button className="upload-button">Upload Photos / Videos</button>
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag & drop files here, or click to select</p>
          )}
        </div>
        <button onClick={downloadAll} className="download-button">Download Photos</button>
      </div>

      {uploadError && <div className="error-message">{uploadError}</div>}

      {items.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(item => item.url)}
            strategy={rectSortingStrategy}
          >
            <div className="gallery-grid">
              {items.map((item) => (
                <SortableItem key={item.url} id={item.url}>
                  <div className="gallery-item">
                    {item.type === 'image' ? (
                      <img src={item.url} alt="Uploaded content" />
                    ) : (
                      <>
                        <video src={item.url} controls />
                        <div className="video-badge">VIDEO</div>
                      </>
                    )}
                    <button 
                      className="remove-button" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeImage(item.url);
                      }}
                      aria-label="Remove media"
                    >
                      ×
                    </button>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="empty-gallery">
          <p>No photos or videos uploaded yet.</p>
        </div>
      )}
    </div>
  );
};

export default Gallery;