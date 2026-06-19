'use client'
export function AlertCtaBanner({ onSetAlert }: { onSetAlert: () => void }) {
  return (
    <div style={{margin:'0 16px 20px', background:'#1C2B1A', borderRadius:12, padding:'18px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16}}>
      <div>
        <p style={{fontFamily:'Playfair Display, Georgia, serif', fontSize:16, color:'#F5F0E8', marginBottom:4}}>Nothing perfect yet?</p>
        <p style={{fontSize:14, color:'#9BBE82', lineHeight:1.5}}>Set an alert — we&apos;ll notify you the moment a matching site opens up.</p>
      </div>
      <button onClick={onSetAlert} style={{flexShrink:0, width:44, height:44, background:'#E8622A', borderRadius:10, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}} aria-label="Set alert">
        <i className="ti ti-bell-ringing" style={{fontSize:22, color:'white'}} aria-hidden="true" />
      </button>
    </div>
  )
}
