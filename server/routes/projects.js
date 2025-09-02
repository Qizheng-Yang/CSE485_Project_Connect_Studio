import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const projectsFile = path.join(__dirname, '../data/projects.json');

// Ensure data directory exists
const dataDir = path.dirname(projectsFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize projects file if it doesn't exist
if (!fs.existsSync(projectsFile)) {
  fs.writeFileSync(projectsFile, JSON.stringify([]));
}

// Get all projects
router.get('/', (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
    res.json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Get project by ID
router.get('/:id', (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
    const project = projects.find(p => p.id === req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error reading project:', error);
    res.status(500).json({ error: 'Failed to load project' });
  }
});

// Create new project
router.post('/', (req, res) => {
  try {
    const { name, intro, theme, slides = [], media = [], music = [] } = req.body;
    
    if (!name || !intro) {
      return res.status(400).json({ error: 'Name and intro are required' });
    }

    const newProject = {
      id: uuidv4(),
      name,
      intro,
      theme,
      slides,
      media,
      music,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };

    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
    projects.push(newProject);
    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
    const projectIndex = projects.findIndex(p => p.id === req.params.id);
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const updatedProject = {
      ...projects[projectIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    projects[projectIndex] = updatedProject;
    fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  try {
    const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
    const filteredProjects = projects.filter(p => p.id !== req.params.id);
    
    if (projects.length === filteredProjects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    fs.writeFileSync(projectsFile, JSON.stringify(filteredProjects, null, 2));
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;