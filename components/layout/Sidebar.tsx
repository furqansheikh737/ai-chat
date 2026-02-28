'use client';

import { Plus, MessageSquare, User, Settings, LogOut, MoreHorizontal } from 'lucide-react';

interface SidebarProps {
  onNewChat: () => void;
  chatHistory?: { id: string; title: string }[];
}

export default function Sidebar({ onNewChat, chatHistory = [] }: SidebarProps) {
  // Demo history agar data pass nahi ho raha
  const displayHistory = chatHistory.length > 0 ? chatHistory : [
    { id: '1', title: 'Modern Web App Logic' },
    { id: '2', title: 'Gemini API Integration' },
    { id: '3', title: 'Tailwind CSS Tips' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-full bg-[#171717] text-gray-200 border-r border-white/5 transition-all duration-300 ease-in-out">
      
      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="flex items-center gap-3 w-full p-3 rounded-lg border border-white/10 hover:bg-[#2c2c2c] transition-colors duration-200 group"
        >
          <Plus className="w-4 h-4 text-gray-400 group-hover:text-white" />
          <span className="text-sm font-medium">New Chat</span>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 custom-scrollbar">
        <div className="mt-4 mb-2 px-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
          Recent Conversations
        </div>
        
        {displayHistory.map((chat) => (
          <button
            key={chat.id}
            className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-[#2c2c2c] transition-colors group text-left overflow-hidden whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="text-sm text-gray-300 truncate group-hover:text-white">
              {chat.title}
            </span>
          </button>
        ))}
      </div>

      {/* Footer / User Profile */}
      <div className="p-3 border-t border-white/5 bg-[#171717]">
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2c2c2c] cursor-pointer transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">John Doe</span>
              <span className="text-[10px] text-gray-500 group-hover:text-gray-400 italic">Pro Plan</span>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </div>
      </div>
    </aside>
  );
}