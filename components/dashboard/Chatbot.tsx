
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, MapPin, ExternalLink, Info } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Button } from '../ui/Button';

interface Message {
  role: 'assistant' | 'user';
  text: string;
  metadata?: {
    mapsLinks?: Array<{ title: string; uri: string }>;
  };
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Hello! I am your MMIS AI assistant. I can help with system navigation and market location queries. How can I assist you?' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Heuristic to check if this is a location/map query
      const isLocationQuery = /map|where|location|address|find|market|city|get to|directions/i.test(userMsg);
      
      const modelName = isLocationQuery ? 'gemini-2.5-flash' : 'gemini-3-pro-preview';
      const config: any = isLocationQuery 
        ? { tools: [{ googleMaps: {} }] } 
        : { systemInstruction: "You are MMIS Assistant. Professional, concise, helpful." };

      const response = await ai.models.generateContent({
        model: modelName,
        contents: `The user is interacting with MMIS (Multi-Vendor E-commerce Management System). Provide helpful, professional, and short support answers. User query: ${userMsg}`,
        config: config
      });
      
      let mapsLinks: any[] = [];
      if (isLocationQuery) {
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
          mapsLinks = chunks
            .filter((c: any) => c.maps)
            .map((c: any) => ({
              title: c.maps.title || "View on Google Maps",
              uri: c.maps.uri
            }));
        }
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: response.text || "I found some details about that location.", 
        metadata: mapsLinks.length > 0 ? { mapsLinks } : undefined
      }]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform animate-bounce-subtle"
        >
          <Bot size={28} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
        </button>
      ) : (
        <div className="w-80 md:w-96 h-[550px] bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-fade-in">
          <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shadow-lg relative z-10">
            <div className="flex items-center gap-3">
              <Bot size={24} />
              <div>
                <h3 className="font-bold text-sm">MMIS Intelligence</h3>
                <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Support & Mapping AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col gap-1 max-w-[85%]">
                  <div className={`p-3 rounded-2xl text-[11px] leading-relaxed shadow-sm ${
                    msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
                  }`}>
                    <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                      {msg.role === 'user' ? <User size={10} /> : <Sparkles size={10} />}
                      <span className="font-black uppercase tracking-widest text-[8px]">{msg.role}</span>
                    </div>
                    {msg.text}

                    {msg.metadata?.mapsLinks && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <MapPin size={10}/> Location Anchors
                        </p>
                        {msg.metadata.mapsLinks.map((link, idx) => (
                          <a 
                            key={idx} 
                            href={link.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 bg-indigo-50 rounded-lg text-indigo-700 hover:bg-indigo-100 transition-colors group"
                          >
                            <span className="font-bold truncate pr-2">{link.title}</span>
                            <ExternalLink size={12} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">AI Thinking</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <input 
                placeholder="Ask about system help or market directions..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400 font-medium"
              />
              <button 
                type="submit" 
                disabled={isTyping}
                className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
