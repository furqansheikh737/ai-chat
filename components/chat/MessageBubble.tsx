'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chat';

export default function MessageBubble({ role, content }: Message) {
  const isUser = role === 'user';

  return (
    <div className={cn(
      "group flex w-full flex-col mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500",
      isUser ? "items-end" : "items-start"
    )}>
      {/* Centered Main Container */}
      <div className="w-full max-w-[800px] mx-auto px-4 md:px-6">
        
        <div className={cn(
          "relative text-[16px] leading-[1.6]",
          isUser 
            ? "ml-auto w-fit max-w-[85%] bg-[#2f2f2f] text-gray-100 px-5 py-2.5 rounded-[22px] border border-white/5" 
            : "text-gray-200 w-full"
        )}>
          {/* Markdown Content */}
          <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="my-4 rounded-xl overflow-hidden border border-white/10">
                      <div className="bg-[#1e1e1e] px-4 py-1.5 text-[11px] font-mono text-gray-400 border-b border-white/5 flex justify-between">
                        <span className="uppercase">{match[1]}</span>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{ margin: 0, padding: '1rem', fontSize: '14px', backgroundColor: '#0d0d0d' }}
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
                p: ({ children }) => <p className="mb-0">{children}</p>, // No margin to keep bubble tight
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}