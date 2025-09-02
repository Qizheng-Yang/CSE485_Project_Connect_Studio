import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import ProjectSaver from '../components/ProjectSaver';
import LoadingSpinner from '../components/LoadingSpinner';
import { useImage } from '../context/ImageContext';
import { generateVideo, getVideoStatus } from '../services/api';
import { useState } from 'react';

function Step8() {
  const { currentProject, slides, media, music } = useImage();
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Prices
  const mp4Price = 20.00;
  const photoBookPrice = 53.00;
  
  // State for photo book quantity
  const [photoBookQty, setPhotoBookQty] = useState(1);
  
  // Calculate totals
  const mp4Total = mp4Price * 1; // Fixed quantity of 1
  const photoBookTotal = photoBookPrice * photoBookQty;
  const subTotal = mp4Total + photoBookTotal;

  const handleQtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQty = parseInt(e.target.value);
    setPhotoBookQty(newQty);
  };

  const handlePlaceOrder = async () => {
    if (!currentProject) return;
    
    setIsProcessingOrder(true);
    try {
      // Generate final video
      const result = await generateVideo({
        projectId: currentProject.id,
        slides,
        media,
        music,
        settings: {
          quality: 'high',
          format: 'mp4'
        }
      });

      // Poll for completion
      const checkStatus = async () => {
        const status = await getVideoStatus(result.videoId);
        if (status.status === 'completed') {
          setOrderComplete(true);
          setIsProcessingOrder(false);
        } else if (status.status === 'error') {
          throw new Error('Video generation failed');
        } else {
          setTimeout(checkStatus, 2000); // Check again in 2 seconds
        }
      };

      checkStatus();
    } catch (error) {
      console.error('Order processing failed:', error);
      setIsProcessingOrder(false);
      alert('Order processing failed. Please try again.');
    }
  };

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />
      <ProjectSaver />

      {/* Main Content */}
      <div className="main-content">
        {/* Checkout Section */}
        <div className="checkout-section">
          
          <div className="checkout-grid">
            {/* Header Row */}
            <div className="checkout-row header-row">
              <div className="checkout-col product-col">CHECK OUT</div>
              <div className="checkout-col price-col">PRICE</div>
              <div className="checkout-col qty-col">QTY</div>
              <div className="checkout-col total-col">TOTAL</div>
            </div>
            
            {/* MP4 Download Row */}
            <div className="checkout-row">
              <div className="checkout-col product-col">
                <strong>MP4 DOWNLOAD</strong>
                <div className="product-description">
                  Digital MP4 download that can be played on any device
                </div>
              </div>
              <div className="checkout-col price-col">${mp4Price.toFixed(2)} (CAD)</div>
              <div className="checkout-col qty-col">1</div>
              <div className="checkout-col total-col">${mp4Total.toFixed(2)} (CAD)</div>
            </div>
            
            {/* Photo Book Row */}
            <div className="checkout-row">
              <div className="checkout-col product-col">
                <strong>HARD COVER PHOTO BOOK</strong>
              </div>
              <div className="checkout-col price-col">${photoBookPrice.toFixed(2)} (CAD)</div>
              <div className="checkout-col qty-col">
                <select 
                  value={photoBookQty} 
                  onChange={handleQtyChange}
                  className="qty-select"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="checkout-col total-col">${photoBookTotal.toFixed(2)} (CAD)</div>
            </div>
            
            {/* Total Row */}
            <div className="checkout-row total-row">
              <div className="checkout-col product-col">
                <strong>TOTAL</strong>
                <div className="tax-note">Taxes and Shipping extra</div>
              </div>
              <div className="checkout-col price-col"></div>
              <div className="checkout-col qty-col">{1 + photoBookQty}</div>
              <div className="checkout-col total-col">${subTotal.toFixed(2)} (CAD)</div>
            </div>
          </div>
        </div>

        {isProcessingOrder && (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <LoadingSpinner message="Processing your order and generating video..." />
          </div>
        )}

        {orderComplete && (
          <div style={{ 
            textAlign: 'center', 
            margin: '20px 0', 
            padding: '20px',
            backgroundColor: '#d4edda',
            borderRadius: '8px',
            border: '1px solid #c3e6cb'
          }}>
            <h3 style={{ color: '#155724', margin: '0 0 10px 0' }}>Order Complete!</h3>
            <p style={{ color: '#155724', margin: 0 }}>
              Your memorial video has been generated successfully. You will receive download links via email.
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/step/7">
            <button className="back-button">Back</button>
          </Link>

          {/* Next Button */}
          <button 
            className="next-button"
            onClick={handlePlaceOrder}
            disabled={isProcessingOrder || orderComplete}
            style={{
              opacity: (isProcessingOrder || orderComplete) ? 0.6 : 1,
              cursor: (isProcessingOrder || orderComplete) ? 'not-allowed' : 'pointer'
            }}
          >
            {isProcessingOrder ? 'Processing...' : orderComplete ? 'Order Complete' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step8;