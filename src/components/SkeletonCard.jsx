export default function SkeletonCard() {
  return (
    <div style={s.card}>
      <div style={s.shimmer}>
        <div style={s.avatar} />
        <div style={{flex:1}}>
          <div style={s.line1} />
          <div style={s.line2} />
          <div style={s.line3} />
        </div>
      </div>
      <div style={s.divider} />
      <div style={s.footer}>
        <div style={s.line4} />
        <div style={s.btn} />
      </div>
    </div>
  )
}

const s = {
  card: { background:'#fff', borderRadius:'24px', padding:'1.5rem', border:'1px solid var(--border)', overflow:'hidden' },
  shimmer: { display:'flex', gap:'1rem', alignItems:'center' },
  avatar: { width:64, height:64, borderRadius:'16px', background:'#eee', animation:'skeletonPulse 1.5s infinite ease-in-out' },
  line1: { height:18, width:'70%', background:'#eee', borderRadius:4, marginBottom:8, animation:'skeletonPulse 1.5s infinite ease-in-out' },
  line2: { height:12, width:'40%', background:'#eee', borderRadius:4, marginBottom:12, animation:'skeletonPulse 1.5s infinite ease-in-out' },
  line3: { height:12, width:'60%', background:'#eee', borderRadius:4, animation:'skeletonPulse 1.5s infinite ease-in-out' },
  divider: { height:1, background:'#eee', margin:'1.2rem 0' },
  footer: { display:'flex', justifyContent:'space-between', alignItems:'center' },
  line4: { height:24, width:80, background:'#eee', borderRadius:4, animation:'skeletonPulse 1.5s infinite ease-in-out' },
  btn: { height:36, width:100, background:'#eee', borderRadius:10, animation:'skeletonPulse 1.5s infinite ease-in-out' }
}
