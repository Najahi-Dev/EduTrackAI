import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, Users, UserPlus, ClipboardCheck } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? 'bg-white/80 text-violet-700 shadow-sm ring-1 ring-violet-200' 
    : 'text-gray-600 hover:bg-white/50 hover:text-violet-600';

  return (
    <nav className="glass sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-gray-800 font-bold text-xl tracking-tight">EduTrack <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">AI</span></span>
            </Link>
            
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-1">
                <Link to="/" className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${isActive('/')}`}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/students" className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${isActive('/students')}`}>
                  <Users size={18} /> Students
                </Link>
                <Link to="/register" className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${isActive('/register')}`}>
                  <UserPlus size={18} /> Registration
                </Link>
                <Link to="/attendance" className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-200 ${isActive('/attendance')}`}>
                  <ClipboardCheck size={18} /> Attendance
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/40 rounded-full border border-white/50 text-xs font-medium text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Online
             </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu (simplified) */}
      <div className="md:hidden border-t border-white/20 bg-white/40 backdrop-blur-xl">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex justify-around">
           <Link to="/" className={`p-3 rounded-lg ${location.pathname === '/' ? 'text-violet-600 bg-white/60' : 'text-gray-500'}`}><LayoutDashboard size={20} /></Link>
           <Link to="/students" className={`p-3 rounded-lg ${location.pathname === '/students' ? 'text-violet-600 bg-white/60' : 'text-gray-500'}`}><Users size={20} /></Link>
           <Link to="/register" className={`p-3 rounded-lg ${location.pathname === '/register' ? 'text-violet-600 bg-white/60' : 'text-gray-500'}`}><UserPlus size={20} /></Link>
           <Link to="/attendance" className={`p-3 rounded-lg ${location.pathname === '/attendance' ? 'text-violet-600 bg-white/60' : 'text-gray-500'}`}><ClipboardCheck size={20} /></Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;