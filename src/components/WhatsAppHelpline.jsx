import { MessageCircle } from 'lucide-react'

export default function WhatsAppHelpline() {
  const handleClick = () => {
    const text = encodeURIComponent("Hi Justice Junction 24/7, I need assistance with the platform or finding a lawyer.")
    window.open(`https://wa.me/91XXXXXXXXXX?text=${text}`, '_blank')
  }

  return (
    <button style={s.btn} onClick={handleClick} title="WhatsApp Helpline">
      <MessageCircle size={24} />
      <div style={s.tooltip}>24/7 Support</div>
    </button>
  )
}

const s = {
  btn: { position: 'fixed', bottom: 30, left: 30, zIndex: 9999, width: 56, height: 56, borderRadius: '50%', background: '#25D366', color: '#fff', border: 'none', boxShadow: '0 8px 24px rgba(37,211,102,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .2s' },
  tooltip: { position: 'absolute', left: 66, background: '#fff', color: '#25D366', padding: '.4rem .8rem', borderRadius: '10px', fontSize: '.75rem', fontWeight: 800, border: '1px solid #25D366', whiteSpace: 'nowrap', opacity: 0.9 }
}
