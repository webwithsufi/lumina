
import { db } from './database';
import { StudentRecord, ActivityLog } from '../services/storageService';

// Simulated latency to make it feel like a real backend
const LATENCY = 800;

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
      // In real life we would validate the token here
      return db.getStudents();
    },
    create: async (token: string, student: StudentRecord): Promise<void> => {
      await delay(LATENCY);
      await db.saveStudent(student);
      await db.addLog(student.name, "Account provisioned by Admin");
    },
    remove: async (token: string, id: string): Promise<void> => {
      await delay(LATENCY);
      await db.deleteStudent(id);
    }
  },

  system: {
    getLogs: async (token: string): Promise<ActivityLog[]> => {
      await delay(LATENCY);
      return db.getLogs();
    }
  }
};
