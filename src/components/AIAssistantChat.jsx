import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MessageSquare, X, Send, Bot, User, Trash2, Shield, AlertTriangle, ArrowRight } from 'lucide-react'
import { API } from '../api'

const SUGGESTIONS = [
  "I need help with a property dispute",
  "How to handle a divorce in India?",
  "What to do if someone cheats me financially?",
  "Wrongful termination from my job",
  "Draft a rental agreement"
]

export default function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const scrollRef = useRef(null)
  const router = useRouter()

  // Generate or retrieve persistent Session ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = sessionStorage.getItem('jj_ai_session_id')
      if (!id) {
        id = `session-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`
        sessionStorage.setItem('jj_ai_session_id', id)
      }
      setSessionId(id)
    }
  }, [])

  // Listen to custom open event (triggered from Hero pill/button)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-ai-chat', handleOpen)
    return () => window.removeEventListener('open-ai-chat', handleOpen)
  }, [])

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jj_ai_chat_history')
    if (saved) {
      try {
        setMessages(JSON.parse(saved))
      } catch (e) {
        setMessages(getInitialMessage())
      }
    } else {
      setMessages(getInitialMessage())
    }
  }, [])

  // Save chat history and auto-scroll
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('jj_ai_chat_history', JSON.stringify(messages))
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Don't show chat widget on admin dashboard
  if (router.pathname.startsWith('/admin')) {
    return null
  }

  function getInitialMessage() {
    return [{
      id: 1,
      role: 'assistant',
      text: "Hi, I can help you understand your legal issue and find the right lawyer. What's going on?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]
  }

  const handleSend = async (text) => {
    const msgText = text || input
    if (!msgText.trim() || isTyping) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: msgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)

    try {
      // Build rolling history (exclude system prompts and keep formatting clean)
      const conversationHistory = updatedMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({
          role: m.role,
          content: m.text
        }))

      const data = await API.assistant({
        message: msgText,
        conversationHistory,
        sessionId
      })

      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.reply || "I am currently unable to draft a response. Please consult a verified lawyer on JusticeJunction directly.",
        category: data.category || null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error('AI Assistant Chat Error:', err)
      const errorMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: "I'm temporarily having connection issues. For direct and professional legal advice, please consult a verified lawyer on JusticeJunction.",
        category: null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear your chat history?")) {
      const initial = getInitialMessage()
      setMessages(initial)
      localStorage.setItem('jj_ai_chat_history', JSON.stringify(initial))
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      
      {/* Floating Chat Icon - Unified entry point */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-16 h-16 rounded-3xl bg-[#7B1D2E] hover:bg-[#5C1521] text-white border-none shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 relative group"
          aria-label="Open AI Legal Assistant"
        >
          <MessageSquare size={28} />
          {/* Label tooltip */}
          <span className="absolute right-20 hidden md:inline-block bg-white text-[#1A0A0D] border border-[#E8C9A8] px-4 py-2 rounded-2xl text-xs font-bold shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Ask AI Legal Assistant
          </span>
        </button>
      )}

      {/* Slide-Up Chat Panel */}
      {isOpen && (
        <div className="w-[380px] h-[580px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#E8C9A8] animate-[slideUpChat_0.35s_ease-out] fixed bottom-6 right-6 md:right-6 md:bottom-6 sm:max-w-md mobile-full-screen">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#7B1D2E] text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Bot size={20} className="text-[#F5C4B3]" />
              </div>
              <div>
                <div className="font-extrabold text-sm tracking-wide">AI Legal Assistant</div>
                <div className="text-[10px] text-[#F5C4B3] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online · General Info Only
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat} 
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
                title="Clear Chat History"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition"
                title="Close Chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Persistent Top Disclaimer */}
          <div className="px-4 py-2 bg-[#FEF3C7] text-[#92400E] text-[11px] font-bold flex items-center gap-2 border-b border-[#FCD34D] select-none">
            <AlertTriangle size={13} className="flex-shrink-0 text-[#EA580C]" />
            <span>This assistant provides general information, not legal advice.</span>
          </div>

          {/* Message History Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#FDF6EE]/30 flex flex-col gap-4">
            {messages.map(m => (
              <div key={m.id} className="flex flex-col">
                <div className={`flex gap-2.5 items-end max-w-[85%] ${m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === 'user' ? 'bg-[#7B1D2E] text-white' : 'bg-[#E8C9A8]/40 text-[#7B1D2E]'}`}>
                    {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  
                  {/* Bubble */}
                  <div className={`p-3 rounded-2xl text-[13.5px] leading-relaxed shadow-sm font-sans whitespace-pre-line ${
                    m.role === 'user' 
                      ? 'bg-[#7B1D2E] text-white rounded-br-sm' 
                      : 'bg-white text-[#1A0A0D] border border-[#E8C9A8]/60 rounded-bl-sm'
                  }`}>
                    {m.text}
                    <div className={`text-[9px] mt-1.5 opacity-60 text-right ${m.role === 'user' ? 'text-white/80' : 'text-[#5A3A42]/80'}`}>
                      {m.time}
                    </div>
                  </div>
                </div>

                {/* Suggested Specialization Search Route Button */}
                {m.role === 'assistant' && m.category && (
                  <div className="ml-9 mt-2 flex flex-col items-start">
                    <Link 
                      href={`/search?specialization=${encodeURIComponent(m.category)}`}
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#7B1D2E] text-[#7B1D2E] hover:bg-[#7B1D2E] hover:text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <Shield size={12} />
                      Find {m.category} Lawyers →
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Loading/Typing Indicator */}
            {isTyping && (
              <div className="flex gap-2.5 items-end max-w-[85%] self-start">
                <div className="w-7 h-7 rounded-lg bg-[#E8C9A8]/40 text-[#7B1D2E] flex items-center justify-center flex-shrink-0">
                  <Bot size={13} />
                </div>
                <div className="p-3 bg-white border border-[#E8C9A8]/60 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-[#7B1D2E]/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#7B1D2E]/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#7B1D2E]/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Quick suggestions if history is fresh */}
          {messages.length < 3 && !isTyping && (
            <div className="px-3 pb-3 pt-1 flex gap-2 overflow-x-auto scrollbar-none select-none">
              {SUGGESTIONS.map(sug => (
                <button 
                  key={sug} 
                  onClick={() => handleSend(sug)} 
                  className="px-3 py-1.5 bg-white border border-[#E8C9A8] rounded-full text-xs font-semibold text-[#5A3A42] hover:bg-[#FDF6EE] whitespace-nowrap cursor-pointer transition flex-shrink-0"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Footer Form */}
          <div className="p-3 bg-white border-t border-[#E8C9A8]/60 flex gap-2 items-center">
            <input 
              type="text" 
              placeholder="Ask any general legal question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
              className="flex-1 bg-[#F9EEE4]/40 border border-[#E8C9A8]/40 rounded-xl px-4 py-2.5 text-[13.5px] outline-none focus:border-[#7B1D2E]/50 focus:ring-1 focus:ring-[#7B1D2E]/25 text-[#1A0A0D]"
            />
            <button 
              onClick={() => handleSend()} 
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl bg-[#7B1D2E] hover:bg-[#5C1521] text-white flex items-center justify-center cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Footnote */}
          <div className="bg-[#FAF4ED] text-[10px] text-[#5A3A42] px-4 py-2 text-center border-t border-[#E8C9A8]/30">
            For case outcomes or professional advice, speak with a verified lawyer.
          </div>

        </div>
      )}

      {/* Styled inline helper classes for responsive mobile layout */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .mobile-full-screen {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            bottom: 0 !important;
            right: 0 !important;
            border-radius: 0 !important;
          }
        }
      `}</style>

    </div>
  )
}
