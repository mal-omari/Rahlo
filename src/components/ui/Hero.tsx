'use client'
import { useEffect, useState } from 'react'

export function Hero() {
  const [count, setCount] = useState(334)
  useEffect(() => {
    const id = setInterval(() => setCount(334 + (Math.random() > 0.5 ? 1 : 0)), 8000)
    return () => clearInterval(id)
  }, [])
  return (
    <section style={{background:'#1C2B1A', padding:'40px 20px 32px', textAlign:'center'}}>
      <p style={{fontFamily:'IBM Plex Mono, monospace', fontSize:11, color:'#C8E6A0', letterSpacing:'2px', textTransform:'uppercase', marginBottom:16}}>
        Ontario Parks Finder
      </p>
      <div style={{display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(200,230,160,0.2)', borderRadius:20, padding:'6px 14px', marginBottom:24}}>
        <span className="live-dot" style={{width:7, height:7, borderRadius:'50%', background:'#4A7C2F', display:'inline-block'}} />
        <span style={{fontFamily:'IBM Plex Mono, monospace', fontSize:12, color:'#C8E6A0'}}>
          Monitoring <strong>{count}</strong> parks live
        </span>
      </div>
      <h1 style={{fontFamily:'Playfair Display, Georgia, serif', fontSize:30, fontWeight:700, color:'#F5F0E8', lineHeight:1.15, letterSpacing:'-0.5px', marginBottom:12}}>
        Get a spot before<br />
        <em style={{fontStyle:'normal', color:'#C8E6A0'}}>they&apos;re all gone</em>
      </h1>
      <p style={{fontSize:15, color:'#9BBE82', lineHeight:1.6, maxWidth:320, margin:'0 auto'}}>
        Search every Ontario park at once. Get alerted the moment a site opens up.
      </p>
    </section>
  )
}
