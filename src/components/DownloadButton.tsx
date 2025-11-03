import React from 'react';

// Define the props this component needs from its parent
interface DownloadButtonProps {
  isDownloading: boolean;
  onDownload: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ isDownloading, onDownload }) => {
  return (
    <button
      onClick={onDownload}
      disabled={isDownloading}
      style={{
        backgroundColor: '#28a745', // A distinct green for download
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        padding: '10px 20px',
        margin: '0 5px', // Use margin to space it out from other buttons
        cursor: isDownloading ? 'not-allowed' : 'pointer',
        fontSize: '14px',
        opacity: isDownloading ? 0.7 : 1,
      }}
    >
      {isDownloading ? 'Preparing...' : '⬇️ Download Video'}
    </button>
  );
};

export default DownloadButton;