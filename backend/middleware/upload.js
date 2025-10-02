import multer from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config.js';
import { mkdirSync, existsSync } from 'fs';

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    config.UPLOAD_DIR,
    join(config.UPLOAD_DIR, 'images'),
    join(config.UPLOAD_DIR, 'videos'),
    join(config.UPLOAD_DIR, 'audio')
  ];

  dirs.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

// Initialize upload directories
createUploadDirs();

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = config.UPLOAD_DIR;
    
    // Organize files by type
    if (file.mimetype.startsWith('image/')) {
      uploadPath = join(config.UPLOAD_DIR, 'images');
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = join(config.UPLOAD_DIR, 'videos');
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath = join(config.UPLOAD_DIR, 'audio');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    'image/jpeg': true,
    'image/jpg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    'image/heic': true,
    'image/heif': true,
    'video/mp4': true,
    'video/mov': true,
    'video/quicktime': true,
    'audio/mpeg': true,
    'audio/mp3': true,
    'audio/wav': true,
    'audio/ogg': true,
    'audio/m4a': true
  };

  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: config.MAX_FILE_SIZE, // 50MB default
    files: 20 // Maximum 20 files per request
  }
});

// Error handling middleware for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: `File size must be less than ${config.MAX_FILE_SIZE / 1024 / 1024}MB`
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Maximum 20 files allowed per upload'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected field',
        message: 'Unexpected file field in request'
      });
    }
  }
  
  if (err.message.includes('File type')) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: err.message
    });
  }

  // Pass other errors to default error handler
  next(err);
};

// Export different upload configurations
export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 20);
export const uploadFields = upload.fields([
  { name: 'images', maxCount: 15 },
  { name: 'videos', maxCount: 5 },
  { name: 'audio', maxCount: 3 }
]);

export default upload;
