
import React, { useEffect, useState, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CampusStats from './components/CampusStats';
import Programs from './components/Programs';
import USPSection from './components/USPSection';
import AICounselor from './components/AICounselor';
import StudentPortal from './components/StudentPortal';
import AdminPortal from './components/AdminPortal';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Linkedin, ExternalLink, Sparkles, CheckCircle2, Shield } from 'lucide-react';

type ViewState = 'landing' | 'student-portal' | 'admin-portal';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  // Intersection Observer Initialization
  const initObserver = useCallback(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return observer;
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    if (currentView === 'landing') {
      observer = initObserver();
    }
    return () => observer?.disconnect();
  }, [currentView, initObserver]);

  const handlePlaceholderClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // View Switcher logic
  if (currentView === 'student-portal') {
    return <StudentPortal onClose={() => setCurrentView('landing')} />;
  }

  if (currentView === 'admin-portal') {
    return <AdminPortal onClose={() => setCurrentView('landing')} />;
  }

  return (
    <div className="relative animate-in fade-in duration-500">
      <Navbar onOpenPortal={() => setCurrentView('student-portal')} />
      
      <main>
        <Hero />

        <USPSection />
        
        <Programs />
        
        <section id="apply" className="py-24 bg-indigo-900 text-white relative overflow-hidden reveal">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-400 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-8 leading-tight">Ready to Transform Your Potential?</h2>
            <p className="text-lg md:text-xl text-indigo-100 mb-12 max-w-2xl mx-auto opacity-90">
              Applications for the Fall 2025 cohort are now open. Secure your place at the forefront of global innovation.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => alert('Application system opening...')}
                className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black text-lg hover:bg-indigo-50 transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                Apply Today
              </button>
              <button 
                onClick={() => alert('Prospectus download started...')}
                className="px-10 py-5 border-2 border-indigo-400 text-white rounded-2xl font-black text-lg hover:bg-indigo-800 transition-all"
              >
                Request Prospectus
              </button>
            </div>
          </div>
        </section>

        <CampusStats />

        <section className="py-24 bg-white reveal" id="campus">
           <div className="container mx-auto px-6">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                   <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Unrivaled Campus Life</h2>
                   <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                     At Lumina, education goes beyond the classroom. With over 200 student organizations, world-class athletic facilities, and a vibrant arts scene, you'll find countless ways to pursue your passions.
                   </p>
                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                     {['Sustainable Green Campus', '24/7 Innovation Labs', 'Inclusive Community Culture', 'Proximity to Global Tech Hubs'].map((item) => (
                       <li key={item} className="flex items-center gap-3 font-semibold text-slate-700">
                         <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />
                         <span className="text-sm md:text-base">{item}</span>
                       </li>
                     ))}
                   </ul>
                   <button 
                     onClick={handlePlaceholderClick}
                     className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 font-extrabold rounded-xl hover:bg-indigo-100 transition-all group"
                   >
                     Virtual Campus Tour <ExternalLink size={20} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                    <div className="group overflow-hidden rounded-3xl shadow-xl">
                      <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=800" className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700" alt="Library Hall" loading="lazy" />
                    </div>
                    <div className="group overflow-hidden rounded-3xl shadow-lg">
                      <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" alt="Collaboration" loading="lazy" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="group overflow-hidden rounded-3xl shadow-lg">
                      <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" alt="Lecture Hall" loading="lazy" />
                    </div>
                    <div className="group overflow-hidden rounded-3xl shadow-xl">
                      <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800" className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" alt="Student Life" loading="lazy" />
                    </div>
                  </div>
                </div>
             </div>
           </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-300 py-20 border-t border-slate-900 reveal" id="contact">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <a href="#" onClick={scrollToTop} className="flex items-center gap-2 text-3xl font-black tracking-tighter text-white mb-6 hover:scale-105 transition-transform inline-flex">
                <Sparkles className="fill-indigo-500 text-indigo-500" />
                <span>LUMINA</span>
              </a>
              <p className="text-slate-400 leading-relaxed mb-8">
                Redefining the university experience through technology, empathy, and innovation since 1998. Join us on our journey to change the world.
              </p>
              <div className="flex gap-4">
                {[Instagram, Twitter, Facebook, Linkedin].map((Icon, idx) => (
                  <a key={idx} href="#" onClick={handlePlaceholderClick} className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
              <button 
                onClick={() => setCurrentView('admin-portal')}
                className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-400 transition-all group"
              >
                <Shield size={14} className="group-hover:rotate-12 transition-transform" /> Admin Access
              </button>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-1 after:bg-indigo-500 after:rounded-full">Quick Links</h4>
              <ul className="space-y-4">
                {['About Us', 'Academic Calendar', 'Careers', 'Alumni Association', 'News & Events', 'Campus Safety'].map(link => (
                  <li key={link}>
                    <a href="#" onClick={handlePlaceholderClick} className="hover:text-white transition-colors flex items-center gap-2 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-1 after:bg-indigo-500 after:rounded-full">Resources</h4>
              <ul className="space-y-4">
                {['Student Handbook', 'Library Services', 'IT Support', 'Canvas LMS', 'Financial Aid', 'Housing Portal'].map(link => (
                  <li key={link}>
                    <a href="#" onClick={handlePlaceholderClick} className="hover:text-white transition-colors flex items-center gap-2 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors"></div>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-8 relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-8 after:h-1 after:bg-indigo-500 after:rounded-full">Contact Us</h4>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <MapPin className="text-indigo-500" size={18} />
                  </div>
                  <span className="text-sm leading-relaxed">123 Lumina Heights, Innovation Drive, Silicon Valley, CA 94025</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <Phone className="text-indigo-500" size={18} />
                  </div>
                  <span className="text-sm">+1 (555) 890-2345</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    <Mail className="text-indigo-500" size={18} />
                  </div>
                  <span className="text-sm">admissions@lumina.edu</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
            <p>© 2024 Lumina Institute of Technology. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" onClick={handlePlaceholderClick} className="hover:text-slate-300">Privacy Policy</a>
              <a href="#" onClick={handlePlaceholderClick} className="hover:text-slate-300">Terms of Service</a>
              <a href="#" onClick={handlePlaceholderClick} className="hover:text-slate-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      <AICounselor />
    </div>
  );
};

export default App;
