
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import NavbarBabbo from '../components/NavbarBabbo'; // Or a simpler guest navbar

const ContributePage = () => {
  const { tributeId } = useParams(); // Gets 'your-tribute' from the URL
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [message, setMessage] = useState('');

  const onDrop = (acceptedFiles: File[]) => {
    setUploadedFiles(prev => [...prev, ...acceptedFiles]);
    setMessage(`${acceptedFiles.length} file(s) added! Thank you for contributing.`);
    
    console.log(`Uploading ${acceptedFiles.length} files for tribute: ${tributeId}`);
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov'],
    },
  });


  return (
    <div className="container">
      <NavbarBabbo />
      <div className="main-content" style={{ textAlign: 'center' }}>
        <h2 style={{ marginTop: '40px' }}>Contribute to the Tribute</h2>
        <p>Upload your photos and videos below. They will be shared with the creator.</p>

        <div 
          {...getRootProps()} 
          style={{
            border: '2px dashed #b2cc55',
            borderRadius: '10px',
            padding: '60px',
            margin: '40px auto',
            maxWidth: '800px',
            backgroundColor: isDragActive ? '#f0f8ff' : '#f9f9f9',
            cursor: 'pointer'
          }}
        >
          <input {...getInputProps()} />
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Drag & drop files here, or click to select</p>
          <p style={{ fontSize: '14px', color: '#666' }}>Supports: JPG, PNG, GIF, MP4, MOV</p>
        </div>

        {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
        
        {uploadedFiles.length > 0 && (
          <div>
            <h4>Your Added Files:</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {uploadedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


export default ContributePage;
