import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Bot, User, Trash2, Calendar } from 'lucide-react'
import Link from 'next/link'

const SUGGESTIONS = [
  "How to file a divorce?",
  "Consumer court procedure",
  "Property dispute advice",
  "Kya main RTI dakhil kar sakta hoon?",
  "Rights during arrest in India"
]

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [aiReplyCount, setAiReplyCount] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('jj_chat_history')
    const savedCount = parseInt(localStorage.getItem('jj_chat_ai_count') || '0')
    if (saved) {
      setMessages(JSON.parse(saved))
      setAiReplyCount(savedCount)
    } else {
      setMessages([{
        id: 1,
        role: 'bot',
        text: "Namaste! 🙏 I'm your free AI Legal Assistant. Ask me any legal question in Hindi or English.\n\n(Main apki legal madad kaise kar sakta hoon?)",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
    }
  }, [])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('jj_chat_history', JSON.stringify(messages))
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleSend = async (text) => {
    const msg = text || input
    if (!msg.trim()) return

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsTyping(true)

    try {
      // Build messages array for API (only user/bot exchanges, not system)
      const apiMessages = updatedMessages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.text }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      })

      const data = await res.json()
      const newCount = aiReplyCount + 1
      setAiReplyCount(newCount)
      localStorage.setItem('jj_chat_ai_count', String(newCount))

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showCTA: newCount >= 2
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: "I'm temporarily unavailable. For personalized advice, speak to a verified lawyer on Justice Junction 24/7.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        showCTA: true
      }
      setMessages(prev => [...prev, botMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    if (window.confirm("Clear chat history?")) {
      const initial = [{
        id: 1, role: 'bot',
        text: "Chat cleared. How can I help you today?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]
      setMessages(initial)
      setAiReplyCount(0)
      localStorage.setItem('jj_chat_history', JSON.stringify(initial))
      localStorage.setItem('jj_chat_ai_count', '0')
    }
  }

  return (
    <div style={s.container}>
      {!isOpen && (
        <button style={s.fab} onClick={() => setIsOpen(true)} aria-label="Ask a legal question" className="fab-responsive">
          <MessageSquare size={28} />
          <span style={s.fabLabel} className="mobile-hide fab-label-mobile">Ask a Legal Question — Free</span>
        </button>
      )}

      {isOpen && (
        <div style={s.window} className="chat-window-responsive">
          <div style={s.header}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={s.botIcon}><Bot size={20}/></div>
              <div>
                <div style={{fontWeight:800, fontSize:'.9rem'}}>AI Legal Assistant</div>
                <div style={{fontSize:'.7rem', color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', gap:4}}>
                  <span style={s.onlineDot} /> Online · Hindi / English
                </div>
              </div>
            </div>
            <div style={{display:'flex', gap:10}}>
              <button onClick={clearChat} style={s.iconBtn} title="Clear Chat"><Trash2 size={16}/></button>
              <button onClick={() => setIsOpen(false)} style={s.iconBtn}><X size={20}/></button>
            </div>
          </div>

          <div style={s.messageArea}>
            {messages.map(m => (
              <div key={m.id}>
                <div style={{...s.msgWrapper, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'}}>
                  {m.role === 'bot' && <div style={s.msgAvatar}><Bot size={14}/></div>}
                  <div style={{...s.msgBubble, ...(m.role === 'user' ? s.userBubble : s.botBubble)}}>
                    {m.text}
                    <div style={s.msgTime}>{m.time}</div>
                  </div>
                  {m.role === 'user' && <div style={{...s.msgAvatar, background:'var(--bur)', color:'#fff'}}><User size={14}/></div>}
                </div>
                {m.showCTA && m.role === 'bot' && (
                  <div style={s.ctaCard}>
                    <Calendar size={16} color="var(--bur)"/>
                    <span style={{fontWeight:700, fontSize:'.82rem', color:'var(--txt)'}}>Book a Free 15-min call with a Lawyer</span>
                    <Link href="/search" style={s.ctaBtn} onClick={() => setIsOpen(false)}>Book Now →</Link>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div style={s.msgWrapper}>
                <div style={s.msgAvatar}><Bot size={14}/></div>
                <div style={s.typing}>
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {messages.length < 4 && !isTyping && (
            <div style={s.suggestions}>
              {SUGGESTIONS.map(sug => (
                <button key={sug} style={s.sugBtn} onClick={() => handleSend(sug)}>{sug}</button>
              ))}
            </div>
          )}

          <div style={s.inputArea}>
            <input
              style={s.input}
              placeholder="Ask any legal question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button style={s.sendBtn} onClick={() => handleSend()} disabled={!input.trim()}>
              <Send size={18} />
            </button>
          </div>

          <div style={s.footer}>
            AI gives general guidance only. Always consult a lawyer for personal cases.
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  container: { position: 'fixed', bottom: 90, right: 30, zIndex: 10000, fontFamily: 'var(--font-body)' },
  fab: { width: 64, height: 64, borderRadius: '24px', background: 'var(--bur)', color: '#fff', border: 'none', boxShadow: '0 10px 30px rgba(123,29,46,0.45)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative' },
  fabLabel: { position: 'absolute', right: 76, background: '#fff', color: 'var(--txt)', padding: '.45rem 1rem', borderRadius: '14px', fontSize: '.78rem', fontWeight: 800, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', whiteSpace: 'nowrap', border: '1px solid var(--border)' },
  window: { width: 390, height: 570, background: '#fff', borderRadius: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border)', animation: 'slideUpChat .4s ease' },
  header: { padding: '1.2rem 1.5rem', background: 'var(--bur)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  botIcon: { width: 36, height: 36, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  onlineDot: { width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' },
  iconBtn: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8, padding: 4 },
  messageArea: { flex: 1, padding: '1.2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FDFCFB' },
  msgWrapper: { display: 'flex', gap: 8, alignItems: 'flex-end' },
  msgAvatar: { width: 28, height: 28, borderRadius: '10px', background: 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bur)', flexShrink: 0 },
  msgBubble: { maxWidth: '75%', padding: '.85rem 1.1rem', borderRadius: '18px', fontSize: '.88rem', lineHeight: 1.55, whiteSpace: 'pre-line' },
  botBubble: { background: '#fff', color: 'var(--txt)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 },
  userBubble: { background: 'var(--bur)', color: '#fff', borderBottomRightRadius: 4 },
  msgTime: { fontSize: '.62rem', marginTop: 4, opacity: 0.55, textAlign: 'right' },
  ctaCard: { marginLeft: 36, marginTop: 8, background: 'var(--gold-p)', border: '1px solid var(--gold)', borderRadius: '16px', padding: '.75rem 1rem', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  ctaBtn: { marginLeft: 'auto', background: 'var(--bur)', color: '#fff', padding: '.35rem .9rem', borderRadius: '10px', fontSize: '.78rem', fontWeight: 800, textDecoration: 'none' },
  typing: { background: '#fff', padding: '.8rem 1.2rem', borderRadius: '18px', border: '1px solid var(--border)', display: 'flex', gap: 5 },
  suggestions: { padding: '0 1rem .8rem', display: 'flex', gap: 6, overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' },
  sugBtn: { padding: '.45rem .9rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '.76rem', fontWeight: 600, color: 'var(--txt-2)', cursor: 'pointer', flexShrink: 0 },
  inputArea: { padding: '.9rem 1.1rem', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center' },
  input: { flex: 1, border: 'none', background: '#F3F4F6', padding: '.75rem 1.1rem', borderRadius: '14px', outline: 'none', fontSize: '.88rem' },
  sendBtn: { width: 44, height: 44, borderRadius: '14px', background: 'var(--bur)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  footer: { padding: '.55rem', textAlign: 'center', fontSize: '.62rem', color: 'var(--txt-3)', background: '#F9FAFB', borderTop: '1px solid var(--border)' }
}
