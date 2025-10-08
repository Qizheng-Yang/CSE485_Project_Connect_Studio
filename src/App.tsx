import { Routes, Route } from 'react-router-dom';
import { ImageProvider } from './context/ImageContext'; // Import the ImageProvider
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import Home from './pages/Home';
import CreateVideo from './pages/CreateVideo';
import Step1 from './pages/Step1';
import Step2 from './pages/Step2';
import Step3 from './pages/Step3';
import Step4 from './pages/Step4';
import Step5 from './pages/Step5';
import Step6 from './pages/Step6';
import AuthPage from './pages/AuthPage'; // import your full-page auth component
import ContributePage from './pages/ContributePage';

function App() {
  return (
    <AuthProvider> {/* Provide auth context to all routes */}
      <ImageProvider> {/* Provide image context to all routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateVideo />} />
          <Route path="/step/1" element={<Step1 />} />
          <Route path="/step/2" element={<Step2 />} />
          <Route path="/step/3" element={<Step3 />} />
          <Route path="/step/4" element={<Step4 />} />
          <Route path="/step/5" element={<Step5 />} />
          <Route path="/step/6" element={<Step6 />} />
          <Route path="/auth" element={<AuthPage />} /> 
          <Route path="/contribute/:tributeId" element={<ContributePage />} />
        </Routes>
      </ImageProvider>
    </AuthProvider>
  );
}

export default App;
