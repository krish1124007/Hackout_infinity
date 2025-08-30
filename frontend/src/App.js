import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OrganizationForm from './pages/OrganizationForm';
import SolarPanel from './3dModels/SolarPanel';
import WindPower from './3dModels/WindPower';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <div className='App'>
        <Navbar/>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/qna" element={<OrganizationForm/>} />
          <Route path="/solar" element={<SolarPanel/>} />
          <Route path="/wind" element={<WindPower/>} />

        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;