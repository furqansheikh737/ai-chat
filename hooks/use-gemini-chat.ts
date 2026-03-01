'use client';

import { useState } from 'react';

export function useGeminiChat() {
  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to generate title for sidebar
  const generateTitle = async (firstMessage: string) => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [{ role: "user", content: `Generate a very short 3-4 word title for this chat: "${firstMessage}". Give only the title text.` }],
          isTitleRequest: true 
        }),
      });
      const data = await response.text();
      return data.trim().replace(/^"|"$/g, '');
    } catch (error) {
      return "New Chat";
    }
  };

  const sendMessage = async (input: string, files: File[] = [], onTitleGenerated?: (id: string, title: string) => void) => {
    if (!input.trim() && files.length === 0) return;

    const userMsg = { role: "user", content: input };
    const isFirstMessage = messages.length === 0;
    
    // Naya chat ID generate karna agar pehli message hai
    let activeChatId = currentChatId;
    if (isFirstMessage && !activeChatId) {
      activeChatId = Date.now().toString();
      setCurrentChatId(activeChatId);
    }

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 1. Generate Title if it's the first message
      if (isFirstMessage && onTitleGenerated && activeChatId) {
        generateTitle(input).then(title => {
          onTitleGenerated(activeChatId!, title);
        });
      }

      const fileData = await Promise.all(
        files.map(async (file) => {
          const base64 = await fileToBase64(file);
          return {
            inlineData: {
              data: base64.split(',')[1],
              mimeType: file.type
            }
          };
        })
      );

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMsg],
          files: fileData 
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "model", content: "" }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        assistantContent += chunk;

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: assistantContent }];
        });
      }
    } catch (error) {
      console.error("Stream error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Humne setCurrentChatId ko bhi return kiya hai taake page.tsx ise use kar sake
  return { 
    messages, 
    sendMessage, 
    isLoading, 
    setMessages, 
    currentChatId, 
    setCurrentChatId 
  };
}