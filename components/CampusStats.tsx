
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, BookOpen, Award, Building2 } from 'lucide-react';

const data = [
  { name: '2020', students: 4500, color: '#6366f1' },
  { name: '2021', students: 5200, color: '#818cf8' },
  { name: '2022', students: 6100, color: '#a5b4fc' },
  { name: '2023', students: 7800, color: '#c7d2fe' },
  { name: '2024', students: 9500, color: '#4f46e5' },
];

const CampusStats: React.FC = () => {
  return (
    <section className="py-24 bg-white reveal" id="stats">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Lumina in Numbers</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Our growth reflects our commitment to excellence and innovation in higher education.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-6">
            <StatCard icon={<Users className="w-6 h-6" />} label="Total Students" value="12k+" description="Growing every year" />
            <StatCard icon={<BookOpen className="w-6 h-6" />} label="Courses" value="150+" description="Accredited programs" />
            <StatCard icon={<Award className="w-6 h-6" />} label="Research Papers" value="850" description="In top-tier journals" />
            <StatCard icon={<Building2 className="w-6 h-6" />} label="Campuses" value="4" description="Across 3 continents" />
          </div>

          <div className="glass p-8 rounded-3xl h-[400px] shadow-lg border-indigo-50">
            <h3 className="text-xl font-bold mb-6 text-slate-800">Student Enrollment Trend</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, description }) => (
  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-xl transition-all group">
    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h4 className="text-3xl font-bold text-slate-900 mb-1">{value}</h4>
    <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">{label}</p>
    <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
  </div>
);

export default CampusStats;
