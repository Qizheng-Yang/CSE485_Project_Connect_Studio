# Backend Architecture for Tribute Video Generation

## Overview
The backend will handle video processing, generation, and serving for the tribute video application. Since video generation is computationally intensive, we'll use a queue-based approach for scalability.

## Technology Stack

### Core Framework
- **Node.js + Express** - Main API server
- **TypeScript** - Type safety and better development experience
- **MongoDB** - Document storage for user data, projects, and metadata
- **Redis** - Caching and job queue management

### Video Processing
- **FFmpeg** - Video/audio processing and encoding
- **Canvas API** or **Puppeteer** - Text slide rendering
- **Sharp** - Image processing and optimization

### Infrastructure
- **Bull Queue** - Job processing for video generation
- **AWS S3** or **Google Cloud Storage** - Media file storage
- **Docker** - Containerization for consistent deployment

## API Endpoints

### Project Management
```
POST   /api/projects                    # Create new project
GET    /api/projects/:id               # Get project details
PUT    /api/projects/:id               # Update project
DELETE /api/projects/:id               # Delete project
POST   /api/projects/:id/generate      # Start video generation
GET    /api/projects/:id/status        # Check generation status
```

### Media Upload
```
POST   /api/upload/image               # Upload image
POST   /api/upload/video               # Upload video
POST   /api/upload/audio               # Upload audio
DELETE /api/media/:id                  # Delete media file
```

### Video Generation
```
POST   /api/generate/video             # Queue video generation job
GET    /api/generate/status/:jobId     # Check job status
GET    /api/generate/download/:jobId   # Download completed video
```

## Data Models

### Project Schema
```typescript
interface Project {
  _id: string;
  userId: string;
  title: string;
  
  // Step 1 data
  mainImage?: string;
  intro: string;
  name: string;
  fullAccess: boolean;
  
  // Step 2 data
  selectedTheme: {
    id: number;
    src: string;
    alt: string;
  };
  
  // Step 3 data
  slides: Slide[];
  mediaItems: MediaItem[];
  
  // Step 4 data (music)
  musicFiles: string[];
  
  // Generation settings
  videoSettings: {
    resolution: '1080p' | '720p' | '480p';
    format: 'mp4' | 'mov';
    quality: 'high' | 'medium' | 'low';
  };
  
  // Status tracking
  status: 'draft' | 'generating' | 'completed' | 'failed';
  generatedVideoUrl?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

interface Slide {
  id: string;
  type: 'text' | 'image';
  order: number;
  duration: number; // in seconds
  
  // Text slide properties
  backgroundImage?: string;
  text?: string;
  font?: string;
  color?: string;
  
  // Image slide properties
  imageUrl?: string;
  
  // Effects
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
  duration: number;
  effects?: {
    filter?: string;
    transition?: string;
  };
}
```

### Job Schema
```typescript
interface VideoJob {
  _id: string;
  projectId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  outputUrl?: string;
  errorMessage?: string;
  createdAt: Date;
  completedAt?: Date;
}
```

## Video Generation Pipeline

### 1. Job Queue Processing
```typescript
// When user clicks "Generate Video"
async function queueVideoGeneration(projectId: string) {
  const job = await videoQueue.add('generate-video', {
    projectId,
    priority: 'normal'
  });
  
  return { jobId: job.id, status: 'queued' };
}
```

### 2. Video Assembly Process
```typescript
async function generateVideo(projectId: string) {
  const project = await Project.findById(projectId);
  const tempDir = `/tmp/video-${projectId}`;
  
  // 1. Prepare assets
  await downloadMediaAssets(project, tempDir);
  
  // 2. Generate text slides
  await generateTextSlides(project.slides, tempDir);
  
  // 3. Create video segments
  const segments = await createVideoSegments(project, tempDir);
  
  // 4. Combine with audio
  const finalVideo = await combineWithAudio(segments, project.musicFiles, tempDir);
  
  // 5. Upload to storage
  const videoUrl = await uploadToStorage(finalVideo);
  
  // 6. Update project
  await Project.findByIdAndUpdate(projectId, {
    status: 'completed',
    generatedVideoUrl: videoUrl
  });
  
  return videoUrl;
}
```

### 3. Text Slide Generation
```typescript
async function generateTextSlide(slide: Slide): Promise<string> {
  const canvas = createCanvas(1920, 1080);
  const ctx = canvas.getContext('2d');
  
  // Load background image
  if (slide.backgroundImage) {
    const background = await loadImage(slide.backgroundImage);
    ctx.drawImage(background, 0, 0, 1920, 1080);
  }
  
  // Apply effects
  if (slide.effect) {
    applyCanvasFilter(ctx, slide.effect);
  }
  
  // Draw text
  if (slide.text) {
    ctx.fillStyle = slide.color || '#ffffff';
    ctx.font = `bold 72px ${slide.font || 'Arial'}`;
    ctx.textAlign = 'center';
    ctx.fillText(slide.text, 960, 540);
  }
  
  // Save as image
  const outputPath = `/tmp/slide-${slide.id}.png`;
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(outputPath, buffer);
  
  return outputPath;
}
```

### 4. FFmpeg Video Assembly
```typescript
async function combineVideoSegments(segments: VideoSegment[], outputPath: string) {
  const inputFiles = segments.map(s => s.path).join('|');
  
  const ffmpegCommand = `
    ffmpeg -f concat -safe 0 -i <(${segments.map(s => `echo "file '${s.path}'"`)}) 
    -c:v libx264 -c:a aac -strict experimental 
    -b:v 5000k -b:a 192k 
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" 
    ${outputPath}
  `;
  
  await execAsync(ffmpegCommand);
}
```

## File Organization
```
backend/
├── src/
│   ├── controllers/
│   │   ├── projectController.ts
│   │   ├── uploadController.ts
│   │   └── videoController.ts
│   ├── models/
│   │   ├── Project.ts
│   │   ├── User.ts
│   │   └── VideoJob.ts
│   ├── services/
│   │   ├── videoGenerator.ts
│   │   ├── textSlideRenderer.ts
│   │   ├── mediaProcessor.ts
│   │   └── storageService.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── upload.ts
│   │   └── validation.ts
│   ├── routes/
│   │   ├── projects.ts
│   │   ├── upload.ts
│   │   └── videos.ts
│   ├── utils/
│   │   ├── ffmpeg.ts
│   │   ├── canvas.ts
│   │   └── storage.ts
│   └── app.ts
├── uploads/
├── temp/
├── docker-compose.yml
└── package.json
```

## Performance Considerations

### 1. Caching Strategy
- Cache generated text slides for reuse
- Pre-process common background images
- Store user uploads in CDN

### 2. Queue Management
- Priority queues for premium users
- Batch processing for efficiency
- Auto-scaling workers based on load

### 3. Resource Optimization
- Compress images before processing
- Use progressive JPEG for backgrounds
- Limit video resolution based on content

## Deployment Strategy

### Development
```bash
docker-compose up -d  # MongoDB, Redis, API server
npm run dev          # Development server with hot reload
```

### Production
```bash
# Using Docker containers
docker build -t tribute-video-api .
docker run -d --env-file .env tribute-video-api

# Or using cloud services
# Deploy to AWS ECS, Google Cloud Run, or similar
```

## Security Considerations

1. **File Upload Validation**
   - Whitelist allowed file types
   - Scan for malware
   - Limit file sizes

2. **User Authentication**
   - JWT tokens for API access
   - Rate limiting on endpoints
   - Input validation and sanitization

3. **Data Protection**
   - Encrypt sensitive data at rest
   - Use HTTPS for all communications
   - Regular security audits

## Future Enhancements

1. **Real-time Collaboration**
   - WebSocket for live project editing
   - Conflict resolution for simultaneous edits

2. **Advanced Effects**
   - Motion graphics and animations
   - AI-powered photo enhancement
   - Voice synthesis for narration

3. **Analytics**
   - Track video generation times
   - User engagement metrics
   - Performance optimization insights

This architecture provides a solid foundation for building a scalable tribute video generation system while maintaining good performance and user experience.
