
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  ChevronRight, 
  GraduationCap, 
  Clock, 
  FileText,
  User,
  ArrowLeft,
  Lock,
  Mail,
  Loader2,
  RefreshCcw,
  CheckCircle,
  Download,
  ExternalLink,
  Shield,
  Star,
  MoreVertical,
  Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../backend/api';
import { StudentRecord, CourseRecord } from '../services/storageService';

const gradeData = [
  { name: 'Term 1', gpa: 3.4 },
  { name: 'Term 2', gpa: 3.6 },
  { name: 'Term 3', gpa: 3.5 },
  { name: 'Term 4', gpa: 3.8 },
  { name: 'Term 5', gpa: 3.9 },
  { name: 'Current', gpa: 4.0 },
];

interface StudentPortalProps {
  onClose: () => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ onClose }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<StudentRecord | null>(null);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('student@lumina.edu');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const result = await api.auth.login(email, password);
    
    if (result.success && result.student && result.token) {
      setCurrentUser(result.student);
      setToken(result.token);
      setIsLoggedIn(true);
    } else {
      setError(result.error || 'Identity verification failed.');
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setToken('');
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSyncing(false);
  };

  const handleUpdateProfile = async (updates: Partial<StudentRecord>) => {
    if (!currentUser || !token) return;
    setIsLoading(true);
    const updatedUser = { ...currentUser, ...updates } as StudentRecord;
    // Fix: api.students.update does not exist; use api.students.save instead
    await api.students.save(token, updatedUser);
    setCurrentUser(updatedUser);
    setIsLoading(false);
    alert('Node settings synchronized successfully.');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 font-sans">
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-slate-400 hover:text-white flex items-center gap-2 group transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Lumina Home</span>
        </button>

        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 rounded-2xl md:rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-6 rotate-3">
              {isLoading ? <Loader2 size={32} className="text-white animate-spin" /> : <GraduationCap size={32} className="text-white" />}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">Identity Hub</h1>
            <p className="text-slate-500 mt-2 font-bold text-[10px] md:text-xs tracking-widest uppercase opacity-60 text-center">Authorize student access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-[10px] md:text-xs font-black text-center uppercase tracking-widest">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Universal Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@lumina.edu"
                  disabled={isLoading}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl px-12 py-3.5 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-800 text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Private Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl px-12 py-3.5 md:py-4 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-800 text-sm md:text-base"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white font-black py-3.5 md:py-4 rounded-2xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-50 text-sm md:text-base"
            >
              {isLoading && <Loader2 className="animate-spin" size={20} />}
              {isLoading ? 'ESTABLISHING...' : 'AUTHORIZE SESSION'}
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-600 mt-6 font-bold uppercase tracking-widest opacity-50">Secure Biometric Encryption Active</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Courses', icon: <BookOpen size={20} /> },
    { label: 'Schedule', icon: <Calendar size={20} /> },
    { label: 'Files', icon: <FileText size={20} /> },
    { label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col lg:flex-row font-sans animate-in fade-in duration-1000">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 border-r border-slate-900 bg-slate-950 flex-col shrink-0">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <GraduationCap className="text-white" size={24} />
          </div>
          <div>
            <span className="text-2xl font-black text-white tracking-tighter uppercase">Lumina</span>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Student Node</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-8">
          {navItems.map(item => (
            <SidebarLink 
              key={item.label} 
              icon={item.icon} 
              label={item.label} 
              active={activeTab === item.label} 
              onClick={() => setActiveTab(item.label)}
            />
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
          >
            <LogOut size={18} />
            <span>Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 px-2 py-3 flex justify-around items-center z-50">
        {navItems.map(item => (
          <button 
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`flex flex-col items-center gap-1.5 transition-all flex-1 ${activeTab === item.label ? 'text-indigo-500' : 'text-slate-600'}`}
          >
            <div className={`p-2 rounded-xl transition-all ${activeTab === item.label ? 'bg-indigo-500/10' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-20 lg:pb-0">
        <header className="h-16 lg:h-24 border-b border-slate-900 px-6 lg:px-10 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 flex-1">
             <div className="flex flex-col">
                <h2 className="text-[8px] md:text-sm font-black text-slate-500 uppercase tracking-[0.2em] leading-none">Access Point</h2>
                <div className="flex items-center gap-2 mt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-[8px] md:text-xs font-bold text-emerald-500 uppercase tracking-widest">Connection Stable</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <button 
              onClick={handleSync}
              className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
            >
              <RefreshCcw size={16} className={isSyncing ? 'animate-spin text-indigo-500' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{isSyncing ? 'Syncing...' : 'Force Sync'}</span>
            </button>
            <div className="h-6 w-px bg-slate-900 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white leading-none">{currentUser?.name}</p>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1.5">{currentUser?.id}</p>
              </div>
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
                <img src={`https://ui-avatars.com/api/?name=${currentUser?.name}&background=6366f1&color=fff&bold=true`} className="w-full h-full object-cover" alt="User" />
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent)] scrollbar-hide animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activeTab === 'Dashboard' && <DashboardView user={currentUser} />}
          {activeTab === 'Courses' && <CoursesView courses={currentUser?.courses || []} />}
          {activeTab === 'Schedule' && <ScheduleView />}
          {activeTab === 'Files' && <FilesView />}
          {activeTab === 'Settings' && <SettingsView user={currentUser} onUpdate={handleUpdateProfile} />}
        </div>
      </main>
    </div>
  );
};

// --- View Sub-Components ---

const DashboardView = ({ user }: { user: StudentRecord | null }) => (
  <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight uppercase">Control Center</h2>
        <p className="text-xs lg:text-sm text-slate-500 mt-2 font-medium">Identity confirmed for <span className="text-indigo-400 font-bold">{user?.major}</span></p>
      </div>
      <div className="text-right hidden md:block">
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Current Session</p>
        <p className="text-sm font-bold text-white">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
      <DashboardStat label="Current GPA" value={user?.gpa?.toString() || "0.0"} trend="+0.12 vs Avg" icon={<GraduationCap size={20} className="text-indigo-400" />} />
      <DashboardStat label="Attendance" value={user?.attendance || "0%"} trend="Status: Elite" icon={<User size={20} className="text-emerald-400" />} />
      <DashboardStat label="Academic Credits" value="64 / 120" trend="53% Threshold" icon={<Clock size={20} className="text-purple-400" />} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
      <div className="lg:col-span-2 bg-slate-900/40 border border-slate-900 rounded-[2.5rem] p-6 lg:p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm lg:text-xl font-black text-white uppercase tracking-wider">Growth Analytics</h3>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span>Term Performance</span>
            </div>
          </div>
        </div>
        <div className="h-[250px] md:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gradeData}>
              <defs>
                <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.3} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} dy={10} />
              <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', fontSize: '12px' }}
                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="gpa" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorGpa)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <BookOpen size={80} />
          </div>
          <h4 className="text-lg font-black leading-tight uppercase tracking-tight">Next Module: Neural Nets</h4>
          <p className="text-xs font-bold opacity-80 mt-2">Laboratory Session 04 • Room 202-B</p>
          <div className="mt-8 flex items-center justify-between">
            <div className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Starts in 42m</div>
            <button className="p-3 bg-white text-indigo-600 rounded-xl hover:scale-105 transition-all shadow-lg active:scale-95">
              <ExternalLink size={20} />
            </button>
          </div>
        </div>
        
        <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-[2.5rem]">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6">Recent System Logs</h4>
          <div className="space-y-6">
             {[
               { msg: "Final grades for Term 5 synchronized", time: "2h ago", type: 'grade' },
               { msg: "Course CS301 syllabus updated", time: "5h ago", type: 'file' },
               { msg: "New announcement: Fall Internship Fair", time: "1d ago", type: 'alert' }
             ].map((alert, i) => (
               <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${alert.type === 'grade' ? 'bg-emerald-500' : alert.type === 'file' ? 'bg-blue-500' : 'bg-indigo-500'}`}></div>
                  <div>
                     <p className="text-xs font-bold text-slate-200 leading-snug group-hover:text-white transition-colors">{alert.msg}</p>
                     <p className="text-[9px] font-black text-slate-700 uppercase mt-1.5 tracking-widest">{alert.time}</p>
                  </div>
               </div>
             ))}
          </div>
          <button className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-400 transition-colors">Clear All History</button>
        </div>
      </div>
    </div>
  </div>
);

const CoursesView = ({ courses }: { courses: CourseRecord[] }) => (
  <div className="max-w-6xl mx-auto space-y-10">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">Module Registry</h2>
        <p className="text-xs lg:text-sm text-slate-500 mt-2 font-medium">Managing <span className="text-indigo-400 font-bold">{courses.length} active enrollments</span> for Fall 2025</p>
      </div>
      <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-lg">
        <Plus size={18} /> Add Module
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {courses.map((course) => (
        <div key={course.id} className="bg-slate-900/40 border border-slate-900 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BookOpen size={100} />
          </div>
          
          <div className="flex justify-between items-start mb-6">
            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
              course.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
              course.status === 'completed' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
              'bg-slate-500/10 text-slate-500 border-slate-500/20'
            }`}>
              {course.status}
            </div>
            <span className="text-xs font-black text-slate-700 tracking-widest">{course.id}</span>
          </div>

          <h3 className="text-xl font-black text-white mb-2 leading-tight uppercase">{course.name}</h3>
          <p className="text-xs font-bold text-slate-500 mb-8 tracking-wide">Instructor: {course.instructor}</p>
          
          <div className="space-y-3">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
              <span>Syllabus Progress</span>
              <span className="text-white">{course.progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-1000 ${course.status === 'completed' ? 'bg-indigo-500' : 'bg-emerald-500'}`} 
                style={{ width: `${course.progress}%` }} 
              />
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800/50 flex justify-between items-center">
             <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Current Grade</span>
                <span className="text-xl font-black text-white mt-1 tracking-tighter">{course.grade}</span>
             </div>
             <div className="flex gap-2">
                <button className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white transition-all hover:scale-105">
                   <FileText size={18} />
                </button>
                <button className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg hover:scale-105 active:scale-95">
                   Access Module
                </button>
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ScheduleView = () => (
  <div className="max-w-6xl mx-auto space-y-10">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">Time Grid</h2>
        <p className="text-xs lg:text-sm text-slate-500 mt-2 font-medium">Session synchronization for <span className="text-indigo-400 font-bold">Week 08</span></p>
      </div>
      <div className="flex gap-3">
        {['D', 'W', 'M'].map(view => (
          <button key={view} className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs transition-all ${view === 'W' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'}`}>
            {view}
          </button>
        ))}
      </div>
    </div>

    <div className="bg-slate-900/40 border border-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="grid grid-cols-6 border-b border-slate-900">
        <div className="p-6 border-r border-slate-900 bg-slate-950/50"></div>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => (
          <div key={day} className="p-6 text-center border-r border-slate-900 last:border-0">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{day}</span>
          </div>
        ))}
      </div>
      
      <div className="relative">
        {[
          { time: '09:00', label: '09 AM' },
          { time: '11:00', label: '11 AM' },
          { time: '13:00', label: '01 PM' },
          { time: '15:00', label: '03 PM' }
        ].map((slot, idx) => (
          <div key={idx} className="grid grid-cols-6 border-b border-slate-900 last:border-0 h-32 group">
            <div className="p-4 border-r border-slate-900 bg-slate-950/50 flex flex-col justify-center items-center">
              <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{slot.label}</span>
            </div>
            <div className="col-span-5 relative p-4 flex gap-4">
               {idx === 0 && (
                 <div className="absolute top-4 left-4 w-64 h-24 bg-indigo-600/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-indigo-400/30 animate-pulse">
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/60">CS301 • Room 202</p>
                    <p className="text-xs font-black text-white mt-1 uppercase">Neural Networks</p>
                    <div className="mt-4 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                       <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Active Now</span>
                    </div>
                 </div>
               )}
               {idx === 2 && (
                 <div className="absolute top-4 right-[25%] w-64 h-24 bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-xl">
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">BI402 • Lab 01</p>
                    <p className="text-xs font-black text-slate-200 mt-1 uppercase">Genome Seq</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-4">Upcoming</p>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FilesView = () => (
  <div className="max-w-6xl mx-auto space-y-10">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div>
        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">Cloud Archive</h2>
        <p className="text-xs lg:text-sm text-slate-500 mt-2 font-medium">Accessing <span className="text-indigo-400 font-bold">Lumina Secure Storage</span></p>
      </div>
      <div className="flex gap-4 w-full md:w-auto">
         <div className="relative flex-1 md:w-64">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
           <input type="text" placeholder="Search archive..." className="w-full bg-slate-900 border border-slate-800 rounded-xl px-12 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all text-white placeholder:text-slate-700" />
         </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1 space-y-6">
         <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-[2.5rem]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6">File Nodes</h4>
            <div className="space-y-4">
               {['Recent', 'Course Content', 'Transcripts', 'Syllabi', 'Forms'].map(node => (
                 <button key={node} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${node === 'Recent' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-600 hover:text-white hover:bg-slate-900'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest">{node}</span>
                    <ChevronRight size={14} className={node === 'Recent' ? 'opacity-100' : 'opacity-0'} />
                 </button>
               ))}
            </div>
         </div>
         <div className="p-8 bg-indigo-600/10 border border-indigo-600/20 rounded-[2.5rem] flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
               <Shield className="text-white" size={24} />
            </div>
            <h5 className="text-xs font-black text-white uppercase tracking-wider">Secure Access</h5>
            <p className="text-[9px] text-indigo-400 font-bold uppercase mt-2 leading-relaxed tracking-widest">All downloads are tracked and encrypted for academic integrity.</p>
         </div>
      </div>

      <div className="lg:col-span-3">
         <div className="bg-slate-900/40 border border-slate-900 rounded-[2.5rem] overflow-hidden">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-900 bg-slate-950/30">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600">File Identifier</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600">Type</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-600 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-900">
                  {[
                    { name: 'Semester_04_Transcript.pdf', type: 'PDF Document', size: '2.4 MB' },
                    { name: 'CS301_Lecture_08_Summary.mp4', type: 'Media Stream', size: '142 MB' },
                    { name: 'Thesis_Draft_v2.docx', type: 'Text Document', size: '420 KB' },
                    { name: 'Financial_Aid_Letter.pdf', type: 'Secure PDF', size: '1.2 MB' },
                    { name: 'Campus_Map_3D.obj', type: '3D Asset', size: '12 MB' }
                  ].map((file, i) => (
                    <tr key={i} className="group hover:bg-slate-900/20 transition-all cursor-pointer">
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg group-hover:border-indigo-500/50 transition-colors">
                                <FileText size={18} className="text-slate-600 group-hover:text-indigo-400" />
                             </div>
                             <div>
                                <p className="text-xs font-bold text-slate-200">{file.name}</p>
                                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest mt-1">{file.size}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{file.type}</span>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <button className="p-2 text-slate-700 hover:text-indigo-500 transition-colors">
                             <Download size={18} />
                          </button>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  </div>
);

const SettingsView = ({ user, onUpdate }: { user: StudentRecord | null, onUpdate: (updates: Partial<StudentRecord>) => void }) => {
  const [name, setName] = useState(user?.name || '');
  const [major, setMajor] = useState(user?.major || '');
  const [email, setEmail] = useState(user?.email || '');

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">Node Settings</h2>
        <p className="text-xs lg:text-sm text-slate-500 mt-2 font-medium">Configure your <span className="text-indigo-400 font-bold">academic terminal environment</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
           <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-[2.5rem] flex flex-col items-center">
              <div className="w-24 h-24 rounded-[2rem] bg-indigo-600 p-1 shadow-2xl mb-6 group cursor-pointer relative overflow-hidden">
                 <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&bold=true&size=128`} className="w-full h-full object-cover rounded-[1.8rem]" alt="User" />
                 <div className="absolute inset-0 bg-indigo-600/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                    <RefreshCcw className="text-white" size={24} />
                 </div>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-wider">{user?.name}</h4>
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{user?.id}</p>
           </div>
           
           <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-[2.5rem] space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Preferences</h4>
              <div className="space-y-4">
                 {[
                   { label: 'Cloud Sync', enabled: true },
                   { label: 'Push Notifications', enabled: true },
                   { label: 'Dark Mode', enabled: true },
                   { label: 'Public Profile', enabled: false }
                 ].map(pref => (
                   <div key={pref.label} className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{pref.label}</span>
                      <button className={`w-10 h-5 rounded-full relative transition-all ${pref.enabled ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                         <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${pref.enabled ? 'left-6' : 'left-1'}`} />
                      </button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="md:col-span-2">
           <div className="bg-slate-900/40 border border-slate-900 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                 <User className="text-indigo-500" size={24} /> Profile Parameters
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Universal Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Academic Major</label>
                    <input 
                      type="text" 
                      value={major} 
                      onChange={e => setMajor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
                    />
                 </div>
                 <div className="space-y-3 sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-1">Communication Channel (Email)</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all" 
                    />
                 </div>
              </div>

              <div className="pt-8 border-t border-slate-900 flex justify-end gap-4">
                 <button className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors">Discard</button>
                 <button 
                  onClick={() => onUpdate({ name, major, email })}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/10 hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95"
                 >
                    Sync Settings
                 </button>
              </div>
           </div>
           
           <div className="mt-8 bg-red-500/5 border border-red-500/10 p-8 rounded-[2.5rem] flex items-center justify-between">
              <div>
                 <h4 className="text-xs font-black text-red-500 uppercase tracking-widest">Terminate Digital Identity</h4>
                 <p className="text-[10px] text-slate-600 font-medium mt-1">Permanently remove your student node and all academic history.</p>
              </div>
              <button className="px-6 py-3 border border-red-500/20 text-red-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Decommission</button>
           </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

// Fixed: Added React.FC type to handle standard React props like 'key' when used in a map function.
const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, label, active = false, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-600 hover:text-white hover:bg-slate-900'}`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'} transition-colors`}>{icon}</div>
    <span className="font-black text-xs uppercase tracking-widest">{label}</span>
  </button>
);

const DashboardStat = ({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) => (
  <div className="bg-slate-900/40 border border-slate-900 p-8 rounded-[2.5rem] shadow-xl hover:bg-slate-900/60 transition-all group relative overflow-hidden">
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 blur-3xl rounded-full"></div>
    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner">
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</p>
    <h4 className="text-3xl lg:text-4xl font-black text-white mt-2 tracking-tight">{value}</h4>
    <p className="text-[10px] font-black text-slate-700 mt-4 uppercase tracking-widest flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> {trend}
    </p>
  </div>
);

export default StudentPortal;
