'use client';

import { useState, useRef, useEffect } from 'react';
import { useGeminiChat } from '@/hooks/use-gemini-chat';
import MessageBubble from '@/components/chat/MessageBubble';
import ChatInput from '@/components/chat/ChatInput';
import Sidebar from '@/components/layout/Sidebar';
import { Image as ImageIcon, Music, PenLine, Rocket, GraduationCap } from 'lucide-react';

export default function Home() {
  const { messages, sendMessage, isLoading, setMessages } = useGeminiChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-white overflow-hidden font-sans">
      <Sidebar onNewChat={() => setMessages([])} />

      <main className="flex-1 flex flex-col relative h-full">
        <div 
          ref={scrollRef} 
          className="flex-1 overflow-y-auto custom-scrollbar pb-40"
        >
          {messages.length === 0 ? (
            /* --- LANDING PAGE SECTION --- */
            <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto px-4 animate-in fade-in duration-700">
              
              {/* Welcome Header */}
              <div className="w-full mb-10">
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
                  <span className="bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent animate-gradient">
                    Hello, User
                  </span>
                </h1>
                <h2 className="text-4xl md:text-5xl font-medium text-[#fff]">
                  Where should we start?
                </h2>
              </div>

              {/* Action Suggestion Chips (Gemini Style) */}
              <div className="flex flex-wrap gap-3 w-full animate-in slide-in-from-bottom-4 duration-1000">
                {[
                  { icon: <ImageIcon className="w-4 h-4 text-[#c4eed0]" />, label: "Create image" },
                  { icon: <Music className="w-4 h-4 text-[#c2e7ff]" />, label: "Create music" },
                  { icon: <PenLine className="w-4 h-4 text-[#fce293]" />, label: "Write anything" },
                  { icon: <Rocket className="w-4 h-4 text-[#e8eaed]" />, label: "Boost my day" },
                  { icon: <GraduationCap className="w-4 h-4 text-[#d7aefb]" />, label: "Help me learn" },
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setInput(item.label)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1e1e1e] border border-[#333537] hover:bg-[#282a2c] transition-colors text-[14px] text-gray-200"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* --- CHAT MESSAGES SECTION --- */
            <div className="py-8">
              {messages.map((m, i) => (
                <MessageBubble 
                  key={i} 
                  role={m.role as 'user' | 'model' | 'system'} 
                  content={m.content} 
                />
              ))}
            </div>
          )}
        </div>

        {/* --- INPUT AREA (STAYS AT BOTTOM) --- */}
        <div className="fixed bottom-0 left-0 md:left-auto md:right-0 w-full md:w-[calc(100%-256px)] bg-[#0e0e0e] pb-6 pt-4">
          <ChatInput 
            value={input} 
            onChange={(e: any) => setInput(e.target.value)} 
            onSubmit={onSubmit} 
            disabled={isLoading} 
          />
        </div>
      </main>
    </div>
  );
}