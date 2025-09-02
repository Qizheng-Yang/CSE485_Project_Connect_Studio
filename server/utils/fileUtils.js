import fs from 'fs';
import path from 'path';

export const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

export const isValidImageType = (mimetype) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  return validTypes.includes(mimetype);
};

export const isValidVideoType = (mimetype) => {
  const validTypes = ['video/mp4', 'video/mov', 'video/avi'];
  return validTypes.includes(mimetype);
};

export const isValidAudioType = (mimetype) => {
  const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a'];
  return validTypes.includes(mimetype);
};