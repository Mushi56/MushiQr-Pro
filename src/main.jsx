import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import About from './About.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import Terms from './Terms.jsx';
import Footer from './Footer.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/generator" element={<App />} />
        <Route path="/settings" element={<App />} />
        <Route path="/saved" element={<App />} />
        <Route path="/history" element={<App />} />
        <Route path="/scanner" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);
