import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImage } from '../context/ImageContext';
import { uploadMultipleFiles, deleteFile } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
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
import type { MediaFile } from '../services/api';

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

const Gallery: React.FC = () => {
  const { media, setMedia, isLoading, setIsLoading, setError } = useImage();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setUploadError(null);
    setIsUploading(true);
    
    try {
      const uploadedFiles = await uploadMultipleFiles(acceptedFiles);
      setMedia([...media, ...uploadedFiles]);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [media, setMedia]);

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
      setMedia((currentMedia) => {
        const oldIndex = currentMedia.findIndex(item => item.id === active.id);
        const newIndex = currentMedia.findIndex(item => item.id === over.id);
        return arrayMove(currentMedia, oldIndex, newIndex);
      });
    }
  };

  const removeMedia = async (mediaFile: MediaFile) => {
    try {
      await deleteFile(mediaFile.filename);
      setMedia(media.filter(item => item.id !== mediaFile.id));
    } catch (error) {
      console.error('Failed to delete file:', error);
      setError('Failed to delete file');
    }
  };

  const downloadAll = () => {
    media.forEach((item, index) => {
      const link = document.createElement('a');
      link.href = `/uploads/${item.filename}`;
      link.download = item.originalName;
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
          <button className="upload-button" disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Photos / Videos'}
          </button>
          {isDragActive ? (
            <p>Drop the files here...</p>
          ) : (
            <p>Drag & drop files here, or click to select</p>
          )}
        </div>
        <button 
          onClick={downloadAll} 
          className="download-button"
          disabled={media.length === 0}
        >
          Download All ({media.length})
        </button>
      </div>

      {isUploading && <LoadingSpinner message="Uploading files..." />}
      {uploadError && <div className="error-message">{uploadError}</div>}

      {media.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={media.map(item => item.id)}
            strategy={rectSortingStrategy}
          >
            <div className="gallery-grid">
              {media.map((item) => (
                <SortableItem key={item.id} id={item.id}>
                  <div className="gallery-item">
                    {item.mimetype.startsWith('image/') ? (
                      <img src={`/uploads/${item.filename}`} alt={item.originalName} />
                    ) : (
                      <>
                        <video src={`/uploads/${item.filename}`} controls />
                        <div className="video-badge">VIDEO</div>
                      </>
                    )}
                    <button 
                      className="remove-button" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeMedia(item);
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