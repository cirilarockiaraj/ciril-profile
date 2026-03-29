import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertCircle, Send, Trash2, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import portfolioData from '../data/portfolio.json';

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function simpleMarkdownToHtml(md) {
  if (!md) return '';
  md = md.replace(/\r\n/g, '\n');
  md = escapeHtml(md);

  md = md.replace(/```([\s\S]*?)```/g, (m, code) => {
    return `<pre class="chat-pre"><code>${code}</code></pre>`;
  });

  md = md.replace(/^######\s*(.+)$/gm, '<h6>$1</h6>');
  md = md.replace(/^#####\s*(.+)$/gm, '<h5>$1</h5>');
  md = md.replace(/^####\s*(.+)$/gm, '<h4>$1</h4>');
  md = md.replace(/^###\s*(.+)$/gm, '<h3>$1</h3>');
  md = md.replace(/^##\s*(.+)$/gm, '<h2>$1</h2>');
  md = md.replace(/^#\s*(.+)$/gm, '<h1>$1</h1>');

  md = md.replace(/^---$/gm, '<hr />');

  const lines = md.split('\n');
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('|') && /^\s*\|?\s*[-:]+/.test(lines[i + 1])) {
      let j = i;
      const tableLines = [];
      while (j < lines.length && lines[j].includes('|')) {
        tableLines.push(lines[j]);
        j++;
      }
      const header = tableLines[0].split('|').map(s => s.trim()).filter(Boolean);
      const rows = tableLines.slice(2).map(r => r.split('|').map(c => c.trim()).filter(Boolean));
      let tableHtml = '<table class="chat-table"><thead><tr>' + header.map(h => `<th>${h}</th>`).join('') + '</tr></thead><tbody>';
      rows.forEach(r => {
        tableHtml += '<tr>' + r.map(c => `<td>${c}</td>`).join('') + '</tr>';
      });
      tableHtml += '</tbody></table>';
      lines.splice(i, tableLines.length, tableHtml);
    }
  }
  md = lines.join('\n');

  md = md.replace(/(^|\n)([ \t]*[-\*]\s+.+(\n|$))+/g, (m) => {
    const items = m.trim().split(/\n/).map(l => l.replace(/^[ \t]*[-\*]\s+/, '').trim());
    return '<ul>' + items.map(i => `<li>${i}</li>`).join('') + '</ul>';
  });

  md = md.replace(/(^|\n)([ \t]*\d+\.\s+.+(\n|$))+/g, (m) => {
    const items = m.trim().split(/\n/).map(l => l.replace(/^[ \t]*\d+\.\s+/, '').trim());
    return '<ol>' + items.map(i => `<li>${i}</li>`).join('') + '</ol>';
  });

  md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  md = md.replace(/\*(.+?)\*/g, '<em>$1</em>');
  md = md.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  md = md.split('\n\n').map(block => {
    if (/^<\/?(h\d|ul|ol|table|pre|blockquote|hr)/.test(block.trim())) return block;
    return '<p>' + block.replace(/\n/g, '<br/>') + '</p>'; 
  }).join('\n');

  return md;
}

const ChatAI = () => {
  const encodedKey = process.env.REACT_APP_GEMINI_API_KEY || '';
  const API_KEY = encodedKey ? atob(encodedKey) : (portfolioData?.chatbot?.apiKey || '');

  const [resumeContent] = useState(portfolioData?.chatbot?.resume_content || '');

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const raw = sessionStorage.getItem('chat_ai_history');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState(null);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('chat_ai_history', JSON.stringify(messages));
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    if (!confirm('Clear chat history? This action cannot be undone.')) return;
    setMessages([]);
    setError(null);
    sessionStorage.removeItem('chat_ai_history');
  }, []);

  const copyToClipboard = useCallback(async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  const sendToAI = async (question) => {
    if (!API_KEY) {
      setError('API key not configured.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      setMessages((m) => [
        ...m,
        { role: 'user', content: question, time: Date.now() },
        { role: 'assistant', content: '', time: Date.now(), isTyping: true },
      ]);

      const model = new ChatGoogleGenerativeAI({
        model: portfolioData?.chatbot?.model || "gemini-1.5-flash",
        maxOutputTokens: 2048,
        apiKey: API_KEY,
      });

      const systemPrompt = `You are the expert to explain the employee's resume for the user asked question.\n\nCurrent Date and time: ${new Date().toLocaleString()} \n\nResume: ${resumeContent}`;
      
      const promptMessages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(`Question: ${question}`)
      ];

      const stream = await model.stream(promptMessages);

      let fullText = '';
      for await (const chunk of stream) {
        fullText += chunk.content;
        setMessages((prev) => {
          const copy = [...prev];
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === 'assistant' && copy[i].isTyping) {
              copy[i] = { ...copy[i], content: fullText };
              break;
            }
          }
          return copy;
        });
      }

      setMessages((prev) => {
        const copy = [...prev];
        for (let i = copy.length - 1; i >= 0; i--) {
          if (copy[i].role === 'assistant') {
            copy[i] = { ...copy[i], isTyping: false };
            break;
          }
        }
        return copy;
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to get AI response. Please try again.');
      setMessages((prev) => prev.filter(m => !m.isTyping));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput('');
    await sendToAI(question);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedQuestions = [
    "What is Ciril's current role?",
    "What technologies does Ciril know?",
    "Tell me about Ciril's experience",
    "What projects has Ciril worked on?"
  ];

  return (
    <div className="min-h-screen relative bg-slate-950 text-slate-100 pt-20 overflow-hidden font-sans selection:bg-indigo-500/30">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-[45rem] h-[45rem] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 pointer-events-none"></div>

      <style>{`
        /* Blob Animation */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 10s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        /* General Markdown Styles */
        .chat-markdown h1{font-size:1.5rem;font-weight:700;margin:1rem 0;color:#f8fafc;letter-spacing:-0.025em}
        .chat-markdown h2{font-size:1.25rem;font-weight:600;margin:.8rem 0;color:#f1f5f9;letter-spacing:-0.025em}
        .chat-markdown h3{font-size:1.1rem;font-weight:600;margin:.6rem 0;color:#e2e8f0}
        .chat-markdown p{margin:.6rem 0;line-height:1.7;color:#cbd5e1}
        .chat-markdown ul,.chat-markdown ol{margin:.6rem 0;padding-left:1.5rem;color:#cbd5e1}
        .chat-markdown li{margin:.3rem 0;line-height:1.6}
        .chat-table{width:100%;border-collapse:separate;border-spacing:0;margin:1rem 0;border-radius:0.75rem;overflow:hidden;border:1px solid rgba(148,163,184,0.15)}
        .chat-table th{background:rgba(99,102,241,0.15);padding:0.8rem;text-align:left;font-weight:600;color:#e2e8f0;border-bottom:1px solid rgba(148,163,184,0.15)}
        .chat-table td{padding:0.8rem;color:#cbd5e1;border-bottom:1px solid rgba(148,163,184,0.05);background:rgba(15,23,42,0.3)}
        .chat-table tr:last-child td{border-bottom:none}
        .chat-pre{background:#020617;padding:1.25rem;border-radius:0.75rem;overflow:auto;border:1px solid rgba(148,163,184,0.1);margin:1rem 0;box-shadow:inset 0 2px 4px rgba(0,0,0,0.5)}
        .chat-pre code{font-family:'JetBrains Mono','Fira Code',ui-monospace,monospace;font-size:0.875rem;line-height:1.6;color:#e2e8f0}
        .chat-inline-code{background:rgba(99,102,241,0.2);color:#c7d2fe;padding:0.2rem 0.4rem;border-radius:0.375rem;font-family:ui-monospace,monospace;font-size:0.85em;font-weight:500;}
        .chat-markdown a{color:#818cf8;text-decoration:none;border-bottom:1px solid rgba(129,140,248,0.3);transition:all 0.2s ease}
        .chat-markdown a:hover{color:#a5b4fc;border-bottom-color:#a5b4fc;text-shadow: 0 0 8px rgba(129,140,248,0.5)}
        .chat-markdown hr{border:none;border-top:1px solid rgba(148,163,184,0.15);margin:1.5rem 0}
        
        /* Thinking animation */
        .thinking-dots{display:inline-flex;gap:4px;align-items:center;padding:4px 0}
        .thinking-dots .dot{width:6px;height:6px;border-radius:50%;background:#818cf8;animation:wave 1.2s infinite ease-in-out}
        .thinking-dots .dot:nth-child(1){animation-delay:-0.32s}
        .thinking-dots .dot:nth-child(2){animation-delay:-0.16s}
        @keyframes wave{0%,40%,100%{transform:translateY(0);opacity:0.4}20%{transform:translateY(-4px);opacity:1}}
        
        /* Message appearance */
        @keyframes messageSlide{from{opacity:0;transform:translateY(16px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        .message-appear{animation:messageSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards}
        
        /* Gradient text */
        .gradient-text{background:linear-gradient(135deg,#a5b4fc 0%,#f472b6 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(148,163,184,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148,163,184,0.4); }
      `}</style>

      <div className="container relative z-10 mx-auto px-4 py-6 sm:py-8 max-w-5xl">
        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-slate-700/50 overflow-hidden flex flex-col h-[85vh] max-h-screen ring-1 ring-white/5">
          {/* Header */}
          <div className="relative bg-slate-800/40 backdrop-blur-md border-b border-white/10 p-5 sm:p-6 overflow-hidden shrink-0">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold gradient-text tracking-tight">AI Resume Assistant</h1>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5 font-medium">Ask me anything about Ciril's experience</p>
                </div>
              </div>
              <button 
                onClick={clearChat} 
                className="p-3 rounded-xl bg-slate-800/50 hover:bg-red-500/10 border border-slate-700/50 hover:border-red-500/30 transition-all duration-300 group"
                title="Clear chat history"
              >
                <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
             <div className="mx-6 mt-6 p-4 bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-2xl flex items-start gap-3 shadow-lg shrink-0">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-200 font-medium">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300 transition-colors">×</button>
            </div>
          )}

          {/* Messages Area */}
          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
                  <div className="relative w-24 h-24 rounded-3xl bg-slate-800/80 border border-slate-700/50 shadow-2xl flex items-center justify-center mb-6 ring-1 ring-white/10">
                    <Sparkles className="w-12 h-12 text-indigo-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-3 tracking-tight">Start a Conversation</h3>
                <p className="text-slate-400 mb-8 max-w-md text-sm sm:text-base">Ask me anything about Ciril's resume, experience, skills, or projects. I'm here to help!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      className="p-4 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 rounded-2xl text-sm text-slate-300 hover:text-white transition-all duration-300 text-left group hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <span className="block text-indigo-400 mb-1 group-hover:text-indigo-300 transition-colors">Example</span>
                      <span className="font-medium">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`flex items-start gap-3 sm:gap-4 message-appear ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 shadow-lg ring-2 ring-slate-900">
                    <AvatarFallback className={`flex items-center justify-center ${m.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-800 border border-slate-700'}`}>
                      {m.role === 'user' ? (
                         <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      ) : (
                        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex-1 min-w-0 ${m.role === 'user' ? 'flex flex-col items-end' : 'flex flex-col items-start'}`}>
                    <div className={`inline-block max-w-[90%] sm:max-w-[85%] rounded-3xl px-5 py-4 sm:px-6 sm:py-4 box-border ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/20 rounded-tr-md' 
                        : 'bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-sm rounded-tl-md'
                    }`}>
                      {m.role === 'assistant' ? (
                        <div className="chat-markdown text-[14px] sm:text-[15px]">
                          {m.content ? (
                            <div dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(m.content) }} />
                          ) : (
                            <div className="thinking-dots py-1">
                              <span className="dot" />
                              <span className="dot" />
                              <span className="dot" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-[14px] sm:text-[15px] font-medium whitespace-pre-wrap leading-relaxed">{m.content}</div>
                      )}
                    </div>

                    <div className={`flex items-center gap-2 mt-2 px-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-[11px] sm:text-xs text-slate-500 font-medium tracking-wide">{formatTime(m.time)}</span>
                      {m.role === 'assistant' && m.content && !m.isTyping && (
                        <button
                          onClick={() => copyToClipboard(m.content, idx)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all flex items-center gap-1.5"
                          title="Copy message"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400 font-medium uppercase mt-0.5">Copied!</span>
                            </>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {/* Scroll bottom anchor text spacer */}
            <div className="h-2"></div>
          </div>

          {/* Input Area */}
          <div className="border-t border-white/5 p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xl shrink-0">
            <div className="flex gap-3 relative max-w-4xl mx-auto items-end">
              <div className="relative flex-1 group">
                 {/* Focus Glow */}
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-focus-within:opacity-30 transition duration-500 blur"></div>
                 <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about my experience, skills, projects..."
                    disabled={isLoading}
                    className="relative w-full px-5 py-4 bg-slate-800/90 border border-slate-700/50 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:bg-slate-800 transition-all text-slate-100 placeholder-slate-500 shadow-inner h-[56px]"
                 />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="relative px-5 py-4 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 active:scale-95 shrink-0 h-[56px]"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 ml-1" />
                )}
                <span className="hidden sm:inline-block pr-1">{isLoading ? 'Thinking...' : 'Send'}</span>
              </button>
            </div>

            <div className="mt-3 flex items-start justify-center gap-2 text-[11px] sm:text-xs text-slate-500 max-w-2xl mx-auto text-center">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 hidden sm:inline-block" />
              <p>AI may produce inaccurate information about the resume. Double check important responses.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;