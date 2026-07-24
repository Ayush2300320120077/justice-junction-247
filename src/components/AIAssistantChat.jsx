import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { MessageSquare, X, Send, Bot, User, Trash2, Shield, AlertTriangle } from 'lucide-react'
import { API } from '../api'

const SUGGESTIONS = [
  'I need help with a property dispute',
  'How to handle a divorce in India?',
  'What to do if someone cheats me?',
  'Wrongful termination from job',
  'Rental agreement help'
]

export default function AIAssistantChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const scrollRef = useRef(null)
  const router = useRouter()

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

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
      } catch {
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

  // Don't show on admin pages
  if (router.pathname.startsWith('/admin')) return null

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
      const conversationHistory = updatedMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.text }))

      const data = await API.assistant({ message: msgText, conversationHistory, sessionId })

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.reply || 'I am unable to respond right now. Please consult a verified lawyer on JusticeJunction.',
        category: data.category || null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: "I'm temporarily unavailable. Please consult a verified lawyer on JusticeJunction for direct legal help.",
        category: null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear your chat history?')) {
      const initial = getInitialMessage()
      setMessages(initial)
      localStorage.setItem('jj_ai_chat_history', JSON.stringify(initial))
    }
  }

  // ── Dynamic positions based on screen size ──────────────────────────────────
  const launcherStyle = {
    position: 'fixed',
    bottom: isMobile ? 80 : 96,        // 80px mobile, 96px desktop — stacks above WhatsApp
    right: isMobile ? 16 : 24,
    zIndex: 9998,
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: '#7B1D2E',
    color: '#fff',
    border: 'none',
    boxShadow: '0 8px 28px rgba(123,29,46,0.40)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease, background 0.2s ease',
  }

  const panelStyle = isMobile ? {
    // Mobile: near-full-screen panel
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    top: 'auto',
    height: '90vh',
    maxHeight: '90vh',
    width: '100%',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '20px 20px 0 0',
    boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #E8C9A8',
  } : {
    // Desktop: fixed bottom-right panel
    position: 'fixed',
    bottom: 96,                         // sits above the WhatsApp button (bottom-6 = 24px + 56px height + 16px gap)
    right: 24,
    width: 380,
    height: 560,
    maxHeight: 'calc(100vh - 120px)',
    maxWidth: 'calc(100vw - 2rem)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 20,
    boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #E8C9A8',
  }

  return (
    <>
      {/* ── LAUNCHER BUTTON (collapsed state) ─────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={launcherStyle}
          aria-label="Open AI Legal Assistant"
          title="Ask AI Legal Assistant"
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; e.currentTarget.style.background = '#5C1521' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#7B1D2E' }}
        >
          <MessageSquare size={26} />
        </button>
      )}

      {/* ── CHAT PANEL (open state) ────────────────────────────────────── */}
      {isOpen && (
        <div style={panelStyle}>

          {/* 1. HEADER */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: '#7B1D2E',
            color: '#fff',
          }}>
            {/* Left: avatar + title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'rgba(255,255,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Bot size={20} color="#F5C4B3" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.875rem', letterSpacing: '0.01em', color: '#fff' }}>
                  AI Legal Assistant
                </div>
                <div style={{ fontSize: '0.65rem', color: '#F5C4B3', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%',
                    background: '#4ADE80',
                    display: 'inline-block',
                    animation: 'pulseDot 2s infinite',
                  }} />
                  Online · General Info Only
                </div>
              </div>
            </div>

            {/* Right: action buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={clearChat}
                title="Clear Chat"
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)',
                  cursor: 'pointer', padding: 6, borderRadius: 8, lineHeight: 1,
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)',
                  cursor: 'pointer', padding: 6, borderRadius: 8, lineHeight: 1,
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* 2. DISCLAIMER BANNER */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            background: '#FFFBEB',
            borderBottom: '1px solid #FCD34D',
            color: '#92400E',
            fontSize: '0.7rem',
            fontWeight: 700,
            userSelect: 'none',
          }}>
            <AlertTriangle size={13} color="#EA580C" style={{ flexShrink: 0 }} />
            <span>This assistant provides general information, not legal advice.</span>
          </div>

          {/* 3. MESSAGE AREA */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '14px 14px 6px',
            background: '#FAFAF9',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Message row */}
                <div style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'flex-end',
                  maxWidth: '85%',
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                }}>
                  {/* Avatar */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 9, flexShrink: 0,
                    background: m.role === 'user' ? '#7B1D2E' : 'rgba(232,201,168,0.35)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: m.role === 'user' ? '#fff' : '#7B1D2E',
                  }}>
                    {m.role === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>

                  {/* Bubble */}
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: m.role === 'user' ? '#7B1D2E' : '#fff',
                    color: m.role === 'user' ? '#fff' : '#1A0A0D',
                    border: m.role === 'user' ? 'none' : '1px solid rgba(232,201,168,0.6)',
                    fontSize: '0.84rem',
                    lineHeight: 1.55,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    whiteSpace: 'pre-line',
                    wordBreak: 'break-word',
                  }}>
                    {m.text}
                    <div style={{
                      fontSize: '0.65rem',
                      marginTop: 6,
                      opacity: 0.55,
                      textAlign: 'right',
                      color: m.role === 'user' ? 'rgba(255,255,255,0.8)' : '#5A3A42',
                    }}>
                      {m.time}
                    </div>
                  </div>
                </div>

                {/* Lawyer search CTA button */}
                {m.role === 'assistant' && m.category && (
                  <div style={{ marginLeft: 36, marginTop: 6 }}>
                    <Link
                      href={`/search?specialization=${encodeURIComponent(m.category)}`}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 12px',
                        borderRadius: 10,
                        background: '#fff',
                        border: '1.5px solid #7B1D2E',
                        color: '#7B1D2E',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 1px 4px rgba(123,29,46,0.08)',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#7B1D2E'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#7B1D2E' }}
                    >
                      <Shield size={11} />
                      Find {m.category} Lawyers →
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', maxWidth: '85%', alignSelf: 'flex-start' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 9,
                  background: 'rgba(232,201,168,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#7B1D2E', flexShrink: 0,
                }}>
                  <Bot size={13} />
                </div>
                <div style={{
                  padding: '10px 16px',
                  borderRadius: '18px 18px 18px 4px',
                  background: '#fff',
                  border: '1px solid rgba(232,201,168,0.6)',
                  display: 'flex', gap: 5, alignItems: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  {[0, 150, 300].map(delay => (
                    <span key={delay} style={{
                      width: 7, height: 7,
                      borderRadius: '50%',
                      background: 'rgba(123,29,46,0.55)',
                      display: 'inline-block',
                      animation: 'bounce 1.2s infinite',
                      animationDelay: `${delay}ms`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* 4. QUICK SUGGESTIONS (shown when chat is fresh) */}
          {messages.length < 3 && !isTyping && (
            <div style={{
              flexShrink: 0,
              display: 'flex',
              gap: 7,
              overflowX: 'auto',
              padding: '8px 12px',
              background: '#FAFAF9',
              borderTop: '1px solid rgba(232,201,168,0.4)',
              scrollbarWidth: 'none',
            }}>
              {SUGGESTIONS.map(sug => (
                <button
                  key={sug}
                  onClick={() => handleSend(sug)}
                  style={{
                    padding: '5px 12px',
                    background: '#fff',
                    border: '1px solid #E8C9A8',
                    borderRadius: 50,
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#5A3A42',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#FDF6EE' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff' }}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* 5. INPUT BAR */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 12px',
            background: '#fff',
            borderTop: '1px solid #E8C9A8',
          }}>
            <input
              type="text"
              placeholder="Ask any general legal question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
              style={{
                flex: 1,
                border: '1.5px solid #E8C9A8',
                borderRadius: 50,
                padding: '8px 16px',
                fontSize: '0.84rem',
                outline: 'none',
                color: '#1A0A0D',
                background: isTyping ? '#F9F9F9' : '#fff',
                fontFamily: 'var(--font-body)',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(123,29,46,0.5)'}
              onBlur={e => e.target.style.borderColor = '#E8C9A8'}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              style={{
                width: 38, height: 38,
                borderRadius: '50%',
                background: '#7B1D2E',
                color: '#fff',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: !input.trim() || isTyping ? 'not-allowed' : 'pointer',
                opacity: !input.trim() || isTyping ? 0.5 : 1,
                flexShrink: 0,
                transition: 'background 0.15s, opacity 0.15s',
              }}
              onMouseEnter={e => { if (!e.currentTarget.disabled) e.currentTarget.style.background = '#5C1521' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#7B1D2E' }}
            >
              <Send size={15} />
            </button>
          </div>

          {/* 6. FOOTER DISCLAIMER */}
          <div style={{
            flexShrink: 0,
            background: '#FAF4ED',
            borderTop: '1px solid rgba(232,201,168,0.3)',
            padding: '6px 14px',
            textAlign: 'center',
            fontSize: '0.65rem',
            color: '#5A3A42',
          }}>
            For case outcomes or professional advice, speak with a verified lawyer.
          </div>

        </div>
      )}

      {/* Bounce keyframe for typing dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  )
}
