import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SkillProvider } from './contexts/SkillContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import Learning from './pages/Learning';
import Reels from './pages/Reels';
import SkillGraph from './pages/SkillGraph';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SkillProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/skills" element={<Skills />} />
                  <Route path="/learning" element={<Learning />} />
                  <Route path="/reels" element={<Reels />} />
                  <Route path="/skillgraph" element={<SkillGraph />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SkillProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;