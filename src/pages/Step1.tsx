import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StepNavigation from '../components/StepNavigation';

import { useState } from 'react';



function Step1() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0]; // Gets the first selected file
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Generates a preview url
    }
  };

  
  return (
    <div>
      <Navbar />
      <StepNavigation />
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <h2>Step 1: Upload Main Image</h2>
        <input type="file" accept="image/*" onChange={handleImageUpload}/>
        {imagePreview && (
          <div style={{ marginTop: '20px' }}>
            <h3>Image Preview:</h3>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ height: '200px', width: '200px', border: '1px solid black', borderRadius: '5px' }} 
            />
          </div>
        )}
        
        <h3>Title:</h3>
        <input type="text" placeholder="Insert Name" />
        <div style={{ marginTop: '20px' }}>
          <Link to="/create"><button>Back</button></Link>
          <Link to="/step/2"><button>Next</button></Link>
        </div>
      </div>
    </div>
  );
}

export default Step1;
