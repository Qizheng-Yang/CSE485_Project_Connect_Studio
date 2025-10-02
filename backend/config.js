// Configuration file for the backend
export const config = {
  // Server Configuration
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // JWT Secret (change this in production!)
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',

  // Database
  DB_PATH: process.env.DB_PATH || './database/connect_studio.db',

  // File Upload Settings
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 50000000, // 50MB

  // CORS Settings
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
};
