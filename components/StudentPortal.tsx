
import React, { useState, useEffect } from 'react';
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
  RefreshCcw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../backend/api';
import { StudentRecord } from '../services/storageService';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      setError(result.error || 'Connection to server failed.');
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
    await new Promise(r => setTimeout(r, 1200));
    setIsSyncing(false);
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
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { label: 'Courses', icon: <BookOpen size={20} /> },
    { label: 'Schedule', icon: <Calendar size={20} /> },
    { label: 'Files', icon: <FileText size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col lg:flex-row font-sans animate-in fade-in duration-1000">
      {/* Desktop Sidebar */}
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
          <SidebarLink 
            icon={<Settings size={20} />} 
            label="Settings" 
            active={activeTab === 'Settings'} 
            onClick={() => setActiveTab('Settings')}
          />
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

      {/* Mobile Bottom Navigation */}
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
        <button 
          onClick={handleLogout}
          className="flex flex-col items-center gap-1.5 flex-1 text-slate-600 hover:text-red-400"
        >
          <div className="p-2">
            <LogOut size={20} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pb-20 lg:pb-0">
        {/* Header */}
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

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent)] scrollbar-hide">
          <div className="max-w-6xl mx-auto space-y-8 lg:space-y-10">
            <div>
              <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tight">System Terminal</h2>
              <p className="text-xs lg:text-sm text-slate-500 mt-2 font-medium">Remote session established for <span className="text-indigo-400 font-bold">{currentUser?.major}</span></p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-8">
              <DashboardStat label="Current GPA" value={currentUser?.gpa?.toString() || "0.0"} trend="+0.12 vs Avg" icon={<GraduationCap size={20} className="text-indigo-400" />} />
              <DashboardStat label="Attendance" value={currentUser?.attendance || "0%"} trend="Status: Excellent" icon={<User size={20} className="text-emerald-400" />} />
              <DashboardStat label="Academic Credits" value="64 / 120" trend="53% Complete" icon={<Clock size={20} className="text-purple-400" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
              {/* Performance Chart */}
              <div className="lg:col-span-2 bg-slate-900/40 border border-slate-900 rounded-[1.5rem] lg:rounded-[2.5rem] p-6 lg:p-10 shadow-2xl">
                <div className="flex justify-between items-center mb-6 lg:mb-10">
                  <h3 className="text-sm lg:text-xl font-black text-white uppercase tracking-wider">Growth Analytics</h3>
                  <div className="flex gap-1.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                  </div>
                </div>
                <div className="h-[200px] md:h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={gradeData}>
                      <defs>
                        <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 9, fontWeight: 'bold'}} dy={10} />
                      <YAxis domain={[0, 4]} axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 9, fontWeight: 'bold'}} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', fontSize: '12px' }}
                        itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="gpa" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sidebar Info - Mobile Stacked */}
              <div className="space-y-6 lg:space-y-8">
                 <div className="bg-indigo-600 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] text-white shadow-xl shadow-indigo-600/10">
                    <h4 className="text-base lg:text-lg font-black leading-tight">Next Lab: Neural Nets</h4>
                    <p className="text-[10px] lg:text-sm font-bold opacity-80 mt-2">Starts in 45 minutes</p>
                    <button className="mt-6 lg:mt-8 w-full py-3.5 bg-white/20 backdrop-blur-md border border-white/20 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-[0.2em] hover:bg-white/30 transition-all">
                       Join Stream
                    </button>
                 </div>
                 
                 <div className="bg-slate-900/40 border border-slate-900 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem]">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6">Recent Alerts</h4>
                    <div className="space-y-4">
                       {[
                         { msg: "Final grades for Term 5 posted", time: "2h ago" },
                         { msg: "Scholarship renewal approved", time: "1d ago" }
                       ].map((alert, i) => (
                         <div key={i} className="flex gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1"></div>
                            <div>
                               <p className="text-[10px] md:text-xs font-bold text-slate-200 leading-snug">{alert.msg}</p>
                               <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">{alert.time}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarLink = ({ icon, label, active = false, onClick }: SidebarLinkProps) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-600 hover:text-white hover:bg-slate-900'}`}
  >
    <div className={`${active ? 'text-white' : 'text-slate-600 group-hover:text-indigo-400'} transition-colors`}>{icon}</div>
    <span className="font-black text-xs uppercase tracking-widest">{label}</span>
  </button>
);

const DashboardStat = ({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) => (
  <div className="bg-slate-900/40 border border-slate-900 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-xl hover:bg-slate-900/60 transition-all group">
    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">{label}</p>
    <h4 className="text-2xl lg:text-4xl font-black text-white mt-2 tracking-tight">{value}</h4>
    <p className="text-[8px] lg:text-[10px] font-black text-slate-700 mt-2.5 uppercase tracking-widest flex items-center gap-2">
      <span className="w-1 h-1 rounded-full bg-indigo-500"></span> {trend}
    </p>
  </div>
);

export default StudentPortal;
