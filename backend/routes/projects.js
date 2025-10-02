import express from 'express';
import database from '../database/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all projects for authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const projects = await database.query(
      `SELECT p.*, t.name as theme_name, t.thumbnail_path as theme_thumbnail
       FROM projects p
       LEFT JOIN themes t ON p.theme_id = t.id
       WHERE p.user_id = ?
       ORDER BY p.updated_at DESC`,
      [req.user.userId]
    );

    res.json({
      projects: projects || []
    });

  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve projects'
    });
  }
});

// Get single project by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;

    // Get project details
    const project = await database.get(
      `SELECT p.*, t.name as theme_name, t.thumbnail_path as theme_thumbnail
       FROM projects p
       LEFT JOIN themes t ON p.theme_id = t.id
       WHERE p.id = ? AND p.user_id = ?`,
      [projectId, req.user.userId]
    );

    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist or you do not have access to it'
      });
    }

    // Get media files for this project
    const mediaFiles = await database.query(
      `SELECT * FROM media_files 
       WHERE project_id = ? 
       ORDER BY order_index ASC, created_at ASC`,
      [projectId]
    );

    // Get slides for this project
    const slides = await database.query(
      `SELECT s.*, m.file_path, m.filename, m.file_type
       FROM slides s
       LEFT JOIN media_files m ON s.media_file_id = m.id
       WHERE s.project_id = ?
       ORDER BY s.order_index ASC`,
      [projectId]
    );

    res.json({
      project: {
        ...project,
        mediaFiles: mediaFiles || [],
        slides: slides || []
      }
    });

  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve project'
    });
  }
});

// Create new project
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, intro_text, theme_id, full_access_enabled } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Project title is required'
      });
    }

    // Create project
    const result = await database.run(
      `INSERT INTO projects (user_id, title, intro_text, theme_id, full_access_enabled)
       VALUES (?, ?, ?, ?, ?)`,
      [
        req.user.userId,
        title,
        intro_text || 'In Loving Memory of',
        theme_id || 1,
        full_access_enabled || false
      ]
    );

    // Get the created project
    const project = await database.get(
      `SELECT p.*, t.name as theme_name, t.thumbnail_path as theme_thumbnail
       FROM projects p
       LEFT JOIN themes t ON p.theme_id = t.id
       WHERE p.id = ?`,
      [result.lastID]
    );

    res.status(201).json({
      message: 'Project created successfully',
      project
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create project'
    });
  }
});

// Update project
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { title, intro_text, theme_id, full_access_enabled, status } = req.body;

    // Check if project exists and belongs to user
    const existingProject = await database.get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, req.user.userId]
    );

    if (!existingProject) {
      return res.status(404).json({
        error: 'Project not found',
        message: 'Project does not exist or you do not have access to it'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (intro_text !== undefined) {
      updates.push('intro_text = ?');
      values.push(intro_text);
    }
    if (theme_id !== undefined) {
      updates.push('theme_id = ?');
      values.push(theme_id);
    }
    if (full_access_enabled !== undefined) {
      updates.push('full_access_enabled = ?');
      values.push(full_access_enabled);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: 'No updates provided',
        message: 'At least one field must be provided for update'
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(projectId);

    await database.run(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated project
    const project = await database.get(
      `SELECT p.*, t.name as theme_name, t.thumbnail_path as theme_thumbnail
       FROM projects p
       LEFT JOIN themes t ON p.theme_id = t.id
       WHERE p.id = ?`,
      [projectId]
    );

    res.json({
      message: 'Project updated successfully',
      project
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update project'
    });
  }
});

// Delete project
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.id;

    // Check if project exists and belongs to user
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

    // Delete project (cascading deletes will handle related records)
    await database.run('DELETE FROM projects WHERE id = ?', [projectId]);

    res.json({
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete project'
    });
  }
});

export default router;
