import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateVideo from './pages/CreateVideo';
import Step1 from './pages/Step1';
import Step2 from './pages/Step2';
import Step3 from './pages/Step3';
import Step4 from './pages/Step4';
import Step5 from './pages/Step5';
import Step6 from './pages/Step6';
import Step7 from './pages/Step7';
import Step8 from './pages/Step8';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateVideo />} />
      <Route path="/step/1" element={<Step1 />} />
      <Route path="/step/2" element={<Step2 />} />
      <Route path="/step/3" element={<Step3 />} />
      <Route path="/step/4" element={<Step4 />} />
      <Route path="/step/5" element={<Step5 />} />
      <Route path="/step/6" element={<Step6 />} />
      <Route path="/step/7" element={<Step7 />} />
      <Route path="/step/8" element={<Step8 />} />
    </Routes>
  );
}

export default App;
