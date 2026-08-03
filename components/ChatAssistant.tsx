"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useStudyStore } from "@/lib/store";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatAssistant() {
  const notes = useStudyStore((state) => state.notes);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your Open-Book Study Assistant. I've read your notes. What questions do you have about them?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !notes) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes,
          history: [...messages, { role: "user", content: userMessage }]
        })
      });

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.message }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I had trouble connecting to the cloud assistant." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto flex flex-col h-[600px] border border-border/50 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden rounded-3xl">
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            <div 
              className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-white/10 text-card-foreground rounded-tl-sm prose prose-invert max-w-none"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed m-0">
                {msg.role === "assistant" ? (
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin opacity-50" />
              <span className="text-sm opacity-50">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-background/50 border-t border-white/5 backdrop-blur-md">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your notes..."
            className="flex-1 rounded-full bg-white/5 border-white/10 focus-visible:ring-primary"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-primary hover:bg-primary/90 shrink-0"
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
