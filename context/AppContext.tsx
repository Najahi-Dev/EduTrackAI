import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Student, AttendanceRecord, AppState, AttendanceStatus } from '../types';

// Mock Data
const MOCK_STUDENTS: Student[] = [
  { id: '1', firstName: 'Alice', lastName: 'Johnson', grade: '10A', email: 'alice@example.com', parentContact: '555-0101', registrationDate: '2023-09-01' },
  { id: '2', firstName: 'Bob', lastName: 'Smith', grade: '10A', email: 'bob@example.com', parentContact: '555-0102', registrationDate: '2023-09-01' },
  { id: '3', firstName: 'Charlie', lastName: 'Brown', grade: '10B', email: 'charlie@example.com', parentContact: '555-0103', registrationDate: '2023-09-02' },
  { id: '4', firstName: 'Diana', lastName: 'Prince', grade: '11A', email: 'diana@example.com', parentContact: '555-0104', registrationDate: '2023-09-03' },
  { id: '5', firstName: 'Evan', lastName: 'Wright', grade: '11A', email: 'evan@example.com', parentContact: '555-0105', registrationDate: '2023-09-04' },
];

const MOCK_ATTENDANCE: AttendanceRecord[] = [
  { id: 'a1', studentId: '1', date: '2023-10-01', status: AttendanceStatus.PRESENT },
  { id: 'a2', studentId: '2', date: '2023-10-01', status: AttendanceStatus.ABSENT },
  { id: 'a3', studentId: '3', date: '2023-10-01', status: AttendanceStatus.PRESENT },
  { id: 'a4', studentId: '1', date: '2023-10-02', status: AttendanceStatus.PRESENT },
  { id: 'a5', studentId: '2', date: '2023-10-02', status: AttendanceStatus.LATE },
];

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(MOCK_ATTENDANCE);

  const addStudent = (student: Student) => {
    setStudents(prev => [...prev, student]);
  };

  const markAttendance = (newRecords: AttendanceRecord[]) => {
    setAttendance(prev => {
      // Remove existing records for the same student and date to avoid duplicates
      const filtered = prev.filter(p => !newRecords.some(n => n.studentId === p.studentId && n.date === p.date));
      return [...filtered, ...newRecords];
    });
  };

  const getStudentAttendance = (studentId: string) => {
    return attendance.filter(a => a.studentId === studentId);
  };

  return (
    <AppContext.Provider value={{ students, attendance, addStudent, markAttendance, getStudentAttendance }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
