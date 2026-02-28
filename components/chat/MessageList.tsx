"use client";

import { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { Message } from "@/types/chat"; // Global types ko use karein

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]); // isLoading par bhi scroll check karein

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center opacity-40 select-none">
        <div className="w-12 h-12 mb-6 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
        <h2 className="text-2xl font-light tracking-tight text-white">
          Gemini AI Assistant
        </h2>
        <p className="text-sm mt-2 font-mono italic text-gray-400">
          Start a conversation to see the magic.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {/* Yeh container messages ko center mein rakhega aur width control karega */}
      <div className="max-w-3xl mx-auto px-4 py-8 md:px-0 space-y-8">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            role={message.role}
            content={message.content}
          />
        ))}

        {isLoading && (
          <div className="animate-pulse flex gap-4 px-2">
            {/* Loading state code same rahega */}
          </div>
        )}

        <div ref={messagesEndRef} className="h-32" />
      </div>
    </div>
  );
}
