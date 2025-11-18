import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Student } from '../types';
import { CheckCircle, UserPlus, Sparkles } from 'lucide-react';

const Registration: React.FC = () => {
  const { addStudent } = useApp();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    grade: '',
    email: '',
    parentContact: ''
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      registrationDate: new Date().toISOString().split('T')[0]
    };

    addStudent(newStudent);
    setSuccess(true);
    
    setTimeout(() => {
      setSuccess(false);
      setFormData({ firstName: '', lastName: '', grade: '', email: '', parentContact: '' });
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="glass-card overflow-hidden shadow-2xl shadow-violet-500/10">
        <div className="relative h-32 bg-gradient-to-r from-violet-600 to-blue-600 overflow-hidden">
          {/* Abstract Shapes */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

          <div className="absolute bottom-0 left-0 w-full p-6 flex items-end">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 text-white shadow-lg">
                 <UserPlus size={28} />
              </div>
              <div className="mb-1">
                 <h2 className="text-2xl font-bold text-white tracking-tight">New Student</h2>
                 <p className="text-blue-100 text-sm font-medium opacity-90">Enter details to register</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {success && (
            <div className="mb-8 bg-green-50/90 border border-green-200 text-green-800 px-4 py-4 rounded-xl flex items-center gap-3 shadow-lg shadow-green-500/10 animate-fade-in">
              <div className="bg-green-100 p-1.5 rounded-full">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-bold text-sm">Success!</p>
                <p className="text-xs text-green-700">Student has been added to the system.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
                  placeholder="e.g. John"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
                  placeholder="e.g. Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Grade Level</label>
              <div className="relative">
                <select
                  name="grade"
                  required
                  value={formData.grade}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none text-gray-800 appearance-none font-medium bg-white/50"
                >
                  <option value="">Select Grade</option>
                  <option value="9A">Grade 9A</option>
                  <option value="9B">Grade 9B</option>
                  <option value="10A">Grade 10A</option>
                  <option value="10B">Grade 10B</option>
                  <option value="11A">Grade 11A</option>
                  <option value="12A">Grade 12A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
                  placeholder="student@school.edu"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Parent Contact</label>
                <input
                  type="tel"
                  name="parentContact"
                  required
                  value={formData.parentContact}
                  onChange={handleChange}
                  className="glass-input w-full px-4 py-3 rounded-xl focus:outline-none text-gray-800 placeholder-gray-400 font-medium"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} /> Register Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;