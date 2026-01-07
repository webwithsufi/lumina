
import React from 'react';
import { Microscope, Users, Lightbulb, Rocket, ArrowUpRight } from 'lucide-react';

const usps = [
  {
    title: "Research Excellence",
    description: "Engage in groundbreaking undergraduate research from your first semester. Access $50M+ in annual funding for high-impact projects in AI and Sustainability.",
    icon: <Microscope className="w-8 h-8 text-indigo-500" />,
    stats: "$50M+ Funding",
    bgImage: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Expert Faculty",
    description: "Learn from Nobel laureates and industry pioneers. Our 1:12 faculty-to-student ratio ensures that you are never just a number in a lecture hall.",
    icon: <Users className="w-8 h-8 text-purple-500" />,
    stats: "1:12 Ratio",
    bgImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Innovation Hive",
    description: "Turn your ideas into impact at our on-campus incubator. We've launched 40+ successful student ventures in the last two academic years.",
    icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
    stats: "40+ Startups",
    bgImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600"
  },
  {
    title: "Career Launchpad",
    description: "Direct pipelines to Silicon Valley and global creative hubs. Our dedicated career coaching continues for life, long after you graduate.",
    icon: <Rocket className="w-8 h-8 text-blue-500" />,
    stats: "98% Placement",
    bgImage: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=600"
  }
];

const USPSection: React.FC = () => {
  const handleAction = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    alert(`Redirecting to ${title} details page...`);
  };

  return (
    <section className="py-24 bg-white overflow-hidden reveal" id="admissions">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 reveal">
          <span className="text-indigo-600 font-black uppercase tracking-[0.2em] text-sm">The Lumina Edge</span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mt-4 tracking-tight">Why Choose Lumina?</h2>
          <p className="text-slate-600 mt-6 max-w-3xl mx-auto text-lg leading-relaxed">
            We don't just provide an education; we provide a transformative ecosystem designed to propel you into the future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {usps.map((usp, idx) => (
            <div 
              key={usp.title} 
              className={`group relative overflow-hidden rounded-[2.5rem] min-h-[400px] flex flex-col justify-end p-8 md:p-12 reveal shadow-2xl transition-all duration-700 hover:-translate-y-2 ${idx % 2 === 0 ? 'animation-delay-200' : 'animation-delay-400'}`}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0">
                <img 
                  src={usp.bgImage} 
                  alt={usp.title} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mb-6 animate-float group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-500">
                  {usp.icon}
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full bg-indigo-600/30 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest border border-indigo-400/30">
                    {usp.stats}
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                  {usp.title}
                </h3>
                
                <p className="text-slate-300 text-lg leading-relaxed mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 max-w-md">
                  {usp.description}
                </p>

                <button 
                  onClick={(e) => handleAction(e, usp.title)}
                  className="flex items-center gap-2 text-white font-bold hover:gap-4 transition-all duration-300 group/btn"
                >
                  Explore Opportunity <ArrowUpRight className="text-indigo-400 group-hover/btn:text-white" />
                </button>
              </div>

              {/* Decorative Corner Element */}
              <div className="absolute top-8 right-8 w-20 h-20 border-t-2 border-r-2 border-white/10 rounded-tr-[2rem] group-hover:border-indigo-500/50 transition-colors duration-500"></div>
            </div>
          ))}
        </div>
        
        {/* Partners Banner */}
        <div className="mt-20 pt-16 border-t border-slate-100 reveal">
          <p className="text-center text-slate-500 font-bold uppercase tracking-[0.2em] text-xs mb-10">Our Graduates Lead at</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <span className="text-2xl font-black tracking-tighter text-slate-900">NVIDIA</span>
             <span className="text-2xl font-black tracking-tighter text-slate-900">ADOBE</span>
             <span className="text-2xl font-black tracking-tighter text-slate-900">SPACE-X</span>
             <span className="text-2xl font-black tracking-tighter text-slate-900">GOOGLE</span>
             <span className="text-2xl font-black tracking-tighter text-slate-900">APPLE</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default USPSection;
