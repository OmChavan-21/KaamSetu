import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  X, 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  Bot
} from 'lucide-react';

export function KaamSetuSaathi() {
  const { 
    showAiAssistant, 
    setShowAiAssistant, 
    runAiMatch, 
    setFilters, 
    language, 
    t 
  } = useApp();

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: language === 'mr' 
        ? "नमस्कार! मी कामसेतू साथी आहे. तुम्हाला कोणत्या कामासाठी कुशल कारागीर हवा आहे? (उदा. 'मला कोथरूड मध्ये उद्यासाठी 600 रुपयांपर्यंत इलेक्ट्रिशियन हवा आहे')"
        : language === 'hi'
        ? "नमस्ते! मैं कामसेतू साथी हूँ। आपको किस काम के लिए कारीगर चाहिए? (उदा. 'मुझे कोथरूड में कल के लिए 600 रुपये तक इलेक्ट्रीशियन चाहिए')"
        : "Hello! I am KaamSetu Saathi. Tell me what worker you need in Pune, in English, Marathi, or Hindi! (e.g. 'Need an electrician in Kothrud tomorrow under ₹650')",
      filters: null
    }
  ]);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speech Recognition Setup (Web Speech API)
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = false;
        reco.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        
        reco.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          handleSend(transcript);
          setIsListening(false);
        };

        reco.onerror = (e) => {
          setIsListening(false);
          console.log('Speech recognition notice:', e.error);
        };
        reco.onend = () => setIsListening(false);
        recognitionRef.current = reco;
      }
    }
  }, [language]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "Voice speech input is supported in Google Chrome & Edge browsers. You can also type your request directly here in Marathi, Hindi, or English!"
      }]);
      return;
    }

    if (isListening) {
      try { recognitionRef.current.stop(); } catch {}
      setIsListening(false);
    } else {
      try {
        setIsListening(true);
        recognitionRef.current.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  // Text to Speech playback
  const speakText = (text) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (messageToSend) => {
    const text = (messageToSend || input).trim();
    if (!text) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language })
      });

      if (res.ok) {
        const data = await res.json();
        
        setMessages(prev => [...prev, {
          sender: 'ai',
          text: data.responseText,
          filters: data.filters
        }]);

        // Auto speak response
        speakText(data.responseText);

        // If trade was detected, update search filters and run AI Match!
        if (data.filters && data.filters.trade) {
          setFilters(prev => ({
            ...prev,
            trade: data.filters.trade,
            location: data.filters.location !== 'Pune' ? data.filters.location : prev.location,
            maxWage: data.filters.budget || prev.maxWage,
            search: data.filters.needDescription || ''
          }));

          runAiMatch({
            trade: data.filters.trade,
            location: data.filters.location,
            budget: data.filters.budget,
            needDescription: data.filters.needDescription
          });
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "I am ready to help. Please tell me your requirements!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!showAiAssistant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full h-[620px] max-h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white">KaamSetu Saathi</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  मराठी • हिंदी • English
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Multilingual Voice & Intent Match Assistant</p>
            </div>
          </div>

          <button
            onClick={() => setShowAiAssistant(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs font-medium leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
              }`}>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="font-bold text-[10px] opacity-70">
                    {m.sender === 'user' ? 'You' : 'KaamSetu AI'}
                  </span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => speakText(m.text)}
                      title="Listen via Text-to-Speech"
                      className="text-slate-400 hover:text-emerald-600 cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-sm font-normal">{m.text}</p>

                {/* Filter tags applied by AI */}
                {m.filters && m.filters.trade && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px]">
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                      Trade: {m.filters.trade}
                    </span>
                    <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-bold">
                      Location: {m.filters.location}
                    </span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-bold">
                      Budget: ₹{m.filters.budget}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl p-3 border border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>KaamSetu Saathi is finding the best matches...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestions Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          <span className="text-slate-400 font-bold shrink-0">Try:</span>
          {[
            "Need an electrician in Kothrud for ₹650",
            "मला कोथरूड मध्ये उद्यासाठी इलेक्ट्रिशियन हवा आहे",
            "मुझे पाइप लीकेज ठीक करने के लिए प्लंबर चाहिए"
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(prompt);
                handleSend(prompt);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 rounded-lg border border-slate-200 whitespace-nowrap transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar with Voice Mic */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
          {/* Voice Input Button with Speech Recognition */}
          <button
            onClick={toggleVoice}
            className={`p-3 rounded-2xl transition cursor-pointer flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title="Speak in Marathi, Hindi or English"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-emerald-600" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening... बोलिये / बोला..." : t('aiPromptPlaceholder')}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl shadow-md transition cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
