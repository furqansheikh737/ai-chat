'use client';

import { Plus, MessageSquare, Settings, HelpCircle, History, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onNewChat: () => void;
  chatHistory?: { id: string; title: string }[];
  activeChatId?: string;
  onSelectChat?: (id: string) => void;
  onDeleteChat?: (id: string) => void; // Optional: Chat delete karne ke liye
}

export default function Sidebar({ 
  onNewChat, 
  chatHistory = [], 
  activeChatId, 
  onSelectChat,
  onDeleteChat 
}: SidebarProps) {
  return (
    <aside className="w-[260px] bg-[#1e1e1e] flex flex-col h-full border-r border-white/5 transition-all duration-300 shrink-0">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="flex items-center gap-3 px-4 py-3 w-fit bg-[#2f2f2f] hover:bg-[#373737] rounded-full text-sm font-medium transition-colors text-gray-200 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          <span>New chat</span>
        </button>
      </div>

      {/* Recent Chats Section */}
      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <div className="mb-4">
          <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Recent
          </p>
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <div key={chat.id} className="group relative">
                <button
                  onClick={() => onSelectChat?.(chat.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-full text-[14px] transition-all text-left overflow-hidden",
                    activeChatId === chat.id 
                      ? "bg-[#2d2f31] text-white font-medium" 
                      : "text-gray-300 hover:bg-[#2d2f31]"
                  )}
                >
                  <MessageSquare className={cn(
                    "w-4 h-4 shrink-0",
                    activeChatId === chat.id ? "text-blue-400" : "text-gray-400"
                  )} />
                  <span className="truncate pr-8">{chat.title}</span>
                </button>
                
                {/* Delete Button - Only shows on hover */}
                {onDeleteChat && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-white/5 space-y-1">
        {[
          { icon: HelpCircle, label: "Help" },
          { icon: History, label: "Activity" },
          { icon: Settings, label: "Settings" },
        ].map((item, idx) => (
          <button 
            key={idx}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-sm text-gray-300 hover:bg-[#2d2f31] transition-colors"
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}