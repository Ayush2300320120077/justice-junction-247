import { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, Bot, User, Trash2, Calendar, FileText, Scale, AlertTriangle, ArrowRight, ThumbsUp, ThumbsDown, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { useLocation, Link } from 'react-router-dom'
import { API } from '../api'

const SUGGESTIONS = [
  "How to file a consumer complaint for a defective product?",
  "How do I draft a rental agreement?",
  "Estimate my consumer case outcome",
  "Rights during arrest in India",
  "I need a lawyer for property dispute"
]

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [expandedSources, setExpandedSources] = useState({})
  const scrollRef = useRef(null)

  // Safe React Router location check to hide widget on /admin routes
  let pathname = ''
  try {
    const location = useLocation()
    pathname = location.pathname
  } catch (e) {
    if (typeof window !== 'undefined') pathname = window.location.pathname
  }

  useEffect(() => {
    const saved = localStorage.getItem('jj_chat_history')
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

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('jj_chat_history', JSON.stringify(messages))
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (pathname.startsWith('/admin')) {
    return null
  }

  function getInitialMessage() {
    return [{
      id: 1,
      role: 'bot',
      text: "Namaste! 🙏 I am your AI Legal Assistant. Ask me any general question on Indian law, or ask me to draft documents or estimate case timelines.",
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
      // Build rolling history (last 6 messages max)
      const rollingHistory = updatedMessages
        .filter(m => m.role === 'user' || m.role === 'bot')
        .slice(-6)
        .map(m => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          text: m.text
        }))

      const data = await API.chat({
        message: msgText,
        history: rollingHistory
      })

      const botMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: data.reply || "I couldn't process your query. Please try again.",
        suggestedAction: data.suggestedAction || undefined,
        logId: data.logId || null,
        sources: data.sources || [],
        userRating: null,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error('AIChatWidget error:', err)
      const fallbackMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: "I'm temporarily unavailable. For assistance or legal advice, please search our verified lawyer directory.",
        suggestedAction: { type: 'lawyer', link: '/search' },
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, fallbackMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleFeedback = async (msgId, logId, rating) => {
    if (!logId) return
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, userRating: rating } : m))
    try {
      await API.rateInteraction({ logId, rating })
    } catch (err) {
      console.warn('Failed to send interaction rating:', err)
    }
  }

  const toggleSources = (msgId) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }))
  }

  const clearChat = () => {
    if (window.confirm("Clear chat history?")) {
      const initial = getInitialMessage()
      setMessages(initial)
      localStorage.setItem('jj_chat_history', JSON.stringify(initial))
    }
  }

  const renderSuggestedAction = (action) => {
    if (!action || !action.link) return null

    let icon = <ArrowRight size={16} />
    let label = "Learn More"

    if (action.type === 'document') {
      icon = <FileText size={16} className="text-amber-700" />
      label = "Draft Document Generator →"
    } else if (action.type === 'estimate') {
      icon = <Scale size={16} className="text-amber-700" />
      label = "Estimate Case Timeline →"
    } else if (action.type === 'lawyer') {
      icon = <Calendar size={16} className="text-amber-700" />
      label = "Find a Verified Lawyer →"
    }

    return (
      <div style={s.ctaCard}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          <span style={{ fontWeight: 700, fontSize: '.82rem', color: 'var(--txt)' }}>Suggested Tool</span>
        </div>
        <Link to={action.link} style={s.ctaBtn} onClick={() => setIsOpen(false)}>
          {label}
        </Link>
      </div>
    )
  }

  const renderSources = (msg) => {
    if (!msg.sources || msg.sources.length === 0) return null
    const isExpanded = expandedSources[msg.id]

    return (
      <div style={s.sourcesBox}>
        <button style={s.sourcesToggleBtn} onClick={() => toggleSources(msg.id)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BookOpen size={13} style={{ color: '#7B1D2E' }} />
            <span>Cited Legal Sources ({msg.sources.length})</span>
          </div>
          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {isExpanded && (
          <div style={s.sourcesList}>
            {msg.sources.map((src, idx) => (
              <div key={idx} style={s.sourceItem}>
                <div style={{ fontWeight: 700, color: 'var(--txt)' }}>
                  {src.actName} · Sec. {src.sectionNumber}
                </div>
                {src.sectionTitle && <div style={{ fontSize: '.7rem', color: '#6B7280' }}>{src.sectionTitle}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderFeedbackButtons = (msg) => {
    if (msg.role !== 'bot' || !msg.logId) return null

    const isUp = msg.userRating === 5
    const isDown = msg.userRating === 1

    return (
      <div style={s.feedbackRow}>
        <span style={{ fontSize: '.68rem', color: '#9CA3AF' }}>Helpful?</span>
        <button
          style={{ ...s.feedbackBtn, ...(isUp ? s.feedbackBtnActive : {}) }}
          onClick={() => handleFeedback(msg.id, msg.logId, 5)}
          title="Thumbs Up"
        >
          <ThumbsUp size={13} />
        </button>
        <button
          style={{ ...s.feedbackBtn, ...(isDown ? s.feedbackBtnActive : {}) }}
          onClick={() => handleFeedback(msg.id, msg.logId, 1)}
          title="Thumbs Down"
        >
          <ThumbsDown size={13} />
        </button>
      </div>
    )
  }

  return (
    <div style={s.container}>
      {!isOpen && (
        <button style={s.fab} onClick={() => setIsOpen(true)} aria-label="Ask a legal question" className="fab-responsive">
          <MessageSquare size={28} />
          <span style={s.fabLabel} className="mobile-hide fab-label-mobile">Ask AI Legal Assistant</span>
        </button>
      )}

      {isOpen && (
        <div style={s.window} className="chat-window-responsive">
          {/* Header */}
          <div style={s.header}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={s.botIcon}><Bot size={20}/></div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '.9rem' }}>AI Legal Assistant</div>
                <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={s.onlineDot} /> RAG Enabled · Indian Law
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={clearChat} style={s.iconBtn} title="Clear Chat"><Trash2 size={16}/></button>
              <button onClick={() => setIsOpen(false)} style={s.iconBtn}><X size={20}/></button>
            </div>
          </div>

          {/* Persistent Top Disclaimer */}
          <div style={s.disclaimerBanner}>
            <AlertTriangle size={14} style={{ flexShrink: 0, color: '#D97706' }} />
            <span>General information only, not legal advice.</span>
          </div>

          {/* Message Area */}
          <div style={s.messageArea}>
            {messages.map(m => (
              <div key={m.id}>
                <div style={{ ...s.msgWrapper, justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.role === 'bot' && <div style={s.msgAvatar}><Bot size={14}/></div>}
                  <div style={{ ...s.msgBubble, ...(m.role === 'user' ? s.userBubble : s.botBubble) }}>
                    {m.text}
                    <div style={s.msgTime}>{m.time}</div>
                  </div>
                  {m.role === 'user' && <div style={{ ...s.msgAvatar, background: 'var(--bur)', color: '#fff' }}><User size={14}/></div>}
                </div>
                {m.role === 'bot' && renderSources(m)}
                {m.role === 'bot' && renderFeedbackButtons(m)}
                {m.role === 'bot' && m.suggestedAction && renderSuggestedAction(m.suggestedAction)}
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

          {/* Suggestions */}
          {messages.length < 4 && !isTyping && (
            <div style={s.suggestions}>
              {SUGGESTIONS.map(sug => (
                <button key={sug} style={s.sugBtn} onClick={() => handleSend(sug)}>{sug}</button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div style={s.inputArea}>
            <input
              style={s.input}
              placeholder="Ask any legal question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button style={s.sendBtn} onClick={() => handleSend()} disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </button>
          </div>

          <div style={s.footer}>
            AI legal information. Consult a verified lawyer for specific cases.
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
  window: { width: 390, height: 580, background: '#fff', borderRadius: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid var(--border)', animation: 'slideUpChat .4s ease' },
  header: { padding: '1rem 1.25rem', background: 'var(--bur)', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  botIcon: { width: 36, height: 36, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  onlineDot: { width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' },
  iconBtn: { background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8, padding: 4 },
  disclaimerBanner: { padding: '.45rem .85rem', background: '#FEF3C7', color: '#92400E', fontSize: '.72rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, borderBottom: '1px solid #FCD34D' },
  messageArea: { flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FDFCFB' },
  msgWrapper: { display: 'flex', gap: 8, alignItems: 'flex-end' },
  msgAvatar: { width: 28, height: 28, borderRadius: '10px', background: 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bur)', flexShrink: 0 },
  msgBubble: { maxWidth: '80%', padding: '.85rem 1.1rem', borderRadius: '18px', fontSize: '.88rem', lineHeight: 1.55, whiteSpace: 'pre-line' },
  botBubble: { background: '#fff', color: 'var(--txt)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 },
  userBubble: { background: 'var(--bur)', color: '#fff', borderBottomRightRadius: 4 },
  msgTime: { fontSize: '.62rem', marginTop: 4, opacity: 0.55, textAlign: 'right' },
  sourcesBox: { marginLeft: 36, marginTop: 6, background: '#F3F4F6', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' },
  sourcesToggleBtn: { width: '100%', padding: '.45rem .75rem', background: 'none', border: 'none', fontSize: '.74rem', fontWeight: 700, color: 'var(--txt)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  sourcesList: { padding: '.5rem .75rem', borderTop: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: 6, fontSize: '.74rem', background: '#fff' },
  sourceItem: { padding: '.35rem .5rem', background: '#F9FAFB', borderRadius: '8px', border: '1px solid #F3F4F6' },
  feedbackRow: { marginLeft: 36, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 },
  feedbackBtn: { background: 'none', border: '1px solid #E5E7EB', borderRadius: '6px', padding: '3px 6px', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' },
  feedbackBtnActive: { background: '#7B1D2E', color: '#fff', borderColor: '#7B1D2E' },
  ctaCard: { marginLeft: 36, marginTop: 8, background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '16px', padding: '.75rem 1rem', display: 'flex', flexDirection: 'column', gap: 6 },
  ctaBtn: { marginTop: 4, background: 'var(--bur)', color: '#fff', padding: '.4rem .9rem', borderRadius: '10px', fontSize: '.78rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center', display: 'inline-block' },
  typing: { background: '#fff', padding: '.8rem 1.2rem', borderRadius: '18px', border: '1px solid var(--border)', display: 'flex', gap: 5 },
  suggestions: { padding: '0 1rem .8rem', display: 'flex', gap: 6, overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' },
  sugBtn: { padding: '.45rem .9rem', background: '#fff', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '.76rem', fontWeight: 600, color: 'var(--txt-2)', cursor: 'pointer', flexShrink: 0 },
  inputArea: { padding: '.8rem 1rem', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, alignItems: 'center' },
  input: { flex: 1, border: 'none', background: '#F3F4F6', padding: '.75rem 1.1rem', borderRadius: '14px', outline: 'none', fontSize: '.88rem' },
  sendBtn: { width: 44, height: 44, borderRadius: '14px', background: 'var(--bur)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  footer: { padding: '.45rem', textAlign: 'center', fontSize: '.62rem', color: 'var(--txt-3)', background: '#F9FAFB', borderTop: '1px solid var(--border)' }
}

