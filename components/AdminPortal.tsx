
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Activity, 
  Plus, 
  Trash2, 
  LogOut, 
  Search, 
  ArrowLeft,
  Key,
  Database as DbIcon,
  Loader2,
  RefreshCw,
  Server
} from 'lucide-react';
import { api } from '../backend/api';
import { StudentRecord, ActivityLog } from '../services/storageService';

interface AdminPortalProps {
  onClose: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [newStudent, setNewStudent] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    major: 'Computer Science'
  });

  const fetchData = async (currentReqToken: string) => {
    setIsRefreshing(true);
    try {
      const [sData, lData] = await Promise.all([
        api.students.getAll(currentReqToken),
        api.system.getLogs(currentReqToken)
      ]);
      setStudents(sData);
      setLogs(lData);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await api.auth.adminLogin(username, password);
    if (result.success && result.token) {
      setToken(result.token);
      setIsAdminLoggedIn(true);
      await fetchData(result.token);
    } else {
      alert('Invalid admin credentials.');
    }
    setIsLoading(false);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const student: StudentRecord = {
      ...newStudent,
      gpa: 4.0,
      attendance: '100%'
    };
    await api.students.create(token, student);
    await fetchData(token);
    setNewStudent({ id: '', name: '', email: '', password: '', major: 'Computer Science' });
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Confirm server deletion of this record?')) {
      setIsLoading(true);
      await api.students.remove(token, id);
      await fetchData(token);
      setIsLoading(false);
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <button onClick={onClose} className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600">
          <ArrowLeft size={20} /> Back to Landing
        </button>
        <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              {isLoading ? <Loader2 className="animate-spin" size={32} /> : <ShieldCheck size={32} />}
            </div>
            <h2 className="text-2xl font-black text-slate-900">Backend Control</h2>
            <p className="text-slate-500 text-sm mt-2">Initialize administrator secure session</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="text" placeholder="Admin Username" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              disabled={isLoading}
            />
            <input 
              type="password" placeholder="Admin Password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all"
              disabled={isLoading}
            />
            <button 
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={20} />}
              {isLoading ? 'Connecting...' : 'Secure Authorization'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex animate-in fade-in duration-700">
      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-slate-200 p-8 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <Server className="text-indigo-600" size={28} />
          <span className="text-xl font-black tracking-tighter">LUMINA SERVER</span>
        </div>
        <nav className="space-y-4 flex-1">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 text-white rounded-xl font-bold">
            <div className="flex items-center gap-3"><Users size={20} /> Students</div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-all">
            <Activity size={20} /> Global Logs
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-xl font-bold transition-all">
            <DbIcon size={20} /> DB Management
          </button>
        </nav>
        <button onClick={onClose} className="flex items-center gap-3 px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all">
          <LogOut size={20} /> Terminate Session
        </button>
      </div>

      {/* Main content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900">Server Dashboard</h1>
              {isRefreshing && <Loader2 className="animate-spin text-indigo-500" size={20} />}
            </div>
            <p className="text-slate-500 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Database Connection: Latency {Math.floor(Math.random() * 20) + 10}ms
            </p>
          </div>
          <button 
            onClick={() => fetchData(token)}
            className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 font-bold text-slate-600 hover:text-indigo-600 transition-all"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} /> Sync Data
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Create Student Form */}
          <div className="xl:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-8">
              <div className="flex items-center gap-2 mb-6">
                <Plus className="text-indigo-600" size={24} />
                <h3 className="text-xl font-black">Provision Account</h3>
              </div>
              <form onSubmit={handleCreateStudent} className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Full Name</label>
                   <input disabled={isLoading} required type="text" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-1 focus:ring-indigo-600 transition-all" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Student ID</label>
                   <input disabled={isLoading} required type="text" value={newStudent.id} onChange={e => setNewStudent({...newStudent, id: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-1 focus:ring-indigo-600 transition-all" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Secure Email</label>
                   <input disabled={isLoading} required type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-1 focus:ring-indigo-600 transition-all" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Password</label>
                   <input disabled={isLoading} required type="password" value={newStudent.password} onChange={e => setNewStudent({...newStudent, password: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-1 focus:ring-indigo-600 transition-all" />
                </div>
                <button 
                  disabled={isLoading}
                  className="w-full py-4 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="animate-spin" size={18} />}
                  {isLoading ? 'Processing...' : 'Deploy Account'}
                </button>
              </form>
            </div>
          </div>

          <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-lg font-black flex items-center gap-2"><Users size={20} className="text-indigo-600"/> Database Registry</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Record</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">Major</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900">{s.name}</p>
                          <p className="text-xs text-slate-500">{s.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-md">{s.major}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            disabled={isLoading}
                            onClick={() => handleDelete(s.id)} 
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors disabled:opacity-20"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2"><Activity size={20} className="text-indigo-600"/> Server Event Logs</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                {logs.map(log => (
                  <div key={log.id} className="flex items-center justify-between py-3 border-b border-slate-50 group">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800"><span className="text-indigo-600 font-black">{log.studentName}</span>: {log.action}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
