import React, { useRef } from 'react';
import * as api from '../services/api';

function ImageUpload({ onImageUpload }) {
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const filename = await api.uploadImage(file);
            onImageUpload(filename);  // Notify parent component
        } catch (error) {
            console.error("Upload error:", error);
            // Display an error message to the user (important!)
            alert(`Upload failed: ${error.message}`);
        }
    };

    return (
        <div className="image-upload">
            <label>UPLOAD MAIN IMAGE</label>
            <button type="button" onClick={() => fileInputRef.current.click()}>
                <span role="img" aria-label="edit">✏️</span>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*" // Restrict to image files
            />
        </div>
    );
}

export default ImageUpload;
