
export interface CourseRecord {
  id: string;
  name: string;
  instructor: string;
  progress: number;
  grade: string;
  status: 'active' | 'completed' | 'upcoming';
}

export interface TeacherRecord {
  id: string;
  name: string;
  email: string;
  department: string;
  specialization: string;
  officeHours: string;
  status: 'active' | 'on-leave';
}

export interface TaskRecord {
  id: string;
  title: string;
  description: string;
  assignedTo: string; // Teacher ID
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface StudentRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  major: string;
  gpa: number;
  attendance: string;
  lastLogin?: string;
  courses?: CourseRecord[];
}

export interface ActivityLog {
  id: string;
  studentName: string;
  action: string;
  timestamp: string;
}

const STORAGE_KEYS = {
  STUDENTS: 'lumina_students',
  TEACHERS: 'lumina_teachers',
  TASKS: 'lumina_tasks',
  LOGS: 'lumina_logs'
};

const DEFAULT_COURSES: CourseRecord[] = [
  { id: 'CS301', name: 'Neural Networks & Deep Learning', instructor: 'Dr. Sarah Chen', progress: 65, grade: 'A', status: 'active' },
  { id: 'CS202', name: 'Distributed Systems', instructor: 'Prof. Marcus Thorne', progress: 40, grade: 'B+', status: 'active' },
  { id: 'AI105', name: 'Ethics in AI', instructor: 'Dr. Anya Petrov', progress: 100, grade: 'A+', status: 'completed' },
  { id: 'MA401', name: 'Quantum Computing Fundamentals', instructor: 'Dr. Michael Bloom', progress: 0, grade: '-', status: 'upcoming' }
];

const DEFAULT_STUDENTS: StudentRecord[] = [
  {
    id: 'L001',
    name: 'Alex Rivera',
    email: 'student@lumina.edu',
    password: 'password123',
    major: 'Computer Science',
    gpa: 3.92,
    attendance: '94%',
    courses: DEFAULT_COURSES
  }
];

const DEFAULT_TEACHERS: TeacherRecord[] = [
  { id: 'F001', name: 'Dr. Sarah Chen', email: 's.chen@lumina.edu', department: 'Computer Science', specialization: 'Neural Networks', officeHours: 'Mon/Wed 2-4 PM', status: 'active' },
  { id: 'F002', name: 'Prof. Marcus Thorne', email: 'm.thorne@lumina.edu', department: 'Computer Science', specialization: 'Distributed Systems', officeHours: 'Tue/Thu 10-12 AM', status: 'active' },
  { id: 'F003', name: 'Dr. Anya Petrov', email: 'a.petrov@lumina.edu', department: 'AI Ethics', specialization: 'Algorithmic Bias', officeHours: 'Friday 1-3 PM', status: 'active' }
];

const DEFAULT_TASKS: TaskRecord[] = [
  { id: 'T001', title: 'Grade Midterm Papers', description: 'Evaluate CS301 midterms', assignedTo: 'F001', deadline: '2025-10-15', priority: 'high', status: 'in-progress' },
  { id: 'T002', title: 'Update Syllabus', description: 'Review curriculum for Spring 2026', assignedTo: 'F002', deadline: '2025-11-01', priority: 'medium', status: 'pending' }
];

export const storageService = {
  getStudents: (): StudentRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : DEFAULT_STUDENTS;
  },
  
  getTeachers: (): TeacherRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TEACHERS);
    return data ? JSON.parse(data) : DEFAULT_TEACHERS;
  },

  getTasks: (): TaskRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : DEFAULT_TASKS;
  },

  saveTeacher: (teacher: TeacherRecord) => {
    const teachers = storageService.getTeachers();
    const existingIndex = teachers.findIndex(t => t.id === teacher.id);
    if (existingIndex > -1) {
      teachers[existingIndex] = { ...teachers[existingIndex], ...teacher };
    } else {
      teachers.push(teacher);
    }
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  },

  saveTask: (task: TaskRecord) => {
    const tasks = storageService.getTasks();
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    if (existingIndex > -1) {
      tasks[existingIndex] = { ...tasks[existingIndex], ...task };
    } else {
      tasks.push(task);
    }
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  saveStudent: (student: StudentRecord) => {
    const students = storageService.getStudents();
    const existingIndex = students.findIndex(s => s.id === student.id);
    if (existingIndex > -1) {
      students[existingIndex] = { ...students[existingIndex], ...student };
    } else {
      students.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    storageService.addLog(student.name, "Account updated");
  },

  deleteStudent: (id: string) => {
    const students = storageService.getStudents().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  deleteTeacher: (id: string) => {
    const teachers = storageService.getTeachers().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
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
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs.slice(0, 100)));
  }
};
