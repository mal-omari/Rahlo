'use client'
import type { CampsiteResult } from '@/types'
import { AVAILABILITY_CONFIG, FEATURE_CONFIG } from '@/types'
import { formatDriveTime, buildBookingUrl } from '@/lib/utils'

export function CampsiteCard({ result, checkIn, checkOut, onAlert }: { result: CampsiteResult; checkIn: string; checkOut: string; onAlert?: (r: CampsiteResult) => void }) {
  const avail = AVAILABILITY_CONFIG[result.availabilityLevel]
  const bookingUrl = buildBookingUrl(result.ontarioParksId, result.resourceLocationId, checkIn, checkOut, 2)
  return (
    <article style={{background:'white', borderRadius:12, border:'1px solid #E8EFD8', overflow:'hidden', marginBottom:12}}>
      <div style={{padding:16}}>
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8}}>
          <div>
            <h3 style={{fontFamily:'Playfair Display, Georgia, serif', fontSize:17, color:'#1C2B1A', margin:0}}>{result.parkName}</h3>
            <p style={{fontSize:13, color:'#6B8558', margin:'2px 0 0'}}>{result.siteName}</p>
          </div>
          <div style={{display:'flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:20, fontFamily:'IBM Plex Mono, monospace', fontSize:12, fontWeight:500, flexShrink:0, marginLeft:8}} className={`${avail.bgClass} ${avail.textClass}`}>
            <span style={{width:6, height:6, borderRadius:'50%', display:'inline-block'}} className={avail.dotClass} />
            {avail.label(result.availableCount)}
          </div>
        </div>
        <div style={{display:'flex', gap:16, fontSize:12, color:'#6B8558', marginBottom:12}}>
          <span>🕐 {formatDriveTime(result.driveMinutes)}</span>
          <span>💵 from ${result.pricePerNight}/night</span>
        </div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {result.features.slice(0,4).map(f => (
            <span key={f} style={{background:'#F0F6E8', border:'1px solid #D4E4B8', borderRadius:6, padding:'4px 8px', fontSize:11, color:'#2D5016', fontWeight:500}}>
              {FEATURE_CONFIG[f].emoji} {FEATURE_CONFIG[f].label}
            </span>
          ))}
        </div>
      </div>
      <div style={{background:'#F8FBF2', borderTop:'1px solid #E8EFD8', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <div>
          <p style={{fontSize:11, color:'#94A884', margin:0}}>from</p>
          <p style={{fontFamily:'IBM Plex Mono, monospace', fontSize:17, fontWeight:500, color:'#1C2B1A', margin:0}}>${result.pricePerNight}<span style={{fontSize:11, color:'#94A884', fontWeight:400}}>/night</span></p>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button onClick={() => onAlert?.(result)} style={{display:'flex', alignItems:'center', gap:6, padding:'8px 12px', background:'none', border:'1px solid #D4E4B8', borderRadius:8, fontSize:12, color:'#2D5016', fontWeight:500, cursor:'pointer'}}>
            🔔 Alert me
          </button>
          <a href={bookingUrl} target="_blank" rel="noopener noreferrer" style={{display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'#2D5016', borderRadius:8, fontSize:13, color:'#C8E6A0', fontWeight:500, textDecoration:'none'}}>
            Book ↗
          </a>
        </div>
      </div>
    </article>
  )
}
