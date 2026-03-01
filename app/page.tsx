"use client";

import { useState, useRef, useEffect } from "react";
import { useGeminiChat } from "@/hooks/use-gemini-chat";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import Sidebar from "@/components/layout/Sidebar";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const {
    messages,
    sendMessage,
    isLoading,
    setMessages,
    currentChatId,
    setCurrentChatId,
  } = useGeminiChat();
  const [input, setInput] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [allChats, setAllChats] = useState<{ id: string; title: string }[]>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("gemini_chat_titles");
        return saved ? JSON.parse(saved) : [];
      }
      return [];
    },
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  // --- ERROR FIX: currentChatTitle yahan define hona chahiye ---
  const currentChatTitle = allChats.find(
    (chat) => chat.id === currentChatId,
  )?.title;

  const { isListening, startListening } = useSpeechToText((transcript) => {
    setInput((prev) => prev + (prev ? " " : "") + transcript);
  });

  useEffect(() => {
    localStorage.setItem("gemini_chat_titles", JSON.stringify(allChats));
  }, [allChats]);

  useEffect(() => {
    if (currentChatId && messages.length > 0) {
      localStorage.setItem(
        `chat_content_${currentChatId}`,
        JSON.stringify(messages),
      );
    }
  }, [messages, currentChatId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEditMessage = (oldContent: string) => setInput(oldContent);

  const handleSelectChat = (id: string) => {
    const savedMessages = localStorage.getItem(`chat_content_${id}`);
    if (savedMessages) {
      setCurrentChatId?.(id);
      setMessages(JSON.parse(savedMessages));
      setIsSidebarOpen(false);
    }
  };

  const onSubmit = (e: React.FormEvent, files?: File[]) => {
    e.preventDefault();
    if ((!input.trim() && (!files || files.length === 0)) || isLoading) return;
    sendMessage(input, files, (id, title) => {
      setAllChats((prev) => [{ id, title }, ...prev]);
    });
    setInput("");
  };

  return (
    <div className="flex h-screen bg-[#0e0e0e] text-white overflow-hidden font-sans relative">
      {/* SIDEBAR */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] transform transition-transform duration-300 ease-in-out bg-[#171717] md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar
          onNewChat={() => {
            setMessages([]);
            setCurrentChatId?.("");
            setIsSidebarOpen(false);
          }}
          chatHistory={allChats}
          activeChatId={currentChatId || undefined}
          onSelectChat={handleSelectChat}
          onDeleteChat={(id) => {
            setAllChats((prev) => prev.filter((c) => c.id !== id));
            if (currentChatId === id) {
              setMessages([]);
              setCurrentChatId?.("");
            }
          }}
        />
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute right-4 top-4 p-2 md:hidden text-gray-400"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        <header className="flex items-center justify-between px-4 md:px-6 py-3 h-[60px] shrink-0 border-b border-white/5 bg-[#0e0e0e] z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 md:hidden text-gray-400"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-bold text-lg md:text-xl text-gray-200">
              CHAT AI
            </div>
          </div>

          {/* Yahan currentChatTitle use ho raha hai jo ab upar define ho gaya hai */}
          {currentChatTitle && (
            <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-1">
              <span className="text-gray-200 font-medium text-[14px] truncate max-w-[120px] lg:max-w-md">
                {currentChatTitle}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-purple-600 border border-white/10" />
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto custom-scrollbar relative px-4 md:px-0"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 85%, transparent 100%)",
          }}
        >
          <div className="py-6 md:py-8 max-w-3xl lg:max-w-4xl mx-auto w-full">
            {messages.length === 0 ? (
              <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-2">
                  <span className="bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent animate-gradient">
                    Hello, Furqan
                  </span>
                </h1>
                <h1 className="text-3xl md:text-5xl font-semibold text-[#444746]">
                  Where should we start?
                </h1>
              </div>
            ) : (
              messages.map((m, i) => (
                <MessageBubble
                  key={i}
                  role={m.role as "user" | "model"}
                  content={m.content}
                  onEdit={handleEditMessage}
                />
              ))
            )}
            <div className="h-32" />
          </div>
        </div>

        <div className="w-full bg-[#0e0e0e]/95 backdrop-blur-md pt-2 pb-6 md:pb-10 shrink-0 z-20">
          <div className="max-w-3xl mx-auto">
            <ChatInput
              value={input}
              onChange={(e: any) => setInput(e.target.value)}
              onSubmit={onSubmit}
              disabled={isLoading}
              onMicClick={startListening}
              isListening={isListening}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
