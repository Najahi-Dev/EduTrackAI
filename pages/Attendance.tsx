import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AttendanceRecord, AttendanceStatus } from '../types';
import { Calendar, Save, Search, Filter, Check, X, Clock, Info } from 'lucide-react';

const Attendance: React.FC = () => {
  const { students, attendance, markAttendance } = useApp();
  
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filterGrade, setFilterGrade] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentRecords, setCurrentRecords] = useState<Record<string, AttendanceStatus>>({});

  // Load existing attendance for the selected date
  useEffect(() => {
    const existingRecords: Record<string, AttendanceStatus> = {};
    students.forEach(student => {
      const found = attendance.find(a => a.studentId === student.id && a.date === selectedDate);
      existingRecords[student.id] = found ? found.status : AttendanceStatus.PRESENT;
    });
    setCurrentRecords(existingRecords);
  }, [selectedDate, students, attendance]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setCurrentRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = () => {
    const recordsToSave: AttendanceRecord[] = Object.keys(currentRecords).map(studentId => ({
      id: `${selectedDate}-${studentId}`,
      studentId,
      date: selectedDate,
      status: currentRecords[studentId]
    }));

    markAttendance(recordsToSave);
    // Simple feedback toast could be added here
    const btn = document.getElementById('save-btn');
    if(btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Saved!';
      setTimeout(() => btn.innerHTML = originalText, 2000);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesGrade = filterGrade === 'All' || s.grade === filterGrade;
    const matchesSearch = (s.firstName + ' ' + s.lastName).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const grades = ['All', ...Array.from(new Set(students.map(s => s.grade))).sort()];

  const getStatusIcon = (status: AttendanceStatus) => {
      switch(status) {
          case AttendanceStatus.PRESENT: return <Check size={14} />;
          case AttendanceStatus.ABSENT: return <X size={14} />;
          case AttendanceStatus.LATE: return <Clock size={14} />;
          case AttendanceStatus.EXCUSED: return <Info size={14} />;
      }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Attendance</h1>
          <p className="text-gray-600 mt-1 text-lg font-light">Manage daily records.</p>
        </div>
        <div className="glass px-4 py-2.5 rounded-xl flex items-center gap-3 text-gray-700 shadow-sm ring-1 ring-white/50">
          <Calendar size={20} className="text-violet-600" />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none font-semibold bg-transparent cursor-pointer text-gray-800"
          />
        </div>
      </header>

      <div className="glass-card overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-gray-200/50 flex flex-col lg:flex-row gap-4 justify-between items-center bg-white/40 backdrop-blur-md sticky top-0 z-20">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
             <div className="relative w-full sm:w-64 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-violet-500 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none text-sm font-medium"
              />
            </div>
            <div className="relative w-full sm:w-48">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                value={filterGrade}
                onChange={(e) => setFilterGrade(e.target.value)}
                className="glass-input w-full pl-10 pr-8 py-2.5 rounded-xl focus:outline-none text-sm font-medium appearance-none bg-white/50"
                >
                {grades.map(g => <option key={g} value={g}>{g === 'All' ? 'All Grades' : g}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
            </div>
          </div>
          <button
            id="save-btn"
            onClick={handleSave}
            className="flex items-center gap-2 bg-gray-900 text-white px-8 py-2.5 rounded-xl hover:bg-gray-800 active:bg-gray-950 transition-all shadow-lg shadow-gray-900/20 w-full lg:w-auto justify-center font-bold text-sm tracking-wide"
          >
            <Save size={18} /> Save Changes
          </button>
        </div>

        {/* List */}
        <div className="overflow-x-auto flex-grow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/30 border-b border-gray-200/50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-5 pl-8">Student Details</th>
                <th className="p-5 text-center">Class</th>
                <th className="p-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/50">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-16 text-center">
                     <div className="flex flex-col items-center justify-center text-gray-400">
                        <Search size={48} strokeWidth={1} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">No students found</p>
                        <p className="text-sm">Try adjusting your filters</p>
                     </div>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-white/40 transition duration-150 group">
                    <td className="p-4 pl-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-500 font-bold text-sm border border-white shadow-sm">
                                {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <div>
                                <div className="font-bold text-gray-800">{student.firstName} {student.lastName}</div>
                                <div className="text-xs text-gray-400 font-mono mt-0.5">{student.id}</div>
                            </div>
                        </div>
                    </td>
                    <td className="p-4 text-center">
                        <span className="inline-block bg-white/60 border border-gray-200/60 px-3 py-1 rounded-lg text-xs font-bold text-gray-600 shadow-sm">
                            {student.grade}
                        </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {[AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LATE, AttendanceStatus.EXCUSED].map((status) => {
                          const isActive = currentRecords[student.id] === status;
                          
                          let baseStyles = 'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-200 transform hover:scale-105 active:scale-95';
                          let activeStyles = 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600';
                          
                          if (isActive) {
                             if (status === AttendanceStatus.PRESENT) activeStyles = 'bg-green-500 border-green-600 text-white shadow-lg shadow-green-500/30';
                             if (status === AttendanceStatus.ABSENT) activeStyles = 'bg-red-500 border-red-600 text-white shadow-lg shadow-red-500/30';
                             if (status === AttendanceStatus.LATE) activeStyles = 'bg-amber-500 border-amber-600 text-white shadow-lg shadow-amber-500/30';
                             if (status === AttendanceStatus.EXCUSED) activeStyles = 'bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-500/30';
                          }

                          return (
                            <button
                              key={status}
                              onClick={() => handleStatusChange(student.id, status)}
                              className={`${baseStyles} ${activeStyles}`}
                            >
                              {isActive && getStatusIcon(status)}
                              {status}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;