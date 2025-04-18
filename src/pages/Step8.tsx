import { Link } from 'react-router-dom';
import NavbarBabbo from '../components/NavbarBabbo';
import StepNavigation from '../components/StepNavigation';

function Step8() {
  return (
    <div className="container">
      <NavbarBabbo />
      <StepNavigation />

      {/* Main Content */}
      <div className="main-content">
        {/* Checkout Section */}
        <div className="checkout-section">
          <h2 className="checkout-header">CHECK OUT</h2>
          
          <div className="checkout-grid">
            {/* Header Row */}
            <div className="checkout-row header-row">
              <div className="checkout-col product-col">PRODUCT</div>
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
              <div className="checkout-col price-col">$20.00 (CAD)</div>
              <div className="checkout-col qty-col">1</div>
              <div className="checkout-col total-col">$20.00 (CAD)</div>
            </div>
            
            {/* Photo Book Row */}
            <div className="checkout-row">
              <div className="checkout-col product-col">
                <strong>HARD COVER PHOTO BOOK</strong>
              </div>
              <div className="checkout-col price-col">$53.00 (CAD)</div>
              <div className="checkout-col qty-col">1</div>
              <div className="checkout-col total-col">$53.00 (CAD)</div>
            </div>
            
            {/* Total Row */}
            <div className="checkout-row total-row">
              <div className="checkout-col product-col">
                <strong>TOTAL</strong>
                <div className="tax-note">Taxes and Shipping extra</div>
              </div>
              <div className="checkout-col price-col"></div>
              <div className="checkout-col qty-col">1</div>
              <div className="checkout-col total-col">$73.00 (CAD)</div>
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