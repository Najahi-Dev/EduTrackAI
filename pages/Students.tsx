import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, Calendar, Hash } from 'lucide-react';

const Students: React.FC = () => {
  const { students, getStudentAttendance } = useApp();

  return (
    <div className="space-y-8">
       <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Student Directory</h1>
        <p className="text-gray-600 mt-1 text-lg font-light">Manage and view all registered students.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map(student => {
          const records = getStudentAttendance(student.id);
          const total = records.length;
          const present = records.filter(r => r.status === 'Present').length;
          const rate = total > 0 ? Math.round((present / total) * 100) : 0;

          let rateColor = 'bg-gray-100 text-gray-600';
          let ringColor = 'ring-gray-200';
          if (rate >= 90) { rateColor = 'bg-green-100 text-green-700'; ringColor = 'ring-green-200'; }
          else if (rate >= 75) { rateColor = 'bg-yellow-100 text-yellow-700'; ringColor = 'ring-yellow-200'; }
          else { rateColor = 'bg-red-100 text-red-700'; ringColor = 'ring-red-200'; }

          return (
            <div key={student.id} className="glass-card p-6 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 group relative overflow-hidden">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform duration-300">
                        {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 leading-tight">{student.firstName} {student.lastName}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/60 text-gray-600 border border-white/50 mt-1">
                           Grade {student.grade}
                        </span>
                    </div>
                </div>
                <div className={`flex flex-col items-end ${rateColor} px-3 py-1 rounded-lg ring-1 ${ringColor}`}>
                   <span className="text-xs font-bold uppercase tracking-wider opacity-70">Attendance</span>
                   <span className="text-lg font-bold">{rate}%</span>
                </div>
              </div>
              
              {/* Body */}
              <div className="space-y-3 text-sm text-gray-600 mb-6 relative z-10 bg-white/30 rounded-xl p-4 border border-white/40">
                <div className="flex items-center gap-3 transition group/item">
                  <div className="p-1.5 bg-white rounded-lg text-violet-500 shadow-sm"><Mail size={14} /></div>
                  <span className="truncate font-medium text-gray-700">{student.email}</span>
                </div>
                <div className="flex items-center gap-3 transition group/item">
                  <div className="p-1.5 bg-white rounded-lg text-violet-500 shadow-sm"><Phone size={14} /></div>
                  <span className="font-medium text-gray-700">{student.parentContact}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100/50 flex justify-between text-xs text-gray-400 font-medium relative z-10">
                <div className="flex items-center gap-1.5">
                    <Hash size={12} />
                    <span>ID: <span className="font-mono text-gray-500">{student.id}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>{student.registrationDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Students;