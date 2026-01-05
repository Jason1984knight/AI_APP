
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2, Bot, AlertCircle } from 'lucide-react';
import { ChatState, Message } from '../types';

interface Props {
  state: ChatState;
  onClose: () => void;
  onSendMessage: (text: string) => void;
}

const ExplanationPanel: React.FC<Props> = ({ state, onClose, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.messages, state.isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !state.isLoading) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  if (!state.nodeId) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-tight">
              {state.nodeLabel}
            </h2>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Sparkles size={12} className="text-amber-500" />
              AI-Powered Explanation
            </p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
      >
        {state.messages.length === 0 && !state.isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center px-4">
            <Loader2 className="animate-spin mb-4" />
            <p>Initializing AI context...</p>
          </div>
        )}

        {state.messages.map((msg, i) => {
          const isError = msg.text.startsWith('Error:') || msg.text.includes('Unable to connect');
          return (
            <div 
              key={i} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : isError 
                      ? 'bg-red-50 text-red-700 border border-red-200 rounded-tl-none'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none prose prose-sm'
                }`}
              >
                {isError && <AlertCircle size={16} className="mb-2 inline-block mr-2" />}
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: msg.text
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n/g, '<br/>')
                      .replace(/^\- (.*)/gm, '<li>$1</li>')
                      .replace(/(<li>.*<\/li>)/gs, '<ul class="list-disc ml-4 my-2">$1</ul>')
                  }} 
                />
              </div>
            </div>
          );
        })}

        {state.isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask more about ${state.nodeLabel}...`}
            className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-slate-400"
            disabled={state.isLoading}
          />
          <button
            type="submit"
            disabled={state.isLoading || !inputText.trim()}
            className="absolute right-2 top-1.5 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-3 uppercase tracking-wider font-medium">
          Powered by Gemini 3 Flash
        </p>
      </div>
    </div>
  );
};

export default ExplanationPanel;
