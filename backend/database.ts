
import { StudentRecord, ActivityLog, CourseRecord, TeacherRecord, TaskRecord, storageService } from '../services/storageService';

const DB_KEYS = {
  STUDENTS: 'lumina_db_students',
  TEACHERS: 'lumina_db_teachers',
  TASKS: 'lumina_db_tasks',
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
      localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(storageService.getStudents()));
    }
    if (!localStorage.getItem(DB_KEYS.TEACHERS)) {
      localStorage.setItem(DB_KEYS.TEACHERS, JSON.stringify(storageService.getTeachers()));
    }
    if (!localStorage.getItem(DB_KEYS.TASKS)) {
      localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(storageService.getTasks()));
    }
    if (!localStorage.getItem(DB_KEYS.LOGS)) {
      localStorage.setItem(DB_KEYS.LOGS, JSON.stringify([]));
    }
  }

  async getStudents(): Promise<StudentRecord[]> {
    const data = localStorage.getItem(DB_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  }

  async getTeachers(): Promise<TeacherRecord[]> {
    const data = localStorage.getItem(DB_KEYS.TEACHERS);
    return data ? JSON.parse(data) : [];
  }

  async getTasks(): Promise<TaskRecord[]> {
    const data = localStorage.getItem(DB_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  }

  async saveStudent(student: StudentRecord): Promise<void> {
    const students = await this.getStudents();
    const index = students.findIndex(s => s.id === student.id);
    if (index > -1) {
      students[index] = { ...students[index], ...student };
    } else {
      students.push(student);
    }
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(students));
  }

  async saveTeacher(teacher: TeacherRecord): Promise<void> {
    const teachers = await this.getTeachers();
    const index = teachers.findIndex(t => t.id === teacher.id);
    if (index > -1) {
      teachers[index] = { ...teachers[index], ...teacher };
    } else {
      teachers.push(teacher);
    }
    localStorage.setItem(DB_KEYS.TEACHERS, JSON.stringify(teachers));
  }

  async saveTask(task: TaskRecord): Promise<void> {
    const tasks = await this.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index > -1) {
      tasks[index] = { ...tasks[index], ...task };
    } else {
      tasks.push(task);
    }
    localStorage.setItem(DB_KEYS.TASKS, JSON.stringify(tasks));
  }

  async deleteStudent(id: string): Promise<void> {
    const students = await this.getStudents();
    const filtered = students.filter(s => s.id !== id);
    localStorage.setItem(DB_KEYS.STUDENTS, JSON.stringify(filtered));
  }

  async deleteTeacher(id: string): Promise<void> {
    const teachers = await this.getTeachers();
    const filtered = teachers.filter(t => t.id !== id);
    localStorage.setItem(DB_KEYS.TEACHERS, JSON.stringify(filtered));
  }

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
