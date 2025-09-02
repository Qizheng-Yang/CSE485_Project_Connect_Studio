export const validateProject = (req, res, next) => {
  const { name, intro } = req.body;
  
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'Valid name is required' });
  }
  
  if (!intro || typeof intro !== 'string' || intro.trim().length === 0) {
    return res.status(400).json({ error: 'Valid intro text is required' });
  }
  
  if (name.length > 100) {
    return res.status(400).json({ error: 'Name must be less than 100 characters' });
  }
  
  if (intro.length > 200) {
    return res.status(400).json({ error: 'Intro text must be less than 200 characters' });
  }
  
  next();
};

export const validateFileUpload = (req, res, next) => {
  if (!req.file && !req.files) {
    return res.status(400).json({ error: 'No file provided' });
  }
  
  next();
};