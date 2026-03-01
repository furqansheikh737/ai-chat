"use client";

import React, { useRef, useEffect, useState } from "react";
import {
  Send,
  Loader2,
  Plus,
  Mic,
  LayoutGrid,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent, files?: File[]) => void;
  disabled: boolean;
  onMicClick?: () => void; // Naya prop
  isListening?: boolean;   // Naya prop
}

export default function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled,
  onMicClick,
  isListening = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [value]);

  const handlePlusClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const internalOnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || (!value.trim() && selectedFiles.length === 0)) return;
    onSubmit(e, selectedFiles);
    setSelectedFiles([]);
  };

  return (
    <div className="w-full max-w-[800px] mx-auto px-4">
      <form
        onSubmit={internalOnSubmit}
        className={cn(
          "relative flex flex-col bg-[#1e1e20] rounded-[28px] border border-transparent",
          "shadow-lg focus-within:bg-[#28292c] transition-all duration-300",
          "group border-white/5 focus-within:border-white/10 overflow-hidden",
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="hidden"
          accept="image/*, .pdf, .doc, .docx, .txt"
        />

        {/* --- FILE PREVIEW AREA --- */}
        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-3 px-4 pt-4 pb-2 animate-in slide-in-from-top-2 duration-300">
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative group">
                <div className="w-16 h-16 bg-[#0e0e0e] rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-inner">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-0.5">
                      <FileText className="w-6 h-6 text-blue-400" />
                      <span className="text-[10px] text-gray-500 font-bold uppercase">
                        {file.name.split(".").pop()}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-1.5 -right-1.5 bg-[#3c4043] text-white rounded-full p-0.5 border border-white/10 hover:bg-gray-600 transition-colors shadow-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* --- TEXTAREA --- */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              internalOnSubmit(e);
            }
          }}
          placeholder={isListening ? "Listening..." : "Ask Gemini"}
          className="w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-gray-200 placeholder-gray-500 py-4 px-5 resize-none text-[16px] leading-relaxed min-h-[56px] scrollbar-none [&::-webkit-scrollbar]:display-none"
          disabled={disabled}
        />

        {/* --- BOTTOM ACTION BAR --- */}
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePlusClick}
              className="p-2.5 text-gray-400 hover:bg-white/5 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:bg-white/5 rounded-full transition-colors text-sm"
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Tools</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            {/* --- MIC BUTTON WITH ANIMATION --- */}
            <button
              type="button"
              onClick={onMicClick}
              className={cn(
                "p-2.5 rounded-full transition-all duration-300 relative",
                isListening 
                  ? "text-red-500 bg-red-500/10 animate-pulse scale-110" 
                  : "text-gray-400 hover:bg-white/5"
              )}
            >
              {isListening && (
                <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
              )}
              <Mic className={cn("w-5 h-5", isListening && "fill-current")} />
            </button>

            <button
              type="submit"
              disabled={disabled || (!value.trim() && selectedFiles.length === 0)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
                (value.trim() || selectedFiles.length > 0) && !disabled
                  ? "text-[#4285f4] hover:bg-[#4285f4]/10"
                  : "text-gray-600 cursor-not-allowed opacity-50",
              )}
            >
              {disabled ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send
                  className={cn(
                    "w-5 h-5",
                    (value.trim() || selectedFiles.length > 0) && "fill-current",
                  )}
                />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}