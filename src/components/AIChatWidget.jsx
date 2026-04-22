import { useState, useRef, useEffect } from 'react'

const QUICK = ['What documents do I need?','How long does a divorce case take?','What is bail?','How to file consumer complaint?','What are my tenant rights?']

const ANSWERS = {
  'divorce': 'A divorce case in India typically takes 6 months to 2+ years depending on mutual consent or contested. Mutual consent divorce under Section 13B takes a minimum of 6 months. You need: marriage certificate, address proof, passport photos, and separation evidence.',
  'bail': 'Bail is a legal mechanism allowing an accused person to be released from custody pending trial. In India there are 3 types: Regular Bail (Section 437/439 CrPC), Anticipatory Bail (Section 438), and Interim Bail. A criminal lawyer can file a bail application in court.',
  'consumer': 'To file a consumer complaint in India: 1) Try resolving with the company first. 2) File on consumerhelpline.gov.in or the National Consumer Helpline (1800-11-4000). 3) For claims up to ₹1 crore, file at District Consumer Forum. You need: purchase proof, complaint details, and company response.',
  'tenant': 'As a tenant in India, your key rights include: right to a written rental agreement, protection against illegal eviction (must be done through court), right to basic amenities, right to privacy, and right to get security deposit back within 30 days of vacating.',
  'documents': 'Common legal documents you may need: Aadhar Card, PAN Card, address proof, any existing agreements related to your case, photographs, and case-specific documents like property papers (property disputes), marriage certificate (divorce), or purchase receipts (consumer cases).',
  'default': 'That is a great legal question! For accurate advice specific to your situation, I recommend consulting one of our verified lawyers. They can review your case details and give you expert guidance. 👉 Use the "Find a Lawyer" button to connect with an expert near you.'
}

function getAnswer(q) {
  const lower = q.toLowerCase()
  if (lower.includes('divorce')||lower.includes('marriage')||lower.includes('separation')) return ANSWERS.divorce
  if (lower.includes('bail')||lower.includes('arrest')||lower.includes('custody')) return ANSWERS.bail
  if (lower.includes('consumer')||lower.includes('product')||lower.includes('complaint')) return ANSWERS.consumer
  if (lower.includes('tenant')||lower.includes('rent')||lower.includes('landlord')||lower.includes('evict')) return ANSWERS.tenant
  if (lower.includes('document')||lower.includes('paper')||lower.includes('need')) return ANSWERS.documents
  return ANSWERS.default
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([{ type:'bot', text:"Hello! 👋 I'm your AI Legal Assistant. I can answer basic legal questions. For specific advice, please consult a verified lawyer." }])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [msgs, typing])

  const send = (text) => {
    const q = text || input.trim()
    if (!q) return
    setInput('')
    setMsgs(m=>[...m,{type:'user',text:q}])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMsgs(m=>[...m,{type:'bot',text:getAnswer(q)}])
    }, 1000 + Math.random()*800)
  }

  return (
    <>
      {/* FAB */}
      <button onClick={()=>setOpen(o=>!o)} style={s.fab} title="AI Legal Assistant">
        <span style={{fontSize:'1.4rem'}}>{open?'✕':'⚖'}</span>
        {!open&&<div style={s.fabBadge}>AI</div>}
      </button>

      {/* Chat Window */}
      {open && (
        <div style={s.window}>
          {/* Header */}
          <div style={s.header}>
            <div style={s.headerLeft}>
              <div style={s.botAv}>⚖</div>
              <div>
                <div style={{fontWeight:700,fontSize:'0.9rem',color:'#fff'}}>Legal Assistant</div>
                <div style={{fontSize:'0.72rem',color:'rgba(255,255,255,0.7)',display:'flex',alignItems:'center',gap:4}}>
                  <span style={{width:6,height:6,background:'#4ADE80',borderRadius:'50%',display:'inline-block'}}/>AI Powered
                </div>
              </div>
            </div>
            <button onClick={()=>setOpen(false)} style={s.closeBtn}>✕</button>
          </div>

          {/* Messages */}
          <div style={s.msgs}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:'flex',justifyContent:m.type==='user'?'flex-end':'flex-start',marginBottom:10}}>
                {m.type==='bot'&&<div style={s.botIcon}>⚖</div>}
                <div className={m.type==='user'?'chat-bubble-user':'chat-bubble-bot'}>{m.text}</div>
              </div>
            ))}
            {typing&&(
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <div style={s.botIcon}>⚖</div>
                <div className="chat-bubble-bot" style={{display:'flex',gap:4,alignItems:'center'}}>
                  <div style={s.typingDot}/>
                  <div style={{...s.typingDot,animationDelay:'0.2s'}}/>
                  <div style={{...s.typingDot,animationDelay:'0.4s'}}/>
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick Questions */}
          <div style={s.quickWrap}>
            <div style={{fontSize:'0.72rem',color:'var(--text-muted)',fontWeight:600,marginBottom:6}}>Quick Questions</div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
              {QUICK.map(q=>(
                <button key={q} onClick={()=>send(q)} style={s.quickBtn}>{q}</button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div style={s.inputRow}>
            <input style={s.input} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask a legal question..." />
            <button onClick={()=>send()} style={s.sendBtn} disabled={!input.trim()}>→</button>
          </div>
          <div style={{padding:'0.4rem 1rem',fontSize:'0.68rem',color:'var(--text-muted)',textAlign:'center'}}>
            ⚠️ AI answers are general — consult a lawyer for specific advice
          </div>
        </div>
      )}

      <style>{`
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
      `}</style>
    </>
  )
}

const s={
  fab:{position:'fixed',bottom:'2rem',left:'2rem',zIndex:990,width:58,height:58,borderRadius:'50%',background:'linear-gradient(135deg,var(--burgundy),var(--burgundy-light))',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',boxShadow:'0 4px 20px rgba(123,29,46,0.4)',transition:'all 0.3s'},
  fabBadge:{position:'absolute',top:-4,right:-4,background:'var(--gold)',color:'#fff',fontSize:'0.55rem',fontWeight:700,padding:'2px 5px',borderRadius:6},
  window:{position:'fixed',bottom:'5.5rem',left:'2rem',zIndex:989,width:340,background:'#fff',borderRadius:'var(--radius-xl)',boxShadow:'var(--shadow-xl)',border:'1px solid var(--border)',display:'flex',flexDirection:'column',maxHeight:520,overflow:'hidden',animation:'slideUp 0.3s ease'},
  header:{background:'linear-gradient(135deg,var(--burgundy),var(--burgundy-light))',padding:'1rem 1.2rem',display:'flex',justifyContent:'space-between',alignItems:'center'},
  headerLeft:{display:'flex',alignItems:'center',gap:10},
  botAv:{width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',color:'#fff'},
  closeBtn:{background:'rgba(255,255,255,0.15)',border:'none',color:'#fff',width:28,height:28,borderRadius:'50%',cursor:'pointer',fontSize:'0.8rem'},
  msgs:{flex:1,overflowY:'auto',padding:'1rem',display:'flex',flexDirection:'column',gap:2},
  botIcon:{width:24,height:24,borderRadius:'50%',background:'rgba(123,29,46,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',flexShrink:0,marginRight:6,marginTop:2},
  typingDot:{width:7,height:7,background:'var(--text-muted)',borderRadius:'50%',animation:'typingBounce 1s infinite'},
  quickWrap:{padding:'0.6rem 1rem',borderTop:'1px solid var(--border)',background:'var(--cream)'},
  quickBtn:{padding:'0.28rem 0.7rem',background:'#fff',border:'1px solid var(--border)',borderRadius:50,fontSize:'0.7rem',cursor:'pointer',color:'var(--burgundy)',fontWeight:600,fontFamily:'Nunito,sans-serif',transition:'all 0.2s'},
  inputRow:{display:'flex',gap:8,padding:'0.7rem 1rem',borderTop:'1px solid var(--border)'},
  input:{flex:1,padding:'0.6rem 0.9rem',border:'1.5px solid var(--border)',borderRadius:50,fontSize:'0.85rem',outline:'none',fontFamily:'Nunito,sans-serif'},
  sendBtn:{width:36,height:36,borderRadius:'50%',background:'var(--burgundy)',color:'#fff',border:'none',cursor:'pointer',fontSize:'1rem',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0},
}
