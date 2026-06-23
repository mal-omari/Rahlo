'use client'
import { useEffect, useState } from 'react'

export function Hero() {
  const [count, setCount] = useState(334)
  useEffect(() => {
    const id = setInterval(() => setCount(334 + (Math.random() > 0.5 ? 1 : 0)), 8000)
    return () => clearInterval(id)
  }, [])

  return (
    <section style={{
      background: 'linear-gradient(160deg, #0f1f0e 0%, #1C2B1A 45%, #243d22 100%)',
      padding: '48px 24px 56px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle texture rings */}
      <div style={{position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', border:'1px solid rgba(200,230,160,0.06)', pointerEvents:'none'}} />
      <div style={{position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', border:'1px solid rgba(200,230,160,0.04)', pointerEvents:'none'}} />
      <div style={{position:'absolute', bottom:-60, left:-60, width:240, height:240, borderRadius:'50%', border:'1px solid rgba(200,230,160,0.05)', pointerEvents:'none'}} />

      <div style={{position:'relative', zIndex:1}}>
        <p style={{
          fontFamily:'IBM Plex Mono, monospace',
          fontSize:10,
          color:'#6B8B5A',
          letterSpacing:'3px',
          textTransform:'uppercase',
          marginBottom:20,
        }}>
          Ontario Parks Finder
        </p>

        <div style={{
          display:'inline-flex',
          alignItems:'center',
          gap:8,
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(200,230,160,0.15)',
          borderRadius:24,
          padding:'8px 18px',
          marginBottom:32,
          backdropFilter:'blur(8px)',
        }}>
          <span className="live-dot" style={{width:7, height:7, borderRadius:'50%', background:'#5aad4e', display:'inline-block', boxShadow:'0 0 8px rgba(90,173,78,0.6)'}} />
          <span style={{fontFamily:'IBM Plex Mono, monospace', fontSize:12, color:'#C8E6A0'}}>
            Monitoring <strong>{count}</strong> parks live
          </span>
        </div>

        <h1 style={{
          fontFamily:'Playfair Display, Georgia, serif',
          fontSize:38,
          fontWeight:700,
          color:'#F5F0E8',
          lineHeight:1.12,
          letterSpacing:'-0.8px',
          marginBottom:16,
        }}>
          Get a spot<br />
          <span style={{
            background:'linear-gradient(135deg, #C8E6A0 0%, #9BBE82 100%)',
            WebkitBackgroundClip:'text',
            WebkitTextFillColor:'transparent',
          }}>before they&apos;re gone</span>
        </h1>

        <p style={{
          fontSize:15,
          color:'rgba(155,190,130,0.8)',
          lineHeight:1.65,
          maxWidth:280,
          margin:'0 auto',
        }}>
          Every Ontario park, searched at once. Instant alerts when a site opens up.
        </p>
      </div>
    </section>
  )
}
