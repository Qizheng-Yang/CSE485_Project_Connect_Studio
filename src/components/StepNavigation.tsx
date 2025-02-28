import { Link } from 'react-router-dom';

function StepNavigation() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
        <Link key={num} to={`/step/${num}`} style={{ margin: '0 10px' }}>
          <button>{num}</button>
        </Link>
      ))}
    </div>
  );
}

export default StepNavigation;
