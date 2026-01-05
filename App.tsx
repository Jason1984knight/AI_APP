
import React, { useState, useCallback } from 'react';
import Diagram from './components/Diagram';
import ExplanationPanel from './components/ExplanationPanel';
import { ChatState, Message } from './types';
import { getGeminiExplanation } from './services/geminiService';
import { Info, Map as MapIcon, Share2, HelpCircle, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    nodeId: null,
    nodeLabel: null,
    messages: [],
    isLoading: false,
  });

  const handleNodeClick = useCallback(async (id: string, label: string) => {
    // If clicking the same node, just reopen
    if (chatState.nodeId === id) {
      return;
    }

    setChatState({
      nodeId: id,
      nodeLabel: label,
      messages: [],
      isLoading: true,
    });

    const explanation = await getGeminiExplanation(label);
    
    setChatState(prev => ({
      ...prev,
      messages: [{ role: 'model', text: explanation }],
      isLoading: false,
    }));
  }, [chatState.nodeId]);

  const handleSendMessage = async (text: string) => {
    if (!chatState.nodeLabel) return;

    const userMsg: Message = { role: 'user', text };
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isLoading: true,
    }));

    const response = await getGeminiExplanation(chatState.nodeLabel, [...chatState.messages, userMsg]);

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, { role: 'model', text: response }],
      isLoading: false,
    }));
  };

  const closePanel = () => {
    setChatState(prev => ({ ...prev, nodeId: null, nodeLabel: null }));
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 z-40 px-6 py-4 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
              <MapIcon size={24} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 leading-tight tracking-tight">AI Ecosystem Explorer</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Interactive Landscape & Pan-Zoom Graph</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
              <Info size={14} />
              Drag to explore detail
            </div>
            <button className="text-slate-500 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-lg">
              <Share2 size={20} />
            </button>
            <button className="text-slate-500 hover:text-slate-800 transition-colors p-2 hover:bg-slate-100 rounded-lg">
              <HelpCircle size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden px-6 pb-6 pt-2">
        <Diagram onNodeClick={handleNodeClick} />

        {/* Floating Tooltip/Hint when nothing selected */}
        {!chatState.nodeId && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-xl border border-slate-200 px-6 py-3 rounded-full flex items-center gap-3 animate-bounce z-10 pointer-events-none">
            <Sparkles className="text-blue-600" size={20} />
            <span className="text-sm font-bold text-slate-700">Click any technology node to reveal details</span>
          </div>
        )}
      </main>

      {/* AI Explanation Drawer */}
      <ExplanationPanel 
        state={chatState} 
        onClose={closePanel} 
        onSendMessage={handleSendMessage}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-3 px-8 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between text-slate-400 text-[10px] font-medium uppercase tracking-widest">
          <p>© 2025 AI Landscape Explorer • Advanced Pan/Zoom Engine</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-blue-600 transition-colors">Contribute</a>
            <a href="#" className="hover:text-blue-600 transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
