import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Users, UserCheck, UserX, Sparkles, AlertTriangle, ArrowRight, BarChart3 } from 'lucide-react';
import { generateAttendanceInsight, identifyAtRiskStudents } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const { students, attendance } = useApp();
  const [insight, setInsight] = useState<string>("");
  const [atRisk, setAtRisk] = useState<{studentId: string, reason: string}[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);

  // Statistics
  const totalStudents = students.length;
  const uniqueDates = Array.from(new Set(attendance.map(a => a.date)));
  const totalAttendanceRecords = attendance.length;
  
  const presentCount = attendance.filter(a => a.status === 'Present').length;
  const absentCount = attendance.filter(a => a.status === 'Absent').length;
  const lateCount = attendance.filter(a => a.status === 'Late').length;
  const excusedCount = attendance.filter(a => a.status === 'Excused').length;

  const attendanceRate = totalAttendanceRecords > 0 
    ? Math.round((presentCount / totalAttendanceRecords) * 100) 
    : 0;

  // Data for Pie Chart
  const pieData = [
    { name: 'Present', value: presentCount, color: '#4ade80' },
    { name: 'Absent', value: absentCount, color: '#f87171' },
    { name: 'Late', value: lateCount, color: '#fbbf24' },
    { name: 'Excused', value: excusedCount, color: '#60a5fa' },
  ].filter(d => d.value > 0);

  // Data for Bar Chart (Last 5 Dates)
  const last5Dates = uniqueDates.sort().slice(-5);
  const barData = last5Dates.map(date => {
    const records = attendance.filter(a => a.date === date);
    return {
      date,
      Present: records.filter(r => r.status === 'Present').length,
      Absent: records.filter(r => r.status === 'Absent').length,
      Late: records.filter(r => r.status === 'Late').length,
    };
  });

  const handleGenerateInsights = async () => {
    setLoadingAi(true);
    try {
      const [summary, riskList] = await Promise.all([
        generateAttendanceInsight(students, attendance),
        identifyAtRiskStudents(students, attendance)
      ]);
      setInsight(summary);
      setAtRisk(riskList);
    } catch (error) {
      console.error("AI Error", error);
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Dashboard</h1>
          <p className="text-gray-600 text-lg font-light">Welcome back, Administrator.</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 glass-card rounded-full flex items-center gap-2 text-sm font-medium text-violet-700">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
          </span>
          Live Data
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-violet-500/10">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 mr-5 shadow-inner">
            <Users size={28} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Total Students</p>
            <p className="text-3xl font-bold text-gray-800">{totalStudents}</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-green-500/10">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 text-green-600 mr-5 shadow-inner">
            <UserCheck size={28} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Attendance Rate</p>
            <p className="text-3xl font-bold text-gray-800">{attendanceRate}%</p>
          </div>
        </div>

        <div className="glass-card p-6 flex items-center transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-red-500/10">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-red-100 to-red-50 text-red-500 mr-5 shadow-inner">
            <UserX size={28} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">Total Absences</p>
            <p className="text-3xl font-bold text-gray-800">{absentCount}</p>
          </div>
        </div>
        
        <div 
          className="glass-card p-6 flex items-center relative overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-violet-500/20 border-violet-200/50 group" 
          onClick={handleGenerateInsights}
        >
           <div className="absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br from-violet-400 to-fuchsia-400 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity"></div>
           
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-50 text-violet-600 mr-5 shadow-inner relative z-10">
            <Sparkles size={28} strokeWidth={1.5} className={loadingAi ? "animate-pulse" : ""} />
          </div>
          <div className="relative z-10 flex-1">
             {loadingAi ? (
                <div className="flex flex-col justify-center h-full">
                  <span className="text-xs font-bold text-violet-500 uppercase tracking-wide mb-1">Analyzing</span>
                  <div className="loader-dots">
                    <div></div><div></div><div></div>
                  </div>
                </div>
             ) : (
               <>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">AI Insights</p>
                <div className="flex items-center gap-1 text-violet-700 font-bold group-hover:translate-x-1 transition-transform">
                  Generate <ArrowRight size={16} />
                </div>
               </>
             )}
          </div>
        </div>
      </div>

      {/* AI Section */}
      {(insight || atRisk.length > 0) && (
        <div className="glass-card p-8 relative overflow-hidden border-violet-200/60 shadow-lg shadow-violet-500/5 ring-1 ring-violet-100">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500"></div>
          
          <div className="flex items-center mb-6 gap-3 relative z-10">
            <div className="bg-violet-50 p-2 rounded-lg border border-violet-100">
               <Sparkles className="text-violet-600" size={20} />
            </div>
            <h2 className="text-xl font-bold shimmer">Gemini AI Analysis Report</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            <div className="md:col-span-2">
               <div className="prose prose-sm md:prose-base prose-violet text-gray-600 whitespace-pre-line leading-relaxed">
                 {insight}
               </div>
            </div>
            <div className="glass bg-white/30 rounded-xl p-5 border border-white/60 shadow-sm">
              <h3 className="text-xs font-bold text-red-500 mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-red-100 pb-2">
                <AlertTriangle size={14} /> Attention Required
              </h3>
              <ul className="space-y-3">
                {atRisk.length === 0 ? (
                  <li className="text-sm text-gray-500 italic flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-400"></div>
                     No high-risk students.
                  </li>
                ) : (
                  atRisk.map(r => {
                    const student = students.find(s => s.id === r.studentId);
                    return (
                      <li key={r.studentId} className="group hover:bg-white/50 p-2 rounded-lg transition-colors">
                        <div className="flex justify-between items-start">
                           <span className="font-bold text-gray-800 text-sm">{student?.firstName} {student?.lastName}</span>
                           <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1 rounded">{student?.grade}</span>
                        </div>
                        <p className="text-red-500/80 text-xs mt-1 leading-tight">{r.reason}</p>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600"><BarChart3 size={18} /></div>
            Attendance Distribution
          </h3>
          <div className="flex-grow min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} style={{filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'}} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
                     backdropFilter: 'blur(8px)',
                     borderRadius: '12px', 
                     border: '1px solid rgba(255,255,255,0.5)', 
                     boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' 
                  }}
                  itemStyle={{ color: '#374151', fontWeight: 600 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col">
          <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center gap-2">
             <div className="p-1.5 bg-violet-100 rounded-lg text-violet-600"><BarChart3 size={18} /></div>
            5-Day History
          </h3>
          <div className="flex-grow min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 11, fill: '#6b7280', fontWeight: 500}} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10} 
                  tickFormatter={(value) => {
                     const d = new Date(value);
                     return `${d.getMonth()+1}/${d.getDate()}`;
                  }}
                />
                <YAxis tick={{fontSize: 11, fill: '#6b7280'}} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip 
                  cursor={{fill: 'rgba(139, 92, 246, 0.05)', radius: 4}}
                  contentStyle={{ 
                     backgroundColor: 'rgba(255, 255, 255, 0.9)',
                     backdropFilter: 'blur(8px)',
                     borderRadius: '12px', 
                     border: '1px solid rgba(255,255,255,0.5)', 
                     boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' 
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                <Bar dataKey="Present" stackId="a" fill="#4ade80" radius={[0, 0, 4, 4]} animationDuration={1000} />
                <Bar dataKey="Late" stackId="a" fill="#fbbf24" animationDuration={1000} />
                <Bar dataKey="Absent" stackId="a" fill="#f87171" radius={[4, 4, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;