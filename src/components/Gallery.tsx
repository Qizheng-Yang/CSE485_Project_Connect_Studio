import React, { useState, useCallback, useEffect } from 'react';
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
import { useImage } from '../context/ImageContext';
import './Gallery.css';

interface GalleryItem {
  id: string;             // stable ID for dnd-kit
  url: string;            // object URL
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

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const Gallery: React.FC = () => {
  const { mediaItems, setMediaItems } = useImage();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ---------- helpers ----------
  const toGalleryItem = (url: string, type: 'image' | 'video'): GalleryItem => ({
    id: crypto.randomUUID(),
    url,
    type
  });

  // Initialize local items from context (preserves order)
  useEffect(() => {
    if (mediaItems && mediaItems.length) {
      const mapped = mediaItems
        .sort((a, b) => a.order - b.order)
        .map(mi => ({ id: mi.id, url: mi.url, type: mi.type }));
      setItems(mapped);
    } else {
      setItems([]);
    }
  }, [mediaItems]);

  // Persist to context (with order index) whenever local items change
  useEffect(() => {
    const next = items.map((it, idx) => ({
      id: it.id,
      url: it.url,
      type: it.type,
      order: idx,
    }));
    setMediaItems(next);
  }, [items, setMediaItems]);

  // ---------- dropzone ----------
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadError(null);
    const newItems = acceptedFiles.map(file => {
      const url = URL.createObjectURL(file);
      const type: 'image' | 'video' = file.type.startsWith('video/') ? 'video' : 'image';
      return toGalleryItem(url, type);
    });
    setItems(prev => [...prev, ...newItems]);
  }, []);

  const onDropRejected = useCallback((fileRejections: any[]) => {
    if (!fileRejections?.length) return;
    const reasons = fileRejections[0].errors?.map((e: any) => e.message).join(', ');
    setUploadError(`Some files were not added: ${reasons || 'Unsupported type or too large.'}`);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: true,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.heic', '.heif'],
      'video/*': ['.mp4', '.mov'],
    },
    maxSize: 50 * 1024 * 1024,
    noClick: true, // Prevent dropzone from handling clicks automatically
  });

  const fileInputProps = getInputProps();

  // ---------- dnd sensors ----------
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150, // 150ms delay before drag starts
        tolerance: 5, // 5px movement tolerance
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems(curr => {
      const oldIndex = curr.findIndex(i => i.id === String(active.id));
      const newIndex = curr.findIndex(i => i.id === String(over.id));
      return arrayMove(curr, oldIndex, newIndex);
    });
  };

  const removeItem = (id: string) => {
    setItems(curr => {
      const found = curr.find(i => i.id === id);
      if (found) URL.revokeObjectURL(found.url);
      return curr.filter(i => i.id !== id);
    });
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

  // Cleanup object URLs when unmounting
  useEffect(() => {
    return () => {
      items.forEach(i => URL.revokeObjectURL(i.url));
    };
  }, [items]);

  return (
    <div className="gallery-container">
      <div className="upload-actions">
        <div 
          className={`dropzone ${isDragActive ? 'active' : ''}`}
          {...getRootProps()}
          onClick={() => {
            const input = document.querySelector('input[type="file"]') as HTMLInputElement;
            input?.click();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const input = document.querySelector('input[type="file"]') as HTMLInputElement;
              input?.click();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Upload photos and videos"
        >
          <input {...fileInputProps} />
          <button type="button" className="upload-button">
            Upload Photos / Videos
          </button>
          {isDragActive ? <p>Drop the files here...</p> : <p>Drag & drop files here, or click to select</p>}
          <p className="support-text">Supports: JPG, PNG, GIF, WEBP, HEIC, MP4, MOV (max 50MB)</p>
        </div>
        <button type="button" onClick={downloadAll} className="download-button">Download Photos</button>
      </div>

      {uploadError && <div className="error-message">{uploadError}</div>}

      {items.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
            <div className="gallery-grid">
              {items.map(item => (
                <SortableItem key={item.id} id={item.id}>
                  <div className="gallery-item">
                    {/* Media container without drag handlers */}
                    <div className="media-container">
                      {item.type === 'image' ? (
                        <img src={item.url} alt="Uploaded content" />
                      ) : (
                        <>
                          <video src={item.url} controls />
                          <div className="video-badge">VIDEO</div>
                        </>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      className="remove-button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeItem(item.id); }}
                      aria-label="Remove media"
                      title="Remove"
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
