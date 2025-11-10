import express from 'express';
import database from '../database/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all slides for a project
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

    // Get slides for the project
    const slides = await database.query(
      `SELECT s.*, mf.id as media_id, mf.filename, mf.original_filename, mf.file_path, mf.file_type, mf.mime_type
       FROM slides s
       LEFT JOIN media_files mf ON s.media_file_id = mf.id
       WHERE s.project_id = ?
       ORDER BY s.order_index ASC`,
      [projectId]
    );

    // Format slides for frontend
    const formattedSlides = slides.map(slide => {
      // If slide has a media_file_id, construct the proper URL
      let backgroundImage = slide.background_image;
      let imageUrl = slide.background_image;
      
      if (slide.media_file_id && slide.media_id) {
        // Construct the API URL for the media file
        const mediaUrl = `/api/media/file/${slide.media_file_id}`;
        backgroundImage = mediaUrl;
        imageUrl = mediaUrl;
        console.log(`Slide ${slide.id}: Resolved media_file_id ${slide.media_file_id} to URL: ${mediaUrl}`);
      } else {
        console.log(`Slide ${slide.id}: No media_file_id, using stored background_image: ${backgroundImage}`);
      }
      
      return {
        id: slide.id.toString(),
        type: slide.custom_text ? 'text' : 'image', // Determine type by whether it has text
        backgroundImage: backgroundImage,
        imageUrl: imageUrl,
        mediaFileId: slide.media_file_id ? slide.media_file_id.toString() : null,
        order: slide.order_index,
        duration: slide.duration,
        transition: slide.transition,
        filters: slide.filters ? JSON.parse(slide.filters) : null,
        // Additional fields for text slides
        customText: slide.custom_text || '',
        customFont: slide.custom_font || 'Montserrat',
        customColor: slide.custom_color || '#000000',
        customDuration: slide.duration ? slide.duration.toString() : '5'
      };
    });

    res.json({
      message: 'Slides retrieved successfully',
      slides: formattedSlides
    });

  } catch (error) {
    console.error('Get slides error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve slides'
    });
  }
});

// Create or update slides for a project
router.post('/project/:projectId', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { slides } = req.body;

    if (!Array.isArray(slides)) {
      return res.status(400).json({
        error: 'Invalid data',
        message: 'Slides must be an array'
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

    // Delete existing slides for this project
    await database.run(
      'DELETE FROM slides WHERE project_id = ?',
      [projectId]
    );

    // Insert new slides
    const createdSlides = [];
    
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      
      // Prepare slide data
      const slideData = {
        project_id: projectId,
        media_file_id: slide.mediaFileId || null,
        background_image: slide.backgroundImage || null,
        order_index: i,
        duration: parseFloat(slide.customDuration || slide.duration || 5),
        transition: slide.transition || 'fade',
        filters: slide.filters ? JSON.stringify(slide.filters) : null,
        // Text slide specific fields
        custom_text: slide.customText || null,
        custom_font: slide.customFont || 'Montserrat',
        custom_color: slide.customColor || '#000000'
      };

      const result = await database.run(
        `INSERT INTO slides 
         (project_id, media_file_id, background_image, order_index, duration, transition, filters, custom_text, custom_font, custom_color)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          slideData.project_id,
          slideData.media_file_id,
          slideData.background_image,
          slideData.order_index,
          slideData.duration,
          slideData.transition,
          slideData.filters,
          slideData.custom_text,
          slideData.custom_font,
          slideData.custom_color
        ]
      );

      createdSlides.push({
        id: result.lastID.toString(),
        ...slide,
        order: i
      });
    }

    res.status(201).json({
      message: `${slides.length} slide(s) saved successfully`,
      slides: createdSlides
    });

  } catch (error) {
    console.error('Save slides error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to save slides'
    });
  }
});

// Delete all slides for a project
router.delete('/project/:projectId', authenticateToken, async (req, res) => {
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

    // Delete slides
    const result = await database.run(
      'DELETE FROM slides WHERE project_id = ?',
      [projectId]
    );

    res.json({
      message: 'Slides deleted successfully',
      deletedCount: result.changes
    });

  } catch (error) {
    console.error('Delete slides error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete slides'
    });
  }
});

export default router;
