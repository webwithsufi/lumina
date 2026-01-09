
import { db } from './database';
import { StudentRecord, ActivityLog, TeacherRecord, TaskRecord } from '../services/storageService';

const LATENCY = 600;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (email: string, pass: string): Promise<{ success: boolean; student?: StudentRecord; token?: string; error?: string }> => {
      await delay(LATENCY);
      const students = await db.getStudents();
      const student = students.find(s => s.email === email && s.password === pass);
      
      if (student) {
        const token = btoa(`${student.id}:${Date.now()}`);
        await db.addLog(student.name, "Secure login initiated");
        return { success: true, student, token };
      }
      return { success: false, error: "Invalid credentials" };
    },
    
    adminLogin: async (user: string, pass: string): Promise<{ success: boolean; token?: string }> => {
      await delay(LATENCY);
      if (user === 'admin' && pass === 'admin123') {
        return { success: true, token: 'admin_master_token_' + Date.now() };
      }
      return { success: false };
    }
  },

  students: {
    getAll: async (token: string): Promise<StudentRecord[]> => {
      await delay(LATENCY);
      return db.getStudents();
    },
    save: async (token: string, student: StudentRecord): Promise<void> => {
      await delay(LATENCY);
      await db.saveStudent(student);
      await db.addLog("SYSTEM", `Student record saved: ${student.name}`);
    },
    remove: async (token: string, id: string): Promise<void> => {
      await delay(LATENCY);
      await db.deleteStudent(id);
      await db.addLog("SYSTEM", `Student record removed: ${id}`);
    }
  },

  faculty: {
    getAll: async (token: string): Promise<TeacherRecord[]> => {
      await delay(LATENCY);
      return db.getTeachers();
    },
    save: async (token: string, teacher: TeacherRecord): Promise<void> => {
      await delay(LATENCY);
      await db.saveTeacher(teacher);
      await db.addLog("SYSTEM", `Faculty record saved: ${teacher.name}`);
    },
    remove: async (token: string, id: string): Promise<void> => {
      await delay(LATENCY);
      await db.deleteTeacher(id);
      await db.addLog("SYSTEM", `Faculty record removed: ${id}`);
    }
  },

  tasks: {
    getAll: async (token: string): Promise<TaskRecord[]> => {
      await delay(LATENCY);
      return db.getTasks();
    },
    save: async (token: string, task: TaskRecord): Promise<void> => {
      await delay(LATENCY);
      await db.saveTask(task);
      await db.addLog("SYSTEM", `Task status updated: ${task.title}`);
    }
  },

  system: {
    getLogs: async (token: string): Promise<ActivityLog[]> => {
      await delay(LATENCY);
      return db.getLogs();
    },
    getStats: async (token: string) => {
      await delay(400);
      return {
        uptime: '154h 45m',
        cpu: Math.floor(Math.random() * 15) + 12 + '%',
        memory: '3.1GB / 8GB',
        activeConnections: Math.floor(Math.random() * 40) + 85,
        dbStatus: 'Operational'
      };
    }
  }
};
