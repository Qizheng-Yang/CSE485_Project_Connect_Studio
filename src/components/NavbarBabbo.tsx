import logoImage from '../assets/logoImage.png';

function NavbarBabbo() {
    return (
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1px', borderBottom: '1px solid black' }}>

          <h2 className="nav-bar-studio-text">S T U D I O</h2>

        {/* <h3 className="myBabbo-logo">MYBABBO</h3> */}
        <img src={logoImage} className="myBabbo-logo" alt="MyBabbo Logo" />
      </nav>
    );
  }
  
  export default NavbarBabbo;
  