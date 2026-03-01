import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages, files, isTitleRequest } = await req.json();
    
    // Model selection
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: isTitleRequest 
        ? "You are a title generator. Create a 3-4 word title for the chat. No quotes, no markdown, just plain text."
        : "You are Gemini, a helpful and concise AI assistant. Use markdown for formatting."
    });

    // --- CASE 1: Agar sirf Title chahiye (Sidebar ke liye) ---
    if (isTitleRequest) {
      const lastMessage = messages[messages.length - 1].content;
      const result = await model.generateContent(lastMessage);
      const response = await result.response;
      return new Response(response.text(), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // --- CASE 2: Normal Chat Logic (Streaming) ---
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));
    
    const lastMessage = messages[messages.length - 1].content;

    const promptParts = [
      ...(files || []), 
      { text: lastMessage }
    ];

    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(promptParts);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}