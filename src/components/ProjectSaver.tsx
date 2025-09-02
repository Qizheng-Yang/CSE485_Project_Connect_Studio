import React, { useEffect, useState } from 'react';
import { useImage } from '../context/ImageContext';
import { createProject, updateProject } from '../services/api';

const ProjectSaver: React.FC = () => {
  const { 
    currentProject, 
    setCurrentProject, 
    name, 
    intro, 
    slides, 
    media, 
    music, 
    selectedTheme,
    setError 
  } = useImage();
  
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save project every 30 seconds if there are changes
  useEffect(() => {
    const saveProject = async () => {
      if (!name || !intro) return; // Don't save incomplete projects
      
      setIsSaving(true);
      try {
        if (currentProject) {
          // Update existing project
          const updated = await updateProject(currentProject.id, {
            name,
            intro,
            theme: selectedTheme,
            slides,
            media,
            music
          });
          setCurrentProject(updated);
        } else {
          // Create new project
          const newProject = await createProject({
            name,
            intro,
            theme: selectedTheme,
            slides,
            media,
            music
          });
          setCurrentProject(newProject);
        }
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
        setError('Failed to save project automatically');
      } finally {
        setIsSaving(false);
      }
    };

    const interval = setInterval(saveProject, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [currentProject, name, intro, selectedTheme, slides, media, music]);

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 text-sm text-gray-600">
      {isSaving ? (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          Saving...
        </div>
      ) : lastSaved ? (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Saved {lastSaved.toLocaleTimeString()}
        </div>
      ) : (
        <div className="text-gray-400">Not saved</div>
      )}
    </div>
  );
};

export default ProjectSaver;