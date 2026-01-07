
import { StudentRecord, ActivityLog } from '../services/storageService';

const DB_KEYS = {
  STUDENTS: 'lumina_db_students',
  LOGS: 'lumina_db_logs',
  SESSION: 'lumina_db_session'
};

class Database {
  private static instance: Database;
  
  private constructor() {
    this.init();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private init() {
    if (!localStorage.getItem(DB_KEYS.STUDENTS)) {
      const defaultStudent: StudentRecord = {
        id: 'L001',
        name: 'Alex Rivera',
        email: 'student@lumina.edu',
        password: 'password123',
        major: 'Computer Science',
        gpa: 3.92,
        attendance: '94%'
      };
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify([defaultStudent]));
    }
    if (!localStorage.getItem(DB_KEYS.LOGS)) {
      localStorage.setItem(DB_KEYS.LOGS, JSON.stringify([]));
    }
  }

  // --- Student Methods ---
  async getStudents(): Promise<StudentRecord[]> {
    const data = localStorage.getItem(DB_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  }

  async saveStudent(student: StudentRecord): Promise<void> {
    const students = await this.getStudents();
    const index = students.findIndex(s => s.id === student.id || s.email === student.email);
    if (index > -1) {
      students[index] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
  }

  async deleteStudent(id: string): Promise<void> {
    const students = await this.getStudents();
    const filtered = students.filter(s => s.id !== id);
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(filtered));
  }

  // --- Log Methods ---
  async getLogs(): Promise<ActivityLog[]> {
    const data = localStorage.getItem(DB_KEYS.LOGS);
    return data ? JSON.parse(data) : [];
  }

  async addLog(studentName: string, action: string): Promise<void> {
    const logs = await this.getLogs();
    const newLog: ActivityLog = {
      id: `log_${Date.now()}`,
      studentName,
      action,
      timestamp: new Date().toLocaleString()
    };
    logs.unshift(newLog);
    localStorage.setItem(DB_KEYS.LOGS, JSON.stringify(logs.slice(0, 50)));
  }
}

export const db = Database.getInstance();
