'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';
import { ThumbsUp, ThumbsDown, Copy, Share2, RefreshCw, Check, Sparkles, FileText, Pencil } from 'lucide-react';

interface MessageBubbleProps extends Message {
  onEdit?: (content: string) => void; // Edit functionality ke liye callback
}

export default function MessageBubble({ role, content, onEdit }: MessageBubbleProps) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "group flex w-full flex-col mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500",
      isUser ? "items-end" : "items-start"
    )}>
      <div className="w-full max-w-[800px] mx-auto px-4 md:px-6">
        
        <div className={cn(
          "flex gap-4",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          {/* --- AVATAR --- */}
          {!isUser && (
            <div className="shrink-0 mt-1">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1e1e1e] border border-white/5">
                <Sparkles className="w-5 h-5 text-blue-400 fill-blue-400" />
              </div>
            </div>
          )}

          <div className={cn(
            "relative text-[16px] leading-[1.6] flex-1",
            isUser ? "flex flex-col items-end" : ""
          )}>
            
            {/* --- FILE ATTACHMENT PREVIEW (If any) --- */}
            {/* Note: Abhi hum sirf PDF icon dikha rahe hain as a placeholder */}
            {isUser && content.includes(".pdf") && (
              <div className="mb-2 flex items-center gap-2 bg-[#1e1e1e] border border-white/10 p-2 rounded-xl w-fit">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-red-500" />
                </div>
                <div className="pr-2">
                  <p className="text-xs font-medium text-gray-200">Document.pdf</p>
                  <p className="text-[10px] text-gray-500">PDF Attachment</p>
                </div>
              </div>
            )}

            {/* --- MESSAGE CONTENT --- */}
            <div className={cn(
              "prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent",
              isUser 
                ? "w-fit max-w-[85%] bg-[#2f2f2f] text-gray-100 px-5 py-2.5 rounded-[22px] border border-white/5 shadow-sm" 
                : "text-gray-200 w-full"
            )}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="my-4 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                        <div className="bg-[#1e1e1e] px-4 py-1.5 text-[11px] font-mono text-gray-400 border-b border-white/5 flex justify-between items-center">
                          <span className="uppercase">{match[1]}</span>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ margin: 0, padding: '1.25rem', fontSize: '14px', backgroundColor: '#0d0d0d' }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-400 font-mono text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>

            {/* --- ACTION BAR (For both User & AI) --- */}
            <div className={cn(
              "flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              isUser ? "flex-row-reverse -mr-2" : "-ml-2"
            )}>
              {/* Common Copy Button */}
              <button 
                onClick={handleCopy}
                className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors hover:text-white"
                title="Copy"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>

              {isUser ? (
                /* User Only: Edit Button */
                <button 
                  onClick={() => onEdit?.(content)}
                  className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors hover:text-blue-400"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              ) : (
                /* AI Only: Like, Dislike, Share */
                <>
                  <button className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors hover:text-blue-400">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors hover:text-red-400">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors hover:text-white">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-white/5 rounded-full transition-colors hover:text-white">
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}