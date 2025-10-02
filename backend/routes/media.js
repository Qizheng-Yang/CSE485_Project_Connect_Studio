import express from 'express';
import { unlink } from 'fs/promises';
import { join } from 'path';
import database from '../database/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadMultiple, handleUploadError } from '../middleware/upload.js';
import { config } from '../config.js';

const router = express.Router();

// Upload media files
router.post('/upload/:projectId', authenticateToken, uploadMultiple, handleUploadError, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'At least one file must be provided'
      });
    }

    // Verify project belongs to user
    const project = await database.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist or you do not have access to it'
      });
    }

    // Get current max order for this project
    const maxOrderResult = await database.get(
      'SELECT MAX(order_index) as max_order FROM media_files WHERE project_id = ?',
      [projectId]
    );
    
    let currentOrder = (maxOrderResult?.max_order || 0) + 1;

    // Process each uploaded file
    const uploadedFiles = [];
    
    for (const file of files) {
      // Determine file type
      let fileType = 'other';
      if (file.mimetype.startsWith('image/')) {
        fileType = 'image';
      } else if (file.mimetype.startsWith('video/')) {
        fileType = 'video';
      } else if (file.mimetype.startsWith('audio/')) {
        fileType = 'audio';
      }

      // Insert file record into database
      const result = await database.run(
        `INSERT INTO media_files 
         (project_id, filename, original_filename, file_path, file_type, mime_type, file_size, order_index)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          file.filename,
          file.originalname,
          file.path,
          fileType,
          file.mimetype,
          file.size,
          currentOrder++
        ]
      );

      uploadedFiles.push({
        id: result.lastID,
        filename: file.filename,
        originalFilename: file.originalname,
        fileType,
        mimeType: file.mimetype,
        fileSize: file.size,
        orderIndex: currentOrder - 1,
        url: `/api/media/file/${result.lastID}`
      });
    }

    res.status(201).json({
      message: `${files.length} file(s) uploaded successfully`,
      files: uploadedFiles
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      req.files.forEach(async (file) => {
        try {
          await unlink(file.path);
        } catch (unlinkError) {
          console.error('Error cleaning up file:', unlinkError);
        }
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to upload files'
    });
  }
});

// Get media file by ID (serves the actual file)
router.get('/file/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    const mediaFile = await database.get(
      'SELECT * FROM media_files WHERE id = ?',
      [fileId]
    );

    if (!mediaFile) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested file does not exist'
      });
    }

    // Set appropriate headers
    res.setHeader('Content-Type', mediaFile.mime_type);
    res.setHeader('Content-Length', mediaFile.file_size);
    res.setHeader('Content-Disposition', `inline; filename="${mediaFile.original_filename}"`);

    // Send file
    res.sendFile(join(process.cwd(), mediaFile.file_path));

  } catch (error) {
    console.error('Serve file error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to serve file'
    });
  }
});

// Get all media files for a project
router.get('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // Verify project belongs to user
    const project = await database.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist or you do not have access to it'
      });
    }

    const mediaFiles = await database.query(
      `SELECT id, filename, original_filename, file_type, mime_type, 
              file_size, order_index, is_main_image, created_at
       FROM media_files 
       WHERE project_id = ? 
       ORDER BY order_index ASC, created_at ASC`,
      [projectId]
    );

    // Add URL to each file
    const filesWithUrls = mediaFiles.map(file => ({
      ...file,
      url: `/api/media/file/${file.id}`
    }));

    res.json({
      files: filesWithUrls
    });

  } catch (error) {
    console.error('Get media files error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve media files'
    });
  }
});

// Update media file order
router.put('/reorder/:projectId', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { fileOrders } = req.body; // Array of {id, order} objects

    if (!fileOrders || !Array.isArray(fileOrders)) {
      return res.status(400).json({
        error: 'Invalid data',
        message: 'fileOrders must be an array of {id, order} objects'
      });
    }

    // Verify project belongs to user
    const project = await database.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist or you do not have access to it'
      });
    }

    // Update each file's order
    for (const { id, order } of fileOrders) {
      await database.run(
        'UPDATE media_files SET order_index = ? WHERE id = ? AND project_id = ?',
        [order, id, projectId]
      );
    }

    res.json({
      message: 'File order updated successfully'
    });

  } catch (error) {
    console.error('Reorder files error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update file order'
    });
  }
});

// Delete media file
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.id;

    // Get file info and verify ownership through project
    const mediaFile = await database.get(
      `SELECT mf.*, p.user_id 
       FROM media_files mf
       JOIN projects p ON mf.project_id = p.id
       WHERE mf.id = ?`,
      [fileId]
    );

    if (!mediaFile) {
      return res.status(404).json({
        error: 'File not found',
        message: 'The requested file does not exist'
      });
    }

    if (mediaFile.user_id !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to delete this file'
      });
    }

    // Delete file from database
    await database.run('DELETE FROM media_files WHERE id = ?', [fileId]);

    // Delete physical file
    try {
      await unlink(mediaFile.file_path);
    } catch (unlinkError) {
      console.error('Error deleting physical file:', unlinkError);
      // Continue - database record is already deleted
    }

    res.json({
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete file'
    });
  }
});

// Set main image for project
router.put('/main-image/:projectId/:fileId', authenticateToken, async (req, res) => {
  try {
    const { projectId, fileId } = req.params;

    // Verify project belongs to user
    const project = await database.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist or you do not have access to it'
      });
    }

    // Verify file belongs to project and is an image
    const mediaFile = await database.get(
      'SELECT id, file_type FROM media_files WHERE id = ? AND project_id = ?',
      [fileId, projectId]
    );

    if (!mediaFile) {
      return res.status(404).json({
        error: 'File not found',
        message: 'File does not exist in this project'
      });
    }

    if (mediaFile.file_type !== 'image') {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'Only image files can be set as main image'
      });
    }

    // Clear existing main image
    await database.run(
      'UPDATE media_files SET is_main_image = FALSE WHERE project_id = ?',
      [projectId]
    );

    // Set new main image
    await database.run(
      'UPDATE media_files SET is_main_image = TRUE WHERE id = ?',
      [fileId]
    );

    res.json({
      message: 'Main image updated successfully'
    });

  } catch (error) {
    console.error('Set main image error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to set main image'
    });
  }
});

export default router;
