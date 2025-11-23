import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertCircle, Send, Trash2, Copy, Check, Sparkles, RefreshCw } from 'lucide-react';

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
  const API_KEY = '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';

  const [resumeContent] = useState(`Ciril Arockiaraj S
Trichy, India | 6382810644 | cirilarockiaraj@gmail.com
www.linkedin.com/in/ciril-arockiaraj-s-b3085930b | https://github.com/cirilarockiaraj

PROFESSIONAL SUMMARY
A highly motivated and detail-oriented Software Developer with over 2 years of experience at Newdream Data Systems. Adept at designing and developing APIs, with a strong foundation in software development and problem-solving. Currently contributing to the conversion product development team, providing innovative solutions through deep learning and thorough analysis. A friendly, engaging team player with a passion for technology and continuous learning.

TECHNICAL SKILLS
• Languages: [Core Java, J2EE, Python (Basics), HTML 5, CSS 3, JavaScript]
• Libraries: [React (Basics), Bootstrap 5]
• Frameworks: [Spring Boot, Angular (Basics)]
• Databases: [MySQL, MongoDB, MS SQL]
• Tools: [Git, GitHub, Tortoise SVN, Guidewire Studio, IntelliJ IDEA, Eclipse, NetBeans, VS Code]
• Other: [RESTful APIs]

PROFESSIONAL EXPERIENCE
Software Developer – Newdream Data Systems [Trichy] | [March 2023 – Present]
• Started my professional journey as a Guidewire Developer, specializing in "PolicyCenter" for one year. During this time, I was responsible for designing insurance forms and templates using Guidewire technologies. I worked on various projects involving PCF, forms, data mapping, XML, and DiffTree projects.
• Developed and maintained automation scripts for internal projects using Selenium over a span of six months, greatly enhancing the efficiency and reliability of business processes.
• Currently serving as a Software Developer in the Internal Conversion Product Team, where I apply problem-solving skills and in-depth analysis to develop effective solutions for time-consuming challenges. I proficiently utilize "Java", "Spring Boot", and "MySQL" to create API solutions.
• Developed and integrated "RESTful APIs"

EDUCATION
Master of Science in Computer Science – St. Joseph's College (Autonomous) [Trichy] | [June 2021 – April 2023]
• Relevant coursework: [Cyber Security, Data Structures, Web Technologies, Databases]
• CGPA 8.4

Bachelor of Computer Applications – St. Joseph's College (Autonomous) [Trichy] | [June 2018 – April 2021]
• Relevant coursework: [Web Technologies, Data Structures, Algorithms]
• CGPA 7.51

CERTIFICATIONS
• [Java Full Stack] | [Issuer: Udemy] | [2025] – Currently Pursuing

PROJECTS
Company Project – Billing [Junior Software Developer] | [March 2023 – October 2024]
Project name: WRG
Client: WRG (US)
Description: WRG (Western Reserve Group) is US Based Insurance Company. Currently providing commercial and business lines for Indiana and Ohio states.
Technology: GOSU
Tools: Guidewire Studio, Smart COMM Advanced Template Designer
Operating System: Windows
Responsibility & Contribution:
• Requirement Analysis
• Implement the functionality in terms of code
• Unit test and fix the bugs/issues
Team Size: 10
Client site: https://wrg-ins.com/

Academic Project
Project name: Electricity Board
Description: Java-based application, developed using JSP and Servlets, allows users to request new electricity connections, pay their electricity bills, and manage both consumer and employee portfolios—all within a single application.
Key achievement: All EB-related services are provided in a single application, which includes a consumer login feature.
Technology: JavaScript, Ajax, Bootstrap 5, JSP, Servlet
Tools: NetBeans IDE
GitHub: https://github.com/cirilarockiaraj/Electricity-Board.git

ADDITIONAL INFORMATION
• Languages: [English (Medium Conversational), Tamil (Conversational)]
• Comfortable working under pressure, consistently meeting deadlines and delivering high-quality solutions in fast-paced environments.
• A dedicated team player, always willing to lend support and share knowledge to achieve team goals.
• Prepared to engage with new technologies.`);

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
  const typingIntervalRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('chat_ai_history', JSON.stringify(messages));
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, []);

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

      const systemMessage = `You are a helpful assistant that answers questions about a candidate using only the information provided in the resume below. Be concise, accurate, and professional.\n\nResume:\n\n${resumeContent}`;

      const apiMessages = [
        { role: 'system', content: systemMessage },
        { role: 'user', content: question },
      ];

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'x-ai/grok-4.1-fast:free',
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const json = await response.json();
      const assistantMessage = json?.choices?.[0]?.message;

      if (!assistantMessage?.content) {
        throw new Error('No response from AI');
      }

      const fullText = assistantMessage.content;
      let charIndex = 0;
      
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }

      typingIntervalRef.current = setInterval(() => {
        charIndex += 3;
        const partial = fullText.slice(0, charIndex);
        
        setMessages((prev) => {
          const copy = [...prev];
          for (let i = copy.length - 1; i >= 0; i--) {
            if (copy[i].role === 'assistant' && copy[i].isTyping) {
              copy[i] = { ...copy[i], content: partial };
              break;
            }
          }
          return copy;
        });

        if (charIndex >= fullText.length) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
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
        }
      }, 20);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-20">
      <style>{`
        .chat-markdown h1{font-size:1.25rem;font-weight:600;margin:.75rem 0;color:#e2e8f0}
        .chat-markdown h2{font-size:1.125rem;font-weight:600;margin:.6rem 0;color:#cbd5e1}
        .chat-markdown h3{font-size:1rem;font-weight:600;margin:.5rem 0;color:#94a3b8}
        .chat-markdown p{margin:.5rem 0;line-height:1.6;color:#e2e8f0}
        .chat-markdown ul,.chat-markdown ol{margin:.5rem 0;padding-left:1.5rem}
        .chat-markdown li{margin:.25rem 0;line-height:1.5}
        .chat-table{width:100%;border-collapse:collapse;margin:.75rem 0;border-radius:.5rem;overflow:hidden}
        .chat-table th{background:rgba(99,102,241,0.1);border:1px solid rgba(99,102,241,0.2);padding:.6rem;text-align:left;font-weight:600}
        .chat-table td{border:1px solid rgba(148,163,184,0.1);padding:.6rem}
        .chat-pre{background:rgba(15,23,42,0.8);padding:1rem;border-radius:.5rem;overflow:auto;border:1px solid rgba(148,163,184,0.1);margin:.75rem 0}
        .chat-pre code{font-family:ui-monospace,monospace;font-size:.875rem;line-height:1.5}
        .chat-inline-code{background:rgba(99,102,241,0.15);color:#a5b4fc;padding:.15rem .4rem;border-radius:.25rem;font-family:ui-monospace,monospace;font-size:.875rem}
        .chat-markdown a{color:#60a5fa;text-decoration:none;border-bottom:1px solid rgba(96,165,250,0.3);transition:all 0.2s}
        .chat-markdown a:hover{color:#93c5fd;border-bottom-color:#93c5fd}
        .chat-markdown hr{border:none;border-top:1px solid rgba(148,163,184,0.2);margin:1rem 0}
        .thinking-dots{display:inline-flex;gap:6px;align-items:center}
        .thinking-dots .dot{width:8px;height:8px;border-radius:50%;background:rgba(139,92,246,0.8);animation:blink 1.4s infinite}
        .thinking-dots .dot:nth-child(2){animation-delay:0.2s}
        .thinking-dots .dot:nth-child(3){animation-delay:0.4s}
        @keyframes blink{0%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.1)}100%{opacity:0.3;transform:scale(0.8)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .message-appear{animation:fadeIn 0.3s ease-out}
        .gradient-text{background:linear-gradient(135deg,#818cf8 0%,#c084fc 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
      `}</style>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-800/50 overflow-hidden flex flex-col h-[80vh] max-h-screen">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 border-b border-slate-800/50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">AI Resume Assistant</h1>
                  <p className="text-sm text-slate-400 mt-1">Ask me anything about Ciril's experience and skills</p>
                </div>
              </div>
              <button 
                onClick={clearChat} 
                className="p-3 rounded-xl bg-slate-800/50 hover:bg-red-600/20 border border-slate-700/50 hover:border-red-500/50 transition-all duration-200 group"
                title="Clear chat history"
              >
                <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-200">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">×</button>
            </div>
          )}

          {/* Messages */}
          <div ref={messagesRef} className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-300 mb-2">Start a Conversation</h3>
                <p className="text-slate-500 mb-6 max-w-md">Ask me anything about Ciril's resume, experience, skills, or projects.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      className="p-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl text-sm text-slate-300 hover:text-white transition-all duration-200 text-left"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`flex items-start gap-4 message-appear ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarFallback className={`flex items-center justify-center ${m.role === 'user' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-slate-800 border border-slate-700'}`}>
                      {m.role === 'user' ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      ) : (
                        <Sparkles className="w-5 h-5 text-indigo-400" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`flex-1 min-w-0 ${m.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                    <div className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-slate-800/80 backdrop-blur-sm border border-slate-700/50'
                    }`}>
                      {m.role === 'assistant' ? (
                        <div className="chat-markdown text-sm">
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
                        <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2 px-2">
                      <span className="text-xs text-slate-500">{formatTime(m.time)}</span>
                      {m.role === 'assistant' && m.content && !m.isTyping && (
                        <button
                          onClick={() => copyToClipboard(m.content, idx)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Copy message"
                        >
                          {copiedIndex === idx ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-800/50 p-6 bg-slate-900/50">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about experience, skills, projects..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed placeholder-slate-500 text-white"
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-indigo-500/25"
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
                <span className="hidden sm:inline">{isLoading ? 'Thinking...' : 'Send'}</span>
              </button>
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-slate-500">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>AI responses are generated based on resume content and may contain inaccuracies. Please verify important information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAI;