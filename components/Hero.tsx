
import React from 'react';
import { ArrowRight, GraduationCap, Globe, Zap, Star } from 'lucide-react';

const Hero: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset for navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-slate-50">
      {/* Animated Background Elements */}
      <div className="absolute top-0 -left-12 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 -right-12 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-12 left-24 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left reveal">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-sm font-bold mb-8 animate-bounce shadow-sm border border-indigo-200/50">
              <Zap size={16} fill="currentColor" />
              <span>Applications Open for Fall 2025</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] text-slate-900 mb-8 tracking-tight">
              Ignite Your Future at <span className="text-gradient">Lumina</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Join a world-renowned community of disruptors, visionaries, and leaders who are reshaping the frontier of technology and art.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5">
              <button 
                onClick={() => handleScrollTo('apply')}
                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-1 group"
              >
                Apply Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => handleScrollTo('programs')}
                className="w-full sm:w-auto px-10 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-md hover:-translate-y-1"
              >
                Explore Programs
              </button>
            </div>
            
            <div className="mt-14 flex flex-wrap items-center justify-center lg:justify-start gap-10 opacity-80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Globe className="text-indigo-600" size={20} />
                </div>
                <span className="font-semibold text-slate-700">50+ Global Partners</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <GraduationCap className="text-indigo-600" size={20} />
                </div>
                <span className="font-semibold text-slate-700">98% Placement Rate</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative reveal animation-delay-500">
            <div className="relative z-10 w-full max-w-lg lg:max-w-xl mx-auto">
              {/* Image Border/Glow */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur-xl"></div>
              
              <div className="relative overflow-hidden rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border-8 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200" 
                  alt="Lumina Institute Main Campus" 
                  className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-1000"
                  fetchPriority="high"
                />
                
                {/* Floating Ranking Card inside image context for better visual anchor */}
                <div className="absolute bottom-6 left-6 right-6">
                   <div className="glass p-5 rounded-2xl shadow-2xl border-white/50 backdrop-blur-md flex items-center gap-4 animate-float">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                        <span className="font-extrabold text-xl tracking-tight">A+</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-0.5">
                          {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />)}
                        </div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">QS World Ranking</p>
                        <p className="text-lg font-bold text-slate-900 leading-none">Top 1% Global</p>
                      </div>
                   </div>
                </div>
              </div>
              
              {/* Extra Floating decorative card */}
              <div className="hidden lg:block absolute -top-10 -right-8 glass p-6 rounded-2xl shadow-2xl border-white/50 backdrop-blur-lg animate-float animation-delay-2000">
                 <div className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-black text-indigo-600">#4</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">In AI Research<br/>Nationwide</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
