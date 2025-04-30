'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Minimize2, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// Import the Google Generative AI library
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import ReactMarkdown from "react-markdown";

// Keep your local knowledge base for potential fallback or specific structured answers
// import { programmingKnowledge } from '@/lib/programming-knowledge';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  code?: string; // Keep for potential structured code responses
}

// --- Google Gemini Configuration ---
// IMPORTANT: Store your API key securely, e.g., in environment variables.
// Avoid committing keys directly into your code.
// WARNING: Hardcoding API keys is insecure and not recommended for production.
const GEMINI_API_KEY = "AIzaSyCRasSBtZuUo2D_js8XUZL9p2oIgwzdKLM"; // Hardcoded API Key
const GEMINI_MODEL_NAME = "gemini-2.0-flash"; // Or another suitable Gemini model

// Initialize the Google Generative AI client
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY }); // Correct initialization

export default function ChatBot() {
  // Prevent rendering the chatbot on the assessment page

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const generateResponse = async (userMessage: string): Promise<{ content: string; code?: string }> => {
    setIsTyping(true);

    try {
      // Use the correct API call as per latest docs
      const response = await genAI.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: userMessage,
      });

      // response.text is a getter, not a function
      const generatedText = response.text;

      setIsTyping(false);

      return {
        content: generatedText || "Sorry, I couldn't generate a response.",
      };

    } catch (error) {
      console.error("Error calling Google Gemini API:", error);
      setIsTyping(false);
      let errorMessage = "Sorry, I encountered an error trying to respond. Please try again.";
      if ((error as any)?.response?.promptFeedback?.blockReason) {
        errorMessage = `My response was blocked due to: ${ (error as any).response.promptFeedback.blockReason}. Please rephrase your request.`;
      } else if (error instanceof Error && error.message.includes('API key not valid')) {
        errorMessage = "API Key is invalid. Please check your configuration.";
      }
      return {
        content: errorMessage
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return; // Prevent sending empty messages or while typing

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isBot: false,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input; // Capture input before clearing
    setInput('');

    const response = await generateResponse(currentInput); // Pass captured input
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: response.content,
      code: response.code,
      isBot: true,
    };

    setMessages(prev => [...prev, botMessage]);
    if (!isOpen) {
      setHasNewMessage(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  // Function to clear chat history and messages
  const clearChat = () => {
    setMessages([]);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-[400px] h-[600px] bg-background border rounded-lg shadow-xl flex flex-col animate-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-primary/10 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask me anything!</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-primary/20 text-foreground"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearChat}
                className="h-8 w-8 hover:bg-primary/20 text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 bg-secondary/30">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground text-sm p-4">
                  <p className="mb-2">👋 Hello! I am your AI assistant powered by Gemini.</p>
                  <p>Ask me about programming, or anything else!</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-2",
                    message.isBot ? "justify-start" : "justify-end"
                  )}
                >
                  {message.isBot && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2 shadow-sm whitespace-pre-wrap",
                      message.isBot
                        ? "bg-card text-card-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    {/* Render markdown for bot and user messages */}
                    <div className="text-sm markdown-body">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    {message.code && (
                      <pre className="mt-2 p-3 bg-muted rounded-lg border text-sm overflow-x-auto font-mono">
                        <code>{message.code}</code>
                      </pre>
                    )}
                  </div>
                  {!message.isBot && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-card text-card-foreground max-w-[85%] rounded-2xl px-4 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="animate-bounce">•</span>
                      <span className="animate-bounce delay-100">•</span>
                      <span className="animate-bounce delay-200">•</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question here..."
                className="flex-1 bg-secondary/30 border-secondary/30"
                disabled={isTyping}
              />
              <Button type="submit" size="icon" className="h-10 w-10 rounded-full" disabled={isTyping || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg relative bg-primary hover:bg-primary/90 animate-in fade-in duration-300"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-6 w-6" />
          {hasNewMessage && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
            >
              1
            </Badge>
          )}
        </Button>
      )}
    </div>
  );
}