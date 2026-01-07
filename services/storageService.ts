
export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  major: string;
  gpa: number;
  attendance: string;
  lastLogin?: string;
}

export interface ActivityLog {
  id: string;
  studentName: string;
  action: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  STUDENTS: 'lumina_students',
  LOGS: 'lumina_logs'
};

const DEFAULT_STUDENTS: StudentRecord[] = [
  {
    id: 'L001',
    name: 'Alex Rivera',
    email: 'student@lumina.edu',
    password: 'password123',
    major: 'Computer Science',
    gpa: 3.92,
    attendance: '94%'
  }
];

export const storageService = {
  getStudents: (): StudentRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : DEFAULT_STUDENTS;
  },

  saveStudent: (student: StudentRecord) => {
    const students = storageService.getStudents();
    const existingIndex = students.findIndex(s => s.email === student.email);
    if (existingIndex > -1) {
      students[existingIndex] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    storageService.addLog(student.name, "Account created/updated by Admin");
  },

  deleteStudent: (id: string) => {
    const students = storageService.getStudents().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getLogs: (): ActivityLog[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  },

  addLog: (studentName: string, action: string) => {
    const logs = storageService.getLogs();
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      studentName,
      action,
      timestamp: new Date().toLocaleString()
    };
    logs.unshift(newLog); // Newest first
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 100))); // Keep last 100
  }
};
