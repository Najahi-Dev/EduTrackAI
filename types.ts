export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  EXCUSED = 'Excused'
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  email: string;
  parentContact: string;
  registrationDate: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
}

export interface AppState {
  students: Student[];
  attendance: AttendanceRecord[];
  addStudent: (student: Student) => void;
  markAttendance: (records: AttendanceRecord[]) => void;
  getStudentAttendance: (studentId: string) => AttendanceRecord[];
}
