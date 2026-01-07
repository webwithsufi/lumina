import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Bot, User, Sparkles, Minus, Loader2 } from 'lucide-react';
import { getGeminiResponse } from '../services/geminiService';
import { Message } from '../types';

const AICounselor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to Lumina Institute! I'm your AI Academic Advisor. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await getGeminiResponse(input);
    
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && !isMinimized && (
        <div className="w-[calc(100vw-2rem)] md:w-96 h-[550px] mb-4 dark-glass rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="p-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <p className="font-bold tracking-tight text-lg leading-none">Lumina Advisor</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Online AI Expert</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Minus className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-indigo-500 text-white rounded-2xl rounded-tr-none shadow-lg' 
                    : 'bg-slate-800 text-slate-100 rounded-2xl rounded-tl-none border border-slate-700 shadow-xl'
                } p-4 text-sm relative group`}>
                  <div className={`flex items-center gap-2 mb-2 opacity-60 text-[10px] uppercase font-black tracking-widest`}>
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                    {msg.role === 'user' ? 'Applicant' : 'LuminaGPT'}
                  </div>
                  <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-700 shadow-xl flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">Advisor is thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-5 bg-slate-900/50 backdrop-blur-md border-t border-slate-800/50 shrink-0">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-[10px] text-center mt-3 text-slate-500 font-medium">Powered by Gemini AI Technology</p>
          </div>
        </div>
      )}

      {isMinimized && isOpen && (
        <button 
          onClick={() => setIsMinimized(false)}
          className="bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl mb-4 flex items-center gap-3 hover:scale-105 transition-all border border-indigo-400/30"
        >
          <Bot size={20} />
          <span className="text-sm font-bold tracking-tight">Academic Advisor</span>
        </button>
      )}

      <button
        onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              setIsMinimized(false);
            } else {
              setIsOpen(false);
            }
        }}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all active:scale-90 group relative ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-indigo-600 hover:scale-110'}`}
      >
        {!isOpen && <div className="absolute inset-0 bg-indigo-400 rounded-2xl animate-ping opacity-25"></div>}
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </div>
  );
};

export default AICounselor;