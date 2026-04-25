import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Bot, User, Globe, Trash2 } from 'lucide-react'

const SUGGESTIONS = [
  "How to file a divorce?",
  "Consumer court procedure",
  "Property dispute advice",
  "Hindi me jankari chahiye",
  "Divorce ke liye kya karein?"
]

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [language, setLanguage] = useState('en') // en or hi
  const scrollRef = useRef(null)

  useEffect(() => {
    const saved = localStorage.getItem('jj_chat_history')
    if (saved) {
      setMessages(JSON.parse(saved))
    } else {
      setMessages([{
        id: 1,
        role: 'bot',
        text: "Namaste! I am your AI Legal Assistant. How can I help you today? \n\n(Main apki legal madad kaise kar sakta hoon?)",
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

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let botResponse = ""
      const lower = msg.toLowerCase()

      if (lower.includes('hindi')) {
        botResponse = "Zaroor! Main Hindi mein bhi apki madad kar sakta hoon. Aap apna sawal puchiye."
        setLanguage('hi')
      } else if (lower.includes('divorce') || lower.includes('talaq')) {
        botResponse = "Divorce in India depends on personal laws. Generally, you can file for mutual consent or contested divorce. I recommend speaking with a Family Law specialist on Justice Junction for your specific situation."
      } else if (lower.includes('property')) {
        botResponse = "Property disputes usually involve title verification, possession claims, or partition suits. You should consult a Property Lawyer to review your documents."
      } else {
        botResponse = "I understand your concern. To give you accurate legal advice, I would need more details. You can also browse our 'Know Your Rights' hub or book a consultation with one of our verified lawyers."
      }

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1500)
  }

  const clearChat = () => {
    if (window.confirm("Clear chat history?")) {
      const initial = [{
        id: 1,
        role: 'bot',
        text: "Chat cleared. How can I help you now?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]
      setMessages(initial)
      localStorage.setItem('jj_chat_history', JSON.stringify(initial))
    }
  }

  return (
    <div style={s.container}>
      {/* Floating Button */}
      {!isOpen && (
        <button style={s.fab} onClick={() => setIsOpen(true)}>
          <MessageSquare size={28} />
          <span style={s.fabLabel}>Ask AI</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={s.window}>
          {/* Header */}
          <div style={s.header}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={s.botIcon}><Bot size={20}/></div>
              <div>
                <div style={{fontWeight:800, fontSize:'.9rem'}}>Legal Assistant AI</div>
                <div style={{fontSize:'.7rem', color:'rgba(255,255,255,0.7)', display:'flex', alignItems:'center', gap:4}}>
                  <span style={s.onlineDot} /> Online · Hindi/English
                </div>
              </div>
            </div>
            <div style={{display:'flex', gap:10}}>
              <button onClick={clearChat} style={s.iconBtn} title="Clear Chat"><Trash2 size={16}/></button>
              <button onClick={() => setIsOpen(false)} style={s.iconBtn}><X size={20}/></button>
            </div>
          </div>

          {/* Messages */}
          <div style={s.messageArea}>
            {messages.map(m => (
              <div key={m.id} style={{...s.msgWrapper, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start'}}>
                {m.role === 'bot' && <div style={s.msgAvatar}><Bot size={14}/></div>}
                <div style={{...s.msgBubble, ...(m.role === 'user' ? s.userBubble : s.botBubble)}}>
                  {m.text}
                  <div style={s.msgTime}>{m.time}</div>
                </div>
                {m.role === 'user' && <div style={{...s.msgAvatar, background:'var(--bur)', color:'#fff'}}><User size={14}/></div>}
              </div>
            ))}
            {isTyping && (
              <div style={s.msgWrapper}>
                <div style={s.msgAvatar}><Bot size={14}/></div>
                <div style={s.typing}>
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Suggestions */}
          {messages.length < 4 && !isTyping && (
            <div style={s.suggestions}>
              {SUGGESTIONS.map(sug => (
                <button key={sug} style={s.sugBtn} onClick={() => handleSend(sug)}>{sug}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={s.inputArea}>
            <input 
              style={s.input} 
              placeholder="Ask anything (e.g. Divorce laws...)" 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button style={s.sendBtn} onClick={() => handleSend()}>
              <Send size={18} />
            </button>
          </div>
          
          <div style={s.footer}>
            AI can make mistakes. For serious matters, book a verified lawyer.
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  container: { position: 'fixed', bottom: 30, right: 30, zIndex: 10000, fontFamily: 'Plus Jakarta Sans, sans-serif' },
  fab: { width: 64, height: 64, borderRadius: '24px', background: 'var(--bur)', color: '#fff', border: 'none', boxShadow: '0 10px 30px rgba(123,29,46,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative' },
  fabLabel: { position: 'absolute', right: 80, background: '#fff', color: 'var(--txt)', padding: '.4rem .8rem', borderRadius: '12px', fontSize: '.8rem', fontWeight: 800, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', whiteSpace: 'nowrap', border: '1px solid var(--border)' },
  
  window: { width: 380, height: 550, background: '#fff', borderRadius: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border)', animation: 'slideUpChat .4s ease' },
  header: { padding: '1.2rem 1.5rem', background: 'var(--bur)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  botIcon: { width: 36, height: 36, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  onlineDot: { width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' },
  iconBtn: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8, padding: 4 },
  
  messageArea: { flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem', background: '#FDFCFB' },
  msgWrapper: { display: 'flex', gap: 8, alignItems: 'flex-end' },
  msgAvatar: { width: 28, height: 28, borderRadius: '10px', background: 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bur)', flexShrink: 0 },
  msgBubble: { maxWidth: '75%', padding: '.9rem 1.1rem', borderRadius: '18px', fontSize: '.9rem', lineHeight: 1.5, position: 'relative' },
  botBubble: { background: '#fff', color: 'var(--txt)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 },
  userBubble: { background: 'var(--bur)', color: '#fff', borderBottomRightRadius: 4 },
  msgTime: { fontSize: '.65rem', marginTop: 4, opacity: 0.6, textAlign: 'right' },
  
  typing: { background: '#fff', padding: '.8rem 1.2rem', borderRadius: '18px', border: '1px solid var(--border)', display: 'flex', gap: 4 },
  
  suggestions: { padding: '0 1.2rem 1rem', display: 'flex', gap: 8, overflowX: 'auto', whiteSpace: 'nowrap' },
  sugBtn: { padding: '.5rem 1rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '.8rem', fontWeight: 600, color: 'var(--txt-2)', cursor: 'pointer', transition: 'all .2s' },
  
  inputArea: { padding: '1rem 1.2rem', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' },
  input: { flex: 1, border: 'none', background: '#F3F4F6', padding: '.8rem 1.2rem', borderRadius: '14px', outline: 'none', fontSize: '.9rem' },
  sendBtn: { width: 44, height: 44, borderRadius: '14px', background: 'var(--bur)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  
  footer: { padding: '.6rem', textAlign: 'center', fontSize: '.65rem', color: 'var(--txt-3)', background: '#F9FAFB', borderTop: '1px solid var(--border)' }
}
