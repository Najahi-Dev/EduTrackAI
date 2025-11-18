import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Registration from './pages/Registration';
import Attendance from './pages/Attendance';
import Students from './pages/Students';

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col text-gray-800">
          <Navbar />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<Registration />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/students" element={<Students />} />
            </Routes>
          </main>
          <footer className="glass border-t border-white/40 mt-auto relative z-10">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <p className="text-center text-sm text-gray-500 font-medium">© 2024 EduTrack AI. Intelligent School Management.</p>
             </div>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;