'use client'
import { useState } from 'react'
import type { SearchFilters } from '@/types'

export function AlertSetupSheet({ filters, onClose, onSave }: { filters: SearchFilters; onClose: () => void; onSave: (email: string) => void }) {
  const [email, setEmail] = useState('')
  const [freq, setFreq] = useState<'instant'|'daily'>('instant')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    if (!email) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setSaving(false); setSaved(true)
    setTimeout(() => { onSave(email); onClose() }, 1500)
  }

  return (
    <>
      <div style={{position:'fixed', inset:0, background:'rgba(28,43,26,0.6)', zIndex:40}} onClick={onClose} />
      <div style={{position:'fixed', bottom:0, left:0, right:0, zIndex:50, background:'#F5F0E8', borderRadius:'16px 16px 0 0', padding:'24px 20px 40px', maxWidth:480, margin:'0 auto'}}>
        <div style={{width:40, height:4, background:'#D4E4B8', borderRadius:2, margin:'0 auto 20px'}} />
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20}}>
          <h2 style={{fontFamily:'Playfair Display, Georgia, serif', fontSize:20, color:'#1C2B1A'}}>Set up your alert</h2>
          <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', fontSize:18, color:'#6B8558'}}><i className="ti ti-x" /></button>
        </div>
        <div style={{background:'white', borderRadius:12, border:'1px solid #D4E4B8', padding:16, marginBottom:20}}>
          <p style={{fontFamily:'IBM Plex Mono, monospace', fontSize:12, color:'#4A7C2F', marginBottom:8}}>/ alert criteria</p>
          <div style={{fontSize:14, color:'#1C2B1A', display:'flex', flexDirection:'column', gap:4}}>
            <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#6B8558'}}>Region</span><span>{filters.region}</span></div>
            <div style={{display:'flex', justifyContent:'space-between'}}><span style={{color:'#6B8558'}}>Dates</span><span>{filters.checkIn} → {filters.checkOut}</span></div>
          </div>
        </div>
        <div style={{marginBottom:16}}>
          <label className="field-label">Email for alerts</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="field-control" />
        </div>
        <div style={{marginBottom:24}}>
          <p className="field-label">Alert frequency</p>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            {(['instant','daily'] as const).map(f => (
              <button key={f} onClick={() => setFreq(f)} style={{padding:'10px', borderRadius:12, fontSize:13, fontWeight:500, border:'1px solid', cursor:'pointer', background: freq===f ? '#2D5016' : 'white', color: freq===f ? '#C8E6A0' : '#1C2B1A', borderColor: freq===f ? '#2D5016' : '#D4E4B8'}}>
                {f === 'instant' ? '⚡ Instant' : '📬 Daily digest'}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleSave} disabled={!email||saving||saved} style={{width:'100%', background:'#E8622A', color:'white', border:'none', borderRadius:12, padding:'16px', fontSize:16, fontWeight:600, cursor:'pointer', opacity: (!email||saving||saved) ? 0.6 : 1}}>
          {saved ? '✓ Alert saved!' : saving ? 'Saving…' : '🔔 Save alert'}
        </button>
        <p style={{textAlign:'center', fontSize:12, color:'#6B8558', marginTop:12}}>We&apos;ll only email you when a matching site is available.</p>
      </div>
    </>
  )
}
