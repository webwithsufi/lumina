
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  LogOut, 
  Search, 
  ArrowLeft,
  Key,
  Loader2,
  RefreshCw,
  Server,
  LayoutDashboard,
  Globe,
  Edit2,
  CheckCircle2,
  UserCog,
  ClipboardList,
  CalendarDays,
  Clock,
  Briefcase,
  X,
  Menu,
  Lock,
  BookOpen
} from 'lucide-react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../backend/api';
import { StudentRecord, ActivityLog, TeacherRecord, TaskRecord } from '../services/storageService';

const systemActivity = [
  { name: '00:00', requests: 400 },
  { name: '04:00', requests: 120 },
  { name: '08:00', requests: 1100 },
  { name: '12:00', requests: 2400 },
  { name: '16:00', requests: 1800 },
  { name: '20:00', requests: 900 },
  { name: '23:59', requests: 500 },
];

interface AdminPortalProps {
  onClose: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onClose }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [activeTab, setActiveTab] = useState('Overview');
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [systemStats, setSystemStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modals
  const [editEntity, setEditEntity] = useState<any>(null);
  const [showForm, setShowForm] = useState<'student' | 'teacher' | 'task' | null>(null);

  const fetchData = async (currentReqToken: string) => {
    setIsRefreshing(true);
    try {
      const [sData, tData, taskData, lData, stData] = await Promise.all([
        api.students.getAll(currentReqToken),
        api.faculty.getAll(currentReqToken),
        api.tasks.getAll(currentReqToken),
        api.system.getLogs(currentReqToken),
        api.system.getStats(currentReqToken)
      ]);
      setStudents(sData);
      setTeachers(tData);
      setTasks(taskData);
      setLogs(lData);
      setSystemStats(stData);
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
      alert('Invalid administrative credentials.');
    }
    setIsLoading(false);
  };

  const handleAction = async (action: () => Promise<any>) => {
    setIsLoading(true);
    try {
      await action();
      await fetchData(token);
      setEditEntity(null);
      setShowForm(null);
    } catch (e) {
      alert('Action failed. System kernel reported an error.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveStudent = (s: StudentRecord) => handleAction(() => api.students.save(token, s));
  const deleteStudent = (id: string) => {
    if (confirm('Permanently delete student node?')) handleAction(() => api.students.remove(token, id));
  };

  const saveTeacher = (t: TeacherRecord) => handleAction(() => api.faculty.save(token, t));
  const deleteTeacher = (id: string) => {
    if (confirm('Permanently delete faculty record?')) handleAction(() => api.faculty.remove(token, id));
  };

  const saveTask = (task: TaskRecord) => handleAction(() => api.tasks.save(token, task));

  const filteredStudents = useMemo(() => students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.id.toLowerCase().includes(searchQuery.toLowerCase())
  ), [students, searchQuery]);

  const filteredTeachers = useMemo(() => teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase())
  ), [teachers, searchQuery]);

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-6 font-sans">
        <button onClick={onClose} className="absolute top-8 left-8 text-slate-500 font-black uppercase text-xs hover:text-white transition-colors">
          <ArrowLeft size={16} className="inline mr-2" /> Gateway Home
        </button>
        <div className="w-full max-w-md bg-[#0f172a] p-10 rounded-[2.5rem] border border-slate-800 animate-in fade-in slide-in-from-bottom-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <ShieldCheck size={36} className="text-white" />
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter text-center">Root Terminal</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 text-center">Authorization Level Required</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-600 ml-1">Admin UID</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-600 ml-1">Private Cipher</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-indigo-500 outline-none" />
            </div>
            <button className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all uppercase text-sm tracking-widest flex items-center justify-center gap-2">
              {isLoading && <Loader2 className="animate-spin" size={20} />}
              Establish Connection
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navLinks = [
    { id: 'Overview', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
    { id: 'Students', label: 'Students', icon: <Users size={20}/> },
    { id: 'Faculty', label: 'Faculty', icon: <UserCog size={20}/> },
    { id: 'Tasks', label: 'Directives', icon: <ClipboardList size={20}/> },
    { id: 'Schedules', label: 'Matrix', icon: <CalendarDays size={20}/> },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col lg:flex-row font-sans relative overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-80 bg-[#020617] border-r border-slate-900 hidden lg:flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg"><Server className="text-white" size={24} /></div>
          <div><span className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Root</span><p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest opacity-80 leading-none mt-1">Lumina Hub</p></div>
        </div>
        <nav className="flex-1 px-6 space-y-2 mt-4">
          {navLinks.map(link => (
            <SidebarBtn key={link.id} active={activeTab === link.id} onClick={() => { setActiveTab(link.id); setSearchQuery(''); }} icon={link.icon} label={link.label} />
          ))}
        </nav>
        <div className="p-8"><button onClick={onClose} className="w-full flex items-center gap-4 px-6 py-4 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"><LogOut size={18} /><span>Terminate</span></button></div>
      </aside>

      {/* Mobile Header & Nav */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#020617]/95 backdrop-blur-xl border-b border-slate-900 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Menu className="text-indigo-500 cursor-pointer" onClick={() => setIsMobileMenuOpen(true)} />
          <span className="text-lg font-black text-white uppercase tracking-tighter">Root</span>
        </div>
        <div className="flex items-center gap-4">
          <RefreshCw size={20} className={`text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} onClick={() => fetchData(token)} />
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center"><ShieldCheck className="text-white" size={20} /></div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#020617] border-r border-slate-900 p-8 animate-in slide-in-from-left duration-300">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><Server className="text-white" size={20} /></div>
                   <span className="font-black text-white uppercase tracking-tighter">Root Access</span>
                </div>
                <X className="text-slate-500" onClick={() => setIsMobileMenuOpen(false)} />
             </div>
             <nav className="space-y-4">
                {navLinks.map(link => (
                  <button 
                    key={link.id} 
                    onClick={() => { setActiveTab(link.id); setSearchQuery(''); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === link.id ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                  >
                    {link.icon}
                    <span className="font-bold text-xs uppercase tracking-widest">{link.label}</span>
                  </button>
                ))}
                <button onClick={onClose} className="w-full flex items-center gap-4 px-4 py-3 text-red-500 mt-10 font-bold text-xs uppercase"><LogOut size={18} /> Disconnect</button>
             </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full lg:h-screen overflow-hidden">
        {/* Desktop Title Header */}
        <header className="hidden lg:flex h-24 border-b border-slate-900 px-10 items-center justify-between shrink-0 bg-[#020617]/80 backdrop-blur-md z-20">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Accessing Zone: {activeTab}</h2>
            <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-500 tracking-widest uppercase">Encryption Active</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => fetchData(token)} className="p-3 bg-slate-900 rounded-xl text-slate-500 hover:text-indigo-400 transition-all"><RefreshCw size={20} className={isRefreshing ? 'animate-spin text-indigo-500' : ''} /></button>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-600/20"><ShieldCheck className="text-white" size={24} /></div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.03),transparent)] scrollbar-hide">
           {activeTab === 'Overview' && <OverviewTab stats={systemStats} logs={logs} students={students} teachers={teachers} />}
           {activeTab === 'Students' && <StudentHub students={filteredStudents} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onDelete={deleteStudent} onAdd={() => setShowForm('student')} onEdit={setEditEntity} />}
           {activeTab === 'Faculty' && <FacultyHub teachers={filteredTeachers} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onDelete={deleteTeacher} onAdd={() => setShowForm('teacher')} onEdit={setEditEntity} />}
           {activeTab === 'Tasks' && <TaskHub tasks={tasks} teachers={teachers} onSave={saveTask} onAdd={() => setShowForm('task')} />}
           {activeTab === 'Schedules' && <ScheduleHub teachers={teachers} />}
        </div>
      </main>

      {/* Forms & Modals */}
      {(showForm || editEntity) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-[#0f172a] border border-slate-800 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg lg:text-xl font-black uppercase text-white tracking-tight flex items-center gap-3">
                    <Edit2 className="text-indigo-500" size={24} /> {editEntity ? 'Update' : 'Provision'} Record
                 </h3>
                 <button onClick={() => { setShowForm(null); setEditEntity(null); }} className="text-slate-600 hover:text-white transition-colors"><X size={24} /></button>
              </div>
              
              {(showForm === 'student' || (editEntity && 'major' in editEntity)) && <StudentForm initial={editEntity} onSave={saveStudent} />}
              {(showForm === 'teacher' || (editEntity && 'department' in editEntity)) && <TeacherForm initial={editEntity} onSave={saveTeacher} />}
              {(showForm === 'task') && <TaskForm teachers={teachers} onSave={(t: any) => handleAction(() => api.tasks.save(token, t))} />}
           </div>
        </div>
      )}
    </div>
  );
};

// --- View Sub-Components ---

const SidebarBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-600 hover:bg-slate-900/50 hover:text-white'}`}>
    <div className={active ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'}>{icon}</div>
    <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
  </button>
);

const OverviewTab = ({ stats, logs, students, teachers }: any) => (
  <div className="space-y-6 lg:space-y-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      <StatCard label="Live Nodes" value={stats?.activeConnections?.toString() || '0'} icon={<Globe className="text-emerald-400" />} />
      <StatCard label="Faculty Hub" value={teachers.length.toString()} icon={<UserCog className="text-blue-400" />} />
      <StatCard label="Learner Pool" value={students.length.toString()} icon={<Users className="text-indigo-400" />} />
      <StatCard label="Uptime" value={stats?.uptime || '---'} icon={<CheckCircle2 className="text-purple-400" />} />
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
      <div className="lg:col-span-2 bg-slate-900/30 border border-slate-900 rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Operational Flux</h3>
           <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div><span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Active Link</span></div>
        </div>
        <div className="h-[200px] lg:h-[300px]">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={systemActivity}>
               <defs><linearGradient id="flux" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
               <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '12px' }} />
               <Area type="monotone" dataKey="requests" stroke="#6366f1" fill="url(#flux)" strokeWidth={3} />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-slate-900/30 border border-slate-900 rounded-[2rem] lg:rounded-[2.5rem] p-8 flex flex-col shadow-2xl">
        <h3 className="text-[10px] font-black uppercase text-slate-500 mb-8 tracking-widest text-center lg:text-left">Recent Triggers</h3>
        <div className="flex-1 space-y-6 overflow-y-auto max-h-[300px] scrollbar-hide">
           {logs.slice(0, 10).map((l: any, i: number) => (
             <div key={i} className="flex gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                <div><p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">{l.action}</p><p className="text-[9px] text-slate-700 font-black uppercase mt-1 tracking-tighter">{l.timestamp}</p></div>
             </div>
           ))}
        </div>
        <button className="w-full mt-10 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-400 transition-colors">Clear Stream</button>
      </div>
    </div>
  </div>
);

const StudentHub = ({ students, searchQuery, setSearchQuery, onDelete, onAdd, onEdit }: any) => (
  <div className="space-y-6 lg:space-y-10">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6">
      <div className="relative flex-1 w-full md:max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500" size={18} />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search Records..." className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-12 py-4 text-xs font-bold text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
      </div>
      <button onClick={onAdd} className="w-full md:w-auto bg-indigo-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/10"><Plus size={16} /> New Provision</button>
    </div>

    {/* Responsive Table/Card View */}
    <div className="bg-slate-900/30 border border-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[600px]">
          <thead className="bg-slate-950/50 uppercase text-slate-600 font-black tracking-widest"><tr className="border-b border-slate-900"><th className="px-10 py-6">ID Node</th><th className="px-10 py-6">Specialization</th><th className="px-10 py-6">Status</th><th className="px-10 py-6 text-right">Ops</th></tr></thead>
          <tbody className="divide-y divide-slate-900">
            {students.map((s: any) => (
              <tr key={s.id} className="hover:bg-slate-900/20 group transition-all">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-indigo-500">{s.name.charAt(0)}</div>
                    <div><p className="font-black text-slate-200">{s.name}</p><p className="text-[10px] text-slate-700 uppercase tracking-widest">{s.id}</p></div>
                  </div>
                </td>
                <td className="px-10 py-6 text-slate-500 font-bold uppercase tracking-tight">{s.major}</td>
                <td className="px-10 py-6"><span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase">Active</span></td>
                <td className="px-10 py-6 text-right space-x-2">
                  <button onClick={() => onEdit(s)} className="p-2 text-slate-700 hover:text-indigo-400 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => onDelete(s.id)} className="p-2 text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {students.length === 0 && <div className="p-20 text-center text-slate-700 font-black uppercase text-[10px] tracking-[0.3em]">No valid nodes found</div>}
    </div>
  </div>
);

const FacultyHub = ({ teachers, searchQuery, setSearchQuery, onDelete, onAdd, onEdit }: any) => (
  <div className="space-y-6 lg:space-y-10">
    <div className="flex flex-col md:flex-row justify-between items-center gap-4 lg:gap-6">
      <div className="relative flex-1 w-full md:max-w-md group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500" size={18} />
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter Faculty..." className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-12 py-4 text-xs font-bold text-white focus:ring-1 focus:ring-indigo-500 outline-none" />
      </div>
      <button onClick={onAdd} className="w-full md:w-auto bg-indigo-600 px-8 py-4 rounded-2xl font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/10"><Plus size={16} /> New Faculty</button>
    </div>

    <div className="bg-slate-900/30 border border-slate-900 rounded-[2rem] overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[600px]">
          <thead className="bg-slate-950/50 uppercase text-slate-600 font-black tracking-widest"><tr className="border-b border-slate-900"><th className="px-10 py-6">Faculty Node</th><th className="px-10 py-6">Sector</th><th className="px-10 py-6">Integrity</th><th className="px-10 py-6 text-right">Ops</th></tr></thead>
          <tbody className="divide-y divide-slate-900">
            {teachers.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-900/20 group transition-all">
                <td className="px-10 py-6">
                   <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-black text-indigo-500">{t.name.charAt(0)}</div>
                      <div><p className="font-black text-slate-200">{t.name}</p><p className="text-[10px] text-slate-700 uppercase tracking-widest">{t.id}</p></div>
                   </div>
                </td>
                <td className="px-10 py-6 text-slate-500 font-bold uppercase tracking-tight">{t.department}</td>
                <td className="px-10 py-6"><span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${t.status === 'active' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 'text-red-500 border-red-500/20 bg-red-500/10'}`}>{t.status}</span></td>
                <td className="px-10 py-6 text-right space-x-2">
                   <button onClick={() => onEdit(t)} className="p-2 text-slate-700 hover:text-indigo-400 transition-colors"><Edit2 size={16} /></button>
                   <button onClick={() => onDelete(t.id)} className="p-2 text-slate-700 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {teachers.length === 0 && <div className="p-20 text-center text-slate-700 font-black uppercase text-[10px] tracking-[0.3em]">No faculty detected</div>}
    </div>
  </div>
);

const TaskHub = ({ tasks, teachers, onSave, onAdd }: any) => {
  const toggleTaskStatus = (task: TaskRecord) => {
     const next: any = { 'pending': 'in-progress', 'in-progress': 'completed', 'completed': 'pending' };
     onSave({ ...task, status: next[task.status] });
  };

  return (
    <div className="space-y-6 lg:space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
         <h3 className="text-lg lg:text-xl font-black uppercase text-white tracking-tighter">Command Directives</h3>
         <button onClick={onAdd} className="w-full md:w-auto bg-indigo-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2"><Plus size={16} /> New Sequence</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {tasks.map((task: any) => (
          <div key={task.id} className="bg-slate-900/40 border border-slate-800 p-8 rounded-[2rem] lg:rounded-[2.5rem] relative group hover:border-indigo-500/30 transition-all shadow-xl">
             <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'}`}>
                   {task.status}
                </div>
                <div className={`w-2 h-2 rounded-full ${task.priority === 'high' ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
             </div>
             <h4 className="text-lg font-bold text-white mb-2 uppercase tracking-tight leading-tight">{task.title}</h4>
             <p className="text-xs text-slate-500 mb-8 leading-relaxed line-clamp-2">{task.description}</p>
             <div className="flex items-center gap-4 mb-8 pt-8 border-t border-slate-800/50">
                <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center font-black text-[10px] text-indigo-500">{teachers.find((t:any)=>t.id === task.assignedTo)?.name.charAt(0) || '?'}</div>
                <div><p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">Executor</p><p className="text-xs font-bold text-slate-300 mt-1 leading-none">{teachers.find((t:any)=>t.id === task.assignedTo)?.name || 'Unassigned'}</p></div>
             </div>
             <button onClick={() => toggleTaskStatus(task)} className="w-full py-3 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-400 transition-colors">Shift Sequence</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ScheduleHub = ({ teachers }: any) => (
  <div className="space-y-6 lg:space-y-10">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
       {teachers.map((t: any) => (
         <div key={t.id} className="bg-slate-900/30 border border-slate-800 rounded-[2rem] lg:rounded-[2.5rem] p-8 lg:p-10 shadow-xl">
            <div className="flex justify-between items-center mb-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-black text-white shadow-lg">{t.name.charAt(0)}</div>
                  <div><p className="text-lg font-black text-white uppercase tracking-tight leading-none">{t.name}</p><p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] mt-1.5 leading-none">{t.department}</p></div>
               </div>
               <span className="hidden sm:inline-block text-[8px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">Operational</span>
            </div>
            <div className="space-y-4">
               <ScheduleItem icon={<Clock size={16}/>} label="Window" value={t.officeHours} />
               <ScheduleItem icon={<BookOpen size={16}/>} label="Load" value="4 Modules / Cycle" />
               <ScheduleItem icon={<Briefcase size={16}/>} label="Pool" value={t.specialization} />
            </div>
         </div>
       ))}
    </div>
  </div>
);

// --- Form Components ---

const StudentForm = ({ initial, onSave }: any) => {
  const [data, setData] = useState(initial || { id: `L0${Math.floor(Math.random()*900)+100}`, name: '', email: '', password: '', major: 'Computer Science', gpa: 4.0, attendance: '100%', courses: [] });
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <InputGroup label="Entity Label (Name)" value={data.name} onChange={(v:any) => setData({...data, name: v})} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <InputGroup label="Email Channel" value={data.email} onChange={(v:any) => setData({...data, email: v})} />
        <InputGroup label="Specialization" value={data.major} onChange={(v:any) => setData({...data, major: v})} />
      </div>
      <InputGroup label="Access Cipher (Password)" type="password" value={data.password} onChange={(v:any) => setData({...data, password: v})} />
      <button onClick={() => onSave(data)} className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all mt-4">Node Injection Sync</button>
    </div>
  );
};

const TeacherForm = ({ initial, onSave }: any) => {
  const [data, setData] = useState(initial || { id: `F0${Math.floor(Math.random()*900)+100}`, name: '', email: '', department: 'Computer Science', specialization: '', officeHours: 'Mon/Wed 1-3 PM', status: 'active' });
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <InputGroup label="Faculty Identifier" value={data.name} onChange={(v:any) => setData({...data, name: v})} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <InputGroup label="Department Pool" value={data.department} onChange={(v:any) => setData({...data, department: v})} />
        <InputGroup label="Research Hub" value={data.specialization} onChange={(v:any) => setData({...data, specialization: v})} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <InputGroup label="Availability" value={data.officeHours} onChange={(v:any) => setData({...data, officeHours: v})} />
        <div className="space-y-2">
           <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-1">Condition</label>
           <select value={data.status} onChange={e => setData({...data, status: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs text-white uppercase font-black focus:ring-1 focus:ring-indigo-500 outline-none">
              <option value="active">Active</option>
              <option value="on-leave">On-Leave</option>
           </select>
        </div>
      </div>
      <button onClick={() => onSave(data)} className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all mt-4">Commit record Sync</button>
    </div>
  );
};

const TaskForm = ({ teachers, onSave }: any) => {
  const [data, setData] = useState({ title: '', description: '', assignedTo: teachers[0]?.id || '', deadline: '', priority: 'medium' });
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <InputGroup label="Directive Title" value={data.title} onChange={(v:any) => setData({...data, title: v})} />
      <div className="space-y-2">
        <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-1">Logic Details</label>
        <textarea value={data.description} onChange={e => setData({...data, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs text-white min-h-[120px] focus:ring-1 focus:ring-indigo-500 outline-none transition-all" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-black text-slate-700 uppercase tracking-widest ml-1">Target Node</label>
          <select value={data.assignedTo} onChange={e => setData({...data, assignedTo: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-xs text-white font-bold focus:ring-1 focus:ring-indigo-500 outline-none">
            {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            {teachers.length === 0 && <option disabled>No Faculty Detected</option>}
          </select>
        </div>
        <InputGroup label="Threshold Date" type="date" value={data.deadline} onChange={(v:any) => setData({...data, deadline: v})} />
      </div>
      <button onClick={() => onSave({ ...data, id: `T${Date.now()}`, status: 'pending' })} className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all mt-4">Inject Directive</button>
    </div>
  );
};

// --- Shared Internal Components ---

const StatCard = ({ label, value, icon }: any) => (
  <div className="bg-slate-900/30 border border-slate-900 p-6 lg:p-8 rounded-[1.8rem] lg:rounded-[2rem] shadow-xl group hover:border-indigo-500/30 transition-all">
    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">{icon}</div>
    <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 leading-none mb-1.5">{label}</p>
    <h4 className="text-2xl lg:text-3xl font-black text-white tracking-tighter leading-none">{value}</h4>
  </div>
);

const ScheduleItem = ({ icon, label, value }: any) => (
  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-900 flex items-center justify-between group hover:border-indigo-500/20 transition-all">
    <div className="flex items-center gap-3">
       <div className="text-slate-700 group-hover:text-indigo-400 transition-colors">{icon}</div>
       <span className="text-[9px] font-black uppercase text-slate-600 tracking-[0.1em]">{label}</span>
    </div>
    <span className="text-[11px] font-bold text-slate-300 tracking-tight">{value}</span>
  </div>
);

const InputGroup = ({ label, value, onChange, type = "text" }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-[9px] font-black uppercase text-slate-700 ml-1 tracking-widest">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} className="bg-slate-950 border border-slate-800 text-white rounded-2xl px-6 py-4 text-xs focus:ring-1 focus:ring-indigo-600 outline-none transition-all font-bold" />
  </div>
);

export default AdminPortal;
