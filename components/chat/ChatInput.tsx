"use client";

import React, { useRef, useEffect } from "react";
import { Send, Loader2, Plus, Mic, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "inherit";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) {
        onSubmit(e);
      }
    }
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4">
      <form
        onSubmit={onSubmit}
        className={cn(
          "relative flex flex-col bg-[#1e1e20] rounded-[24px] border border-transparent",
          "shadow-lg focus-within:bg-[#28292c] transition-all duration-300",
          "group border-white/5 focus-within:border-white/10",
        )}
      >
        {/* Text Area Row - Normal Padding and Height */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Gemini"
          className={cn(
            "w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none",
            "text-gray-200 placeholder-gray-500 py-3 px-5 resize-none text-[16px] leading-relaxed",
            "min-h-[44px] max-h-[160px] overflow-y-auto",
            /* Yeh classes scrollbar ko hide karengi magar scrolling allow rakhengi */
            "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:display-none",
          )}
          disabled={disabled}
        />

        {/* Action Bar Row - Compact Icons */}
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1 text-gray-400 hover:bg-white/5 rounded-full transition-colors text-[14px]"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Tools</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-300",
                value.trim() && !disabled
                  ? "text-blue-400 hover:bg-blue-400/10 scale-100 opacity-100"
                  : "text-gray-600 opacity-0 scale-75 pointer-events-none",
              )}
            >
              {disabled ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send
                  className={cn("w-5 h-5", value.trim() && "fill-current")}
                />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
