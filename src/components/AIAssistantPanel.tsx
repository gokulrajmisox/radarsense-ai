import { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIAssistantPanel() {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    "When did the danger move today?",
    "Show me today's summary",
    "What time is the most active period?",
    "Explain the latest event"
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      // Create some mock context for the AI
      const context = {
        totalEventsToday: 12,
        currentStatus: "SAFE",
        lastEvent: "Movement detected at 08:45 AM, 78cm away",
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, context })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error communicating with Gemini." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Network error occurred." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[400px]">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-purple-50/50">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-600" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            RadarSense AI
          </span>
        </h2>
        <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-200 shadow-sm">
          <Sparkles className="w-3 h-3 text-purple-500" />
          Gemini Powered
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70">
            <BrainCircuit className="w-12 h-12 text-slate-300 mb-3" />
            <p className="text-sm text-slate-500 mb-6 max-w-[200px]">Ask anything about your radar data and sensor events.</p>
            <div className="flex flex-col gap-2 w-full max-w-[250px]">
              {suggestedQuestions.map(q => (
                <button 
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-white border border-slate-200 text-slate-600 py-2 px-3 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            
            <AnimatePresence>
              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-3 border-t border-slate-100 bg-white">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="relative flex items-center"
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg disabled:opacity-50 transition-opacity hover:shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
