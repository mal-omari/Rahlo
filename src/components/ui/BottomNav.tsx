'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/',        icon: 'search', label: 'Search'  },
  { href: '/alerts',  icon: 'bell',   label: 'Alerts'  },
  { href: '/saved',   icon: 'heart',  label: 'Saved'   },
  { href: '/account', icon: 'user',   label: 'Account' },
] as const

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav style={{background:'#1C2B1A', position:'sticky', bottom:0, zIndex:50}} className="flex justify-around pt-3 pb-5">
      {NAV_ITEMS.map(({ href, icon, label }) => (
        <Link key={href} href={href} style={{display:'flex', flexDirection:'column', alignItems:'center', gap:2, fontSize:10, fontWeight:500, textDecoration:'none', color: pathname === href ? '#C8E6A0' : '#6B8558'}}>
          <i className={`ti ti-${icon}`} style={{fontSize:22}} aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
