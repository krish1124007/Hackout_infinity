import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import OrganizationForm from './pages/OrganizationForm/OrganizationForm';
import SolarPanel from './3dModels/SolarPanel';
import WindPower from './3dModels/WindPower';
import Map from './pages/Map';
import GreenHorizon from './pages/GreenHorizon/GreenHorizon';
import PlantAssessment from './pages/PlantAssessment/PlantAssessment';
import Machinery from './pages/Machinary';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

function Layout() {
  const location = useLocation();

  // Jaha Navbar & Footer nahi chahiye un routes ka list
  const hideLayoutRoutes = ["/", "/auth"];

  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideLayout && <Navbar />}
      <main className='main-content'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/qna" element={<OrganizationForm />} />
          <Route path="/solar" element={<SolarPanel />} />
          <Route path="/wind" element={<WindPower />} />
          <Route path="/map" element={<Map />} />
          <Route path='/assessment' element={<PlantAssessment/>} />
          <Route path='/news' element={<GreenHorizon/>} />
          <Route path='/machinary' element={<Machinery/>} />

        </Routes>

      </main>
      
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;