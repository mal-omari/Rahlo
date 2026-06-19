'use client'
import Link from 'next/link'

interface NavbarProps { ctaLabel?: string; onCta?: () => void }

export function Navbar({ ctaLabel = 'Set alert', onCta }: NavbarProps) {
  return (
    <nav style={{background:'#1C2B1A'}} className="sticky top-0 z-50 flex items-center justify-between px-5 py-3.5">
      <Link href="/" style={{fontFamily:'Playfair Display, Georgia, serif', fontSize:22, color:'#F5F0E8', letterSpacing:'-0.5px', textDecoration:'none'}}>
        Rahl<span style={{color:'#C8E6A0'}}>o</span>
      </Link>
      <button onClick={onCta} style={{background:'#E8622A', color:'white', border:'none', borderRadius:6, padding:'8px 16px', fontSize:13, fontWeight:500, cursor:'pointer'}}>
        {ctaLabel}
      </button>
    </nav>
  )
}
