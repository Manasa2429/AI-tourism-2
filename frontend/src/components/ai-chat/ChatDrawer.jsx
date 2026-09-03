import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, CornerDownLeft, RefreshCw, MessageSquare, Compass, ArrowRight, Radio } from 'lucide-react';
import { aiService } from '../../services/api';

export default function ChatDrawer({ isOpen, onClose, destinationContext, onOpenPlanner }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Greetings from Aetheria. I am Aura, your autonomous planetary concierge powered by Google Gemini intelligence. How may I assist your expedition today? You can inquire about optimal seasonal windows, hidden architectural viewpoints, or local dining customs.`,
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState(destinationContext?.name || 'Kyoto');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (destinationContext?.name) {
      setContext(destinationContext.name);
    }
  }, [destinationContext]);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    `How many days are ideal for ${context}?`,
    `What are 3 secret viewpoints in ${context} away from crowds?`,
    `What authentic local dishes must I experience?`,
    `What is essential packing advice for ${context}?`
  ];

  const handleSendMessage = async (textToSend = inputMessage) => {
    if (!textToSend || textToSend.trim() === '') return;

    const userText = textToSend.trim();
    setInputMessage('');

    const updatedHistory = [...messages, { role: 'user', content: userText }];
    setMessages(updatedHistory);
    setLoading(true);

    try {
      const response = await aiService.sendChatMessage(userText, context, updatedHistory);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.reply, followUps: response.suggestedFollowUps }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `When traversing ${context}, explore historical quarters at dawn for tranquility. For gastronomy, always seek out small, alleyway establishments frequented by locals.`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex justify-end animate-fade-in">
      <div className="w-full max-w-lg bg-aetheria-obsidian glass-aetheria h-full border-l border-cyan-500/30 flex flex-col shadow-2xl">
        {/* Chat Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-aetheria-border flex items-center justify-between bg-aetheria-surface/50 backdrop-blur-2xl">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-400 to-cyan-300 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-aetheria-obsidian" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display text-lg font-bold text-white">Aura AI Concierge</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-bold uppercase tracking-wider border border-cyan-500/30 font-mono-telemetry">
                  Gemini API
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Expedition Target: <strong className="text-cyan-300 font-medium">{context}</strong></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-b border-aetheria-border bg-white/[0.02] flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] uppercase font-mono-telemetry font-bold text-cyan-400 shrink-0 pl-1">Ask Aura:</span>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs text-slate-300 hover:text-cyan-300 bg-white/[0.05] hover:bg-cyan-500/15 px-3.5 py-1.5 rounded-xl whitespace-nowrap border border-white/[0.08] transition-all shrink-0 font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Conversation Message List */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0 mt-1 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20'
                    : 'bg-aetheria-surface/90 border border-aetheria-border text-slate-200 font-light'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Suggested Followups */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block font-mono-telemetry">
                      Suggested Investigations:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUps.map((fu, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSendMessage(fu)}
                          className="text-[11px] text-slate-300 hover:text-white bg-black/60 px-3 py-1.5 rounded-xl hover:bg-black/80 transition-colors text-left border border-white/10"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-200 shrink-0 mt-1 shadow-md">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="bg-white/[0.04] border border-aetheria-border rounded-2xl px-4 py-3 text-xs text-slate-300 flex items-center space-x-2">
                <span>Aura is synthesizing insights with Gemini API...</span>
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar & Actions */}
        <div className="p-4 sm:p-6 border-t border-aetheria-border bg-aetheria-surface/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2.5"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask Aura about ${context}...`}
              className="flex-1 glass-aetheria-input rounded-2xl px-4 py-3.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 font-bold hover:shadow-lg hover:shadow-cyan-400/30 disabled:opacity-40 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {onOpenPlanner && (
            <div className="mt-3.5 flex justify-center">
              <button
                onClick={() => {
                  onClose();
                  onOpenPlanner();
                }}
                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1.5 font-display font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Day-by-Day Expedition Studio →</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
