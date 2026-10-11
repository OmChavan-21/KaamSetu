import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Send, Languages, Globe, MessageSquare } from 'lucide-react';

export function JobChatModal() {
  const { activeChatJob, setActiveChatJob, role, language } = useApp();
  
  if (!activeChatJob) return null;
  const job = activeChatJob;

  const [messages, setMessages] = useState(job.messages || []);
  const [input, setInput] = useState('');
  const [showTranslated, setShowTranslated] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch latest messages from server
  useEffect(() => {
    if (job?.id) {
      fetch(`/api/jobs/${job.id}/messages`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            setMessages(data);
          } else if (job.messages && job.messages.length > 0) {
            setMessages(job.messages);
          }
        })
        .catch(console.error);
    }
  }, [job?.id]);

  const handleSend = async (customText, customTranslated) => {
    const textToSend = (customText || input).trim();
    if (!textToSend) return;

    setSending(true);
    const sender = role === 'worker' ? 'worker' : 'employer';
    const senderName = role === 'worker' ? job.workerName : job.employerName;
    const targetLang = role === 'worker' ? 'en' : 'mr';

    try {
      const res = await fetch(`/api/jobs/${job.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender,
          senderName,
          text: textToSend,
          targetLang
        })
      });

      if (res.ok) {
        const savedMsg = await res.json();
        setMessages(prev => [...prev, savedMsg]);
        setInput('');
      } else {
        // Fallback local message
        const fallbackMsg = {
          id: `msg-${Date.now()}`,
          sender,
          senderName,
          text: textToSend,
          translatedText: customTranslated || textToSend,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMsg]);
        setInput('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[600px] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center space-x-1.5">
                <span>{role === 'worker' ? job.employerName : job.workerName}</span>
                <span className="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full">
                  {role === 'worker' ? 'Employer' : job.trade}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Gig: {job.title}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Auto-Translate Toggle */}
            <button
              onClick={() => setShowTranslated(!showTranslated)}
              className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-xl border transition cursor-pointer ${
                showTranslated
                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 font-bold'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle Live Marathi/Hindi Auto-Translation"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{showTranslated ? 'Auto-Translate ON' : 'Translate OFF'}</span>
            </button>

            <button
              onClick={() => setActiveChatJob(null)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Translation Banner */}
        <div className="bg-emerald-50 px-4 py-2 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
          <span className="flex items-center">
            <Globe className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Chat mode: You are sending as <strong className="ml-1 text-emerald-800">{role === 'worker' ? 'Worker' : 'Employer'}</strong>
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50">
          {messages.map((m) => {
            const isMe = (role === 'worker' && m.sender === 'worker') || (role !== 'worker' && m.sender === 'employer');

            return (
              <div
                key={m.id || Math.random()}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-3.5 shadow-sm text-xs ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  <div className="flex items-center justify-between mb-1 opacity-75 text-[10px]">
                    <span className="font-bold">{isMe ? 'You' : m.senderName}</span>
                    <span className="ml-2">{m.time}</span>
                  </div>

                  <p className="font-semibold text-sm">{m.text}</p>

                  {showTranslated && m.translatedText && m.translatedText !== m.text && (
                    <div className={`mt-2 pt-1.5 border-t text-[11px] font-normal italic ${
                      isMe ? 'border-emerald-500/50 text-emerald-100' : 'border-slate-100 text-emerald-800'
                    }`}>
                      🌐 <em>{m.translatedText}</em>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Phrase Chips */}
        <div className="p-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">Quick:</span>
          {[
            { en: "Please bring your 10mm drill", mr: "कृपया तुमचा 10mm ड्रिल सोबत आणा" },
            { en: "I have arrived at the location", mr: "मी कामाच्या ठिकाणी पोहोचलो आहे" },
            { en: "Work is completed, please inspect", mr: "काम पूर्ण झाले आहे, कृपया तपासून घ्या" },
            { en: "Payment sent via UPI", mr: "युपीआय द्वारे पैसे पाठवले आहेत" }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(role === 'worker' ? item.mr : item.en, role === 'worker' ? item.en : item.mr)}
              className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg border border-slate-200 whitespace-nowrap text-xs transition cursor-pointer"
            >
              {role === 'worker' ? item.mr : item.en}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !sending && handleSend()}
            placeholder={role === 'worker' ? "मराठी किंवा हिंदीत संदेश टाइप करा..." : "Type message in English, Marathi or Hindi..."}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending}
            className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl shadow-md transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
