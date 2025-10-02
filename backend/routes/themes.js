import express from 'express';
import database from '../database/database.js';

const router = express.Router();

// Get all available themes
router.get('/', async (req, res) => {
  try {
    const themes = await database.query(
      'SELECT * FROM themes ORDER BY id ASC'
    );

    res.json({
      themes: themes || []
    });

  } catch (error) {
    console.error('Get themes error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve themes'
    });
  }
});

// Get single theme by ID
router.get('/:id', async (req, res) => {
  try {
    const themeId = req.params.id;

    const theme = await database.get(
      'SELECT * FROM themes WHERE id = ?',
      [themeId]
    );

    if (!theme) {
      return res.status(404).json({
        error: 'Theme not found',
        message: 'The requested theme does not exist'
      });
    }

    res.json({
      theme
    });

  } catch (error) {
    console.error('Get theme error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to retrieve theme'
    });
  }
});

export default router;
