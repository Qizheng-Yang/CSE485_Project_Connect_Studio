import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';
import { useState } from 'react';

function Step8() {
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

  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

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

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          {/* Back Button */}
          <Link to="/step/7">
            <button className="back-button">Back</button>
          </Link>

          {/* Next Button */}
          <button className="next-button">Place Order</button>
        </div>
      </div>
    </div>
  );
}

export default Step8;