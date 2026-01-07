
import React, { useState } from 'react';
import { Cpu, Palette, FlaskConical, Briefcase, ChevronRight, X, BookOpen, UserCheck, ClipboardCheck, ArrowRight } from 'lucide-react';
import { Program } from '../types';

const programs: Program[] = [
  {
    id: '1',
    title: 'Computer Science & AI',
    category: 'Engineering',
    description: 'Master the fundamentals of computing and dive deep into artificial intelligence and machine learning.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    duration: '4 Years',
    faculty: [
      { name: 'Dr. Sarah Chen', title: 'Head of AI Research', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' },
      { name: 'Prof. Marcus Thorne', title: 'Robotics Specialist', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' }
    ],
    curriculum: ['Neural Networks & Deep Learning', 'Algorithm Design & Complexity', 'Distributed Systems', 'Natural Language Processing'],
    prerequisites: ['Advanced Mathematics (Calculus & Linear Algebra)', 'Proficiency in Python or C++', 'High School Physics']
  },
  {
    id: '2',
    title: 'Digital Arts & Design',
    category: 'Arts',
    description: 'Explore the intersection of traditional aesthetics and modern digital toolsets for visual storytelling.',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    duration: '3 Years',
    faculty: [
      { name: 'Elena Rodriguez', title: 'Creative Director', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
      { name: 'Julian Vane', title: 'Motion Graphics Lead', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }
    ],
    curriculum: ['Visual Communication Theory', '3D Modeling & Animation', 'UI/UX Design Systems', 'Digital Cinematography'],
    prerequisites: ['Creative Portfolio Submission', 'Basic Graphic Design Principles', 'Visual Literacy Assessment']
  },
  {
    id: '3',
    title: 'Biomedical Science',
    category: 'Science',
    description: 'Pioneer the future of healthcare through advanced laboratory research and clinical studies.',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&q=80&w=800',
    duration: '4 Years',
    faculty: [
      { name: 'Dr. Michael Bloom', title: 'Geneticist', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { name: 'Dr. Anya Petrov', title: 'Cellular Biologist', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200' }
    ],
    curriculum: ['Molecular Genetics', 'Pharmacology & Toxicology', 'Bioinformatics', 'Immunology'],
    prerequisites: ['Chemistry & Biology AP Scores', 'Lab Safety Certification', 'Quantitative Methods']
  },
  {
    id: '4',
    title: 'International Business',
    category: 'Business',
    description: 'Develop global strategies and leadership skills needed for the modern multi-national economy.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800',
    duration: '3 Years',
    faculty: [
      { name: 'Sofia Moretti', title: 'Global Markets Strategist', image: 'https://images.unsplash.com/photo-1567532939103-c95aee17e5a8?auto=format&fit=crop&q=80&w=200' },
      { name: 'David Ghandi', title: 'Venture Capitalist', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' }
    ],
    curriculum: ['Cross-Cultural Management', 'Global Supply Chain Logistics', 'Entrepreneurial Finance', 'Digital Marketing Strategy'],
    prerequisites: ['Economics Fundamentals', 'English Proficiency (C1 level)', 'Leadership Aptitude Test']
  }
];

const categoryIcons: Record<string, React.ReactNode> = {
  Engineering: <Cpu className="w-5 h-5" />,
  Arts: <Palette className="w-5 h-5" />,
  Science: <FlaskConical className="w-5 h-5" />,
  Business: <Briefcase className="w-5 h-5" />,
};

const Programs: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const closeModal = () => setSelectedProgram(null);

  const handleApply = () => {
    alert(`Redirecting to ${selectedProgram?.title} application portal...`);
  };

  return (
    <section className="py-24 bg-slate-50 reveal" id="programs">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Academic Excellence</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-2">World-Class Programs</h2>
            <p className="text-slate-600 mt-4 leading-relaxed">Choose from over 150 accredited programs designed to help you achieve your professional goals.</p>
          </div>
          <button 
            onClick={() => alert('Opening full course catalog...')}
            className="flex items-center gap-2 text-indigo-600 font-bold hover:underline"
          >
            View all courses <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:-translate-y-2 flex flex-col h-full cursor-pointer"
              onClick={() => setSelectedProgram(program)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-slate-800">
                  {categoryIcons[program.category]}
                  {program.category}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{program.duration} Program</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{program.title}</h3>
                <p className="text-sm text-slate-500 mb-6 flex-1 leading-relaxed">{program.description}</p>
                <button className="w-full py-3 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white rounded-xl text-slate-800 font-bold transition-all text-sm">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            {/* Modal Header/Image */}
            <div className="relative h-48 md:h-64 shrink-0">
              <img src={selectedProgram.image} alt={selectedProgram.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all z-20"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-8 left-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500 text-[10px] font-black uppercase tracking-widest border border-indigo-400">
                    {selectedProgram.category}
                  </span>
                  <span className="text-sm font-bold opacity-80">{selectedProgram.duration}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">{selectedProgram.title}</h2>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-10">
                  <section>
                    <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 mb-4 tracking-tight">
                      <BookOpen className="text-indigo-600" size={24} />
                      Curriculum Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedProgram.curriculum.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                          <span className="text-sm font-bold text-slate-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 mb-4 tracking-tight">
                      <UserCheck className="text-indigo-600" size={24} />
                      Lead Faculty
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {selectedProgram.faculty.map((member, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                          <img src={member.image} alt={member.name} className="w-14 h-14 rounded-xl object-cover" />
                          <div>
                            <p className="font-extrabold text-slate-900 leading-none mb-1">{member.name}</p>
                            <p className="text-xs text-slate-500 font-medium">{member.title}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Column: Prerequisites & CTA */}
                <div className="space-y-8">
                  <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <h3 className="flex items-center gap-2 text-lg font-black text-indigo-900 mb-4 tracking-tight">
                      <ClipboardCheck size={20} />
                      Prerequisites
                    </h3>
                    <ul className="space-y-4">
                      {selectedProgram.prerequisites.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-black text-indigo-700">{idx + 1}</span>
                          </div>
                          <span className="text-sm text-indigo-800 leading-snug font-medium">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={handleApply}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 group"
                  >
                    Apply Now
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  
                  <p className="text-center text-xs text-slate-400 font-medium">
                    Questions? Chat with our <span className="text-indigo-600 font-bold">AI Advisor</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Programs;
