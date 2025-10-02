import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

// Import configuration and database
import { config } from './config.js';
import database from './database/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import mediaRoutes from './routes/media.js';
import themeRoutes from './routes/themes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Create necessary directories
const createDirectories = () => {
  const dirs = [
    './database',
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

// Initialize directories
createDirectories();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Connect Studio Backend is running',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/themes', themeRoutes);

// Serve static files (uploaded media)
app.use('/uploads', express.static(config.UPLOAD_DIR));

// Serve theme images from frontend public directory
app.use('/themes', express.static(join(__dirname, '../public/themes')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: config.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    ...(config.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database
    await database.connect();
    
    // Initialize database schema
    await database.initSchema();
    
    // Start server
    app.listen(config.PORT, () => {
      console.log(`
🚀 Connect Studio Backend Server Started!

📍 Server running on: http://localhost:${config.PORT}
🌍 Environment: ${config.NODE_ENV}
📊 Health check: http://localhost:${config.PORT}/api/health
📁 Upload directory: ${config.UPLOAD_DIR}
🗄️  Database: ${config.DB_PATH}

API Endpoints:
  POST /api/auth/register     - Register new user
  POST /api/auth/login        - Login user
  GET  /api/auth/verify       - Verify token
  
  GET  /api/projects          - Get user projects
  POST /api/projects          - Create new project
  GET  /api/projects/:id      - Get project details
  PUT  /api/projects/:id      - Update project
  DELETE /api/projects/:id    - Delete project
  
  POST /api/media/upload/:projectId  - Upload media files
  GET  /api/media/project/:projectId - Get project media
  GET  /api/media/file/:id           - Serve media file
  DELETE /api/media/:id              - Delete media file
  
  GET  /api/themes            - Get all themes
  GET  /api/themes/:id        - Get theme by ID

Ready to accept connections! 🎉
      `);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server gracefully...');
  
  try {
    await database.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  
  try {
    await database.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer();
