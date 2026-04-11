"use client";
import { useState } from "react";
import { Bot, Send, Loader2 } from "lucide-react";

export default function AIChatPage() {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hello! Ask me any interview question.' }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);



  const handleSend = async () => {
  if (!input) return;
  
  const userMsg = { role: 'user', text: input };
  // Agei message add kore fela
  setMessages(prev => [...prev, userMsg]);
  setInput("");
  setLoading(true);

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // Header add kora bhalo
      body: JSON.stringify({ message: input }),
    });
    
    const data = await res.json();
    
    if (data.reply) {
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } else {
      setMessages(prev => [...prev, { role: 'ai', text: "Error: " + (data.error || "Unknown error") }]);
    }
  } catch (err) {
    setMessages(prev => [...prev, { role: 'ai', text: "Network error!" }]);
  } finally {
    setLoading(false);
  }
};

// ... (uporer handleSend function thakbe)

  return (
    <div className="flex flex-col h-full bg-[#0b141a]">
      <div className="p-4 bg-[#202c33] border-b border-gray-700 flex items-center gap-3">
        <Bot className="text-green-500" />
        <h2 className="text-white font-medium">AI Interviewer</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-lg max-w-[80%] ${m.role === 'ai' ? 'bg-[#2776a3] self-start' : 'bg-[#005c4b] ml-auto text-white'}`}>
            {m.text}
          </div>
        ))}
        {loading && <Loader2 className="animate-spin text-gray-500" />}
      </div>

      {/* Suggestion Buttons */}
      <div className="flex gap-2 p-2 overflow-x-auto bg-[#0b141a]">
        <button 
          onClick={() => { setInput("Give me a 7-day intensive JavaScript learning plan."); }}
          className="text-xs bg-[#2a3942] hover:bg-[#0e3f5a] text-green-500 border border-green-900 px-3 py-1.5 rounded-full whitespace-nowrap"
        >
          📅 7 Days JS Plan
        </button>
        <button 
          onClick={() => { setInput("Explain Next.js Server Components vs Client Components."); }}
          className="text-xs bg-[#2a3942] hover:bg-[#374248] text-blue-400 border border-blue-900 px-3 py-1.5 rounded-full whitespace-nowrap"
        >
          🚀 Next.js Concepts
        </button>
      </div>

      <div className="p-4 bg-[#202c33] flex gap-2">
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()} // Enter chaple message jabe
          className="flex-1 bg-[#2a3942] text-white rounded-lg px-4 py-2 outline-none" 
          placeholder="Type a message..." 
        />
        <button onClick={handleSend} className="bg-green-600 p-3 rounded-full text-white hover:bg-green-700 transition">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}