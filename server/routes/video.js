import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Generate video preview
router.post('/preview', async (req, res) => {
  try {
    const { projectId, slides, media, music, settings } = req.body;

    if (!slides || slides.length === 0) {
      return res.status(400).json({ error: 'No slides provided' });
    }

    const previewId = uuidv4();
    const outputPath = path.join(__dirname, '../output', `preview-${previewId}.mp4`);

    // Create a simple preview video
    const command = ffmpeg();

    // Add slides as images with duration
    slides.forEach((slide, index) => {
      if (slide.backgroundImage) {
        const imagePath = path.join(__dirname, '../uploads', path.basename(slide.backgroundImage));
        if (fs.existsSync(imagePath)) {
          command.input(imagePath);
        }
      }
    });

    // Add music if provided
    if (music && music.length > 0) {
      const musicPath = path.join(__dirname, '../uploads', path.basename(music[0].filename));
      if (fs.existsSync(musicPath)) {
        command.input(musicPath);
      }
    }

    command
      .outputOptions([
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-r 30',
        '-t 30' // 30 second preview
      ])
      .output(outputPath)
      .on('end', () => {
        res.json({
          message: 'Preview generated successfully',
          previewId,
          url: `/output/preview-${previewId}.mp4`
        });
      })
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        res.status(500).json({ error: 'Preview generation failed' });
      })
      .run();

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

// Generate final video
router.post('/generate', async (req, res) => {
  try {
    const { projectId, slides, media, music, settings } = req.body;

    if (!slides || slides.length === 0) {
      return res.status(400).json({ error: 'No slides provided' });
    }

    const videoId = uuidv4();
    const outputPath = path.join(__dirname, '../output', `video-${videoId}.mp4`);

    // Start video generation process
    res.json({
      message: 'Video generation started',
      videoId,
      status: 'processing'
    });

    // Generate video in background
    generateVideo(projectId, slides, media, music, settings, outputPath, videoId);

  } catch (error) {
    console.error('Video generation error:', error);
    res.status(500).json({ error: 'Failed to start video generation' });
  }
});

// Check video generation status
router.get('/status/:videoId', (req, res) => {
  try {
    const { videoId } = req.params;
    const outputPath = path.join(__dirname, '../output', `video-${videoId}.mp4`);
    const statusFile = path.join(__dirname, '../temp', `status-${videoId}.json`);

    if (fs.existsSync(statusFile)) {
      const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
      res.json(status);
    } else if (fs.existsSync(outputPath)) {
      res.json({
        status: 'completed',
        url: `/output/video-${videoId}.mp4`,
        completedAt: new Date().toISOString()
      });
    } else {
      res.json({
        status: 'processing',
        message: 'Video is being generated...'
      });
    }
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// Background video generation function
async function generateVideo(projectId, slides, media, music, settings, outputPath, videoId) {
  const statusFile = path.join(__dirname, '../temp', `status-${videoId}.json`);
  
  try {
    // Update status
    fs.writeFileSync(statusFile, JSON.stringify({
      status: 'processing',
      progress: 0,
      message: 'Starting video generation...'
    }));

    const command = ffmpeg();
    let totalDuration = 0;

    // Process slides
    slides.forEach((slide, index) => {
      const duration = parseInt(slide.customDuration?.split(' ')[0]) || 5;
      totalDuration += duration;

      if (slide.backgroundImage) {
        const imagePath = path.join(__dirname, '../uploads', path.basename(slide.backgroundImage));
        if (fs.existsSync(imagePath)) {
          command.input(imagePath);
        }
      }
    });

    // Add music
    if (music && music.length > 0) {
      const musicPath = path.join(__dirname, '../uploads', path.basename(music[0].filename));
      if (fs.existsSync(musicPath)) {
        command.input(musicPath);
      }
    }

    command
      .outputOptions([
        '-c:v libx264',
        '-pix_fmt yuv420p',
        '-r 30',
        `-t ${totalDuration}`
      ])
      .output(outputPath)
      .on('progress', (progress) => {
        fs.writeFileSync(statusFile, JSON.stringify({
          status: 'processing',
          progress: Math.round(progress.percent || 0),
          message: `Generating video... ${Math.round(progress.percent || 0)}%`
        }));
      })
      .on('end', () => {
        fs.writeFileSync(statusFile, JSON.stringify({
          status: 'completed',
          progress: 100,
          url: `/output/video-${videoId}.mp4`,
          completedAt: new Date().toISOString()
        }));
      })
      .on('error', (err) => {
        console.error('Video generation error:', err);
        fs.writeFileSync(statusFile, JSON.stringify({
          status: 'error',
          error: err.message,
          failedAt: new Date().toISOString()
        }));
      })
      .run();

  } catch (error) {
    console.error('Background generation error:', error);
    fs.writeFileSync(statusFile, JSON.stringify({
      status: 'error',
      error: error.message,
      failedAt: new Date().toISOString()
    }));
  }
}

export default router;