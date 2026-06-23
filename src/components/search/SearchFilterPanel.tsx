'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchFilters, SiteType, SiteFeature } from '@/types'
import { SITE_TYPE_CONFIG, FEATURE_CONFIG } from '@/types'
import { nextFriday, nextSunday, formatDisplayDate } from '@/lib/utils'

const REGIONS = ['Within 2 hrs of Toronto','Within 3 hrs of Toronto','Within 4 hrs of Toronto','Algonquin area','Georgian Bay','Prince Edward County','Near me']
const SITE_TYPES: SiteType[] = ['tent','rv','yurt','cabin']
const FEATURES: SiteFeature[] = ['waterfront','electrical','pet-friendly','accessible','showers','fire-pit']

export function SearchFilterPanel({ initialFilters, onSearch, compact }: { initialFilters?: Partial<SearchFilters>; onSearch?: (f: SearchFilters) => void; compact?: boolean }) {
  const router = useRouter()
  const [region, setRegion] = useState(initialFilters?.region ?? 'Within 3 hrs of Toronto')
  const [checkIn, setCheckIn] = useState(initialFilters?.checkIn ?? nextFriday())
  const [checkOut, setCheckOut] = useState(initialFilters?.checkOut ?? nextSunday())
  const [siteTypes, setSiteTypes] = useState<SiteType[]>(initialFilters?.siteTypes ?? ['tent'])
  const [features, setFeatures] = useState<SiteFeature[]>(initialFilters?.features ?? [])
  const [showRegion, setShowRegion] = useState(false)

  function toggleSiteType(t: SiteType) { setSiteTypes(p => p.includes(t) ? p.filter(x=>x!==t) : [...p,t]) }
  function toggleFeature(f: SiteFeature) { setFeatures(p => p.includes(f) ? p.filter(x=>x!==f) : [...p,f]) }

  function handleSearch() {
    const filters: SearchFilters = { region, checkIn, checkOut, siteTypes: siteTypes.length ? siteTypes : ['tent'], features, partySize: 2 }
    if (onSearch) { onSearch(filters) } else {
      const p = new URLSearchParams({ region, checkIn, checkOut, siteTypes: siteTypes.join(','), features: features.join(',') })
      router.push(`/search?${p.toString()}`)
    }
  }

  const panelStyle: React.CSSProperties = {
    background: '#F5F0E8',
    padding: compact ? '16px' : '28px 20px 28px',
    borderRadius: compact ? '0' : '24px 24px 0 0',
    marginTop: compact ? '0' : '-24px',
    position: 'relative',
    zIndex: 2,
    boxShadow: compact ? 'none' : '0 -4px 24px rgba(28,43,26,0.08)',
  }

  return (
    <div style={panelStyle}>
      {!compact && (
        <p style={{fontFamily:'IBM Plex Mono, monospace', fontSize:11, color:'#94A884', marginBottom:20, letterSpacing:'1px', textTransform:'uppercase'}}>
          Find a campsite
        </p>
      )}

      {/* Region */}
      <div style={{marginBottom:12}}>
        <div style={{position:'relative'}}>
          <button
            onClick={() => setShowRegion(v=>!v)}
            style={{
              width:'100%',
              display:'flex',
              alignItems:'center',
              justifyContent:'space-between',
              background:'white',
              border:'1.5px solid #E2EDD4',
              borderRadius:14,
              padding:'14px 16px',
              fontSize:15,
              color:'#1C2B1A',
              cursor:'pointer',
              textAlign:'left',
              boxShadow:'0 1px 4px rgba(28,43,26,0.06)',
            }}
          >
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <span style={{fontSize:18}}>📍</span>
              <span style={{fontWeight:500}}>{region}</span>
            </div>
            <span style={{color:'#94A884', fontSize:12}}>▾</span>
          </button>
          {showRegion && (
            <div style={{position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'white', border:'1.5px solid #E2EDD4', borderRadius:14, boxShadow:'0 8px 32px rgba(28,43,26,0.14)', zIndex:20, maxHeight:220, overflowY:'auto'}}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => { setRegion(r); setShowRegion(false) }} style={{width:'100%', textAlign:'left', padding:'13px 16px', fontSize:14, background:'none', border:'none', borderBottom:'1px solid #F0F6E8', cursor:'pointer', color: r===region ? '#2D5016' : '#1C2B1A', fontWeight: r===region ? 600 : 400}}>
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dates */}
      <div style={{display:'flex', gap:10, marginBottom:20}}>
        {[
          {label:'Check in', value:checkIn, onChange:(v:string)=>setCheckIn(v), min:undefined},
          {label:'Check out', value:checkOut, onChange:(v:string)=>setCheckOut(v), min:checkIn},
        ].map(({label, value, onChange, min}) => (
          <div key={label} style={{flex:1, position:'relative'}}>
            <div style={{
              background:'white',
              border:'1.5px solid #E2EDD4',
              borderRadius:14,
              padding:'12px 14px',
              boxShadow:'0 1px 4px rgba(28,43,26,0.06)',
            }}>
              <p style={{fontSize:10, color:'#94A884', fontFamily:'IBM Plex Mono, monospace', textTransform:'uppercase', letterSpacing:'0.8px', margin:'0 0 3px'}}>{label}</p>
              <p style={{fontSize:15, fontWeight:600, color:'#1C2B1A', margin:0}}>{formatDisplayDate(value)}</p>
            </div>
            <input type="date" value={value} min={min} onChange={e=>onChange(e.target.value)} style={{position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%'}} />
          </div>
        ))}
      </div>

      {/* Site type */}
      <div style={{marginBottom:16}}>
        <p style={{fontSize:11, color:'#94A884', fontFamily:'IBM Plex Mono, monospace', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:10}}>Site type</p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {SITE_TYPES.map(t => (
            <button key={t} onClick={() => toggleSiteType(t)} style={{
              padding:'9px 14px',
              borderRadius:24,
              fontSize:13,
              fontWeight:500,
              border: siteTypes.includes(t) ? 'none' : '1.5px solid #E2EDD4',
              background: siteTypes.includes(t) ? '#2D5016' : 'white',
              color: siteTypes.includes(t) ? '#C8E6A0' : '#1C2B1A',
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              gap:6,
              boxShadow: siteTypes.includes(t) ? '0 2px 8px rgba(45,80,22,0.3)' : '0 1px 3px rgba(28,43,26,0.06)',
              transition:'all 0.15s',
            }}>
              {SITE_TYPE_CONFIG[t].emoji} {SITE_TYPE_CONFIG[t].label}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{marginBottom:24}}>
        <p style={{fontSize:11, color:'#94A884', fontFamily:'IBM Plex Mono, monospace', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:10}}>Features</p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {FEATURES.map(f => (
            <button key={f} onClick={() => toggleFeature(f)} style={{
              padding:'9px 14px',
              borderRadius:24,
              fontSize:13,
              fontWeight:500,
              border: features.includes(f) ? 'none' : '1.5px solid #E2EDD4',
              background: features.includes(f) ? '#2D5016' : 'white',
              color: features.includes(f) ? '#C8E6A0' : '#1C2B1A',
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              gap:6,
              boxShadow: features.includes(f) ? '0 2px 8px rgba(45,80,22,0.3)' : '0 1px 3px rgba(28,43,26,0.06)',
              transition:'all 0.15s',
            }}>
              {FEATURE_CONFIG[f].emoji} {FEATURE_CONFIG[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button onClick={handleSearch} style={{
        width:'100%',
        background:'linear-gradient(135deg, #E8622A 0%, #c94d1a 100%)',
        color:'white',
        border:'none',
        borderRadius:16,
        padding:'17px',
        fontSize:16,
        fontWeight:700,
        cursor:'pointer',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        gap:10,
        boxShadow:'0 4px 20px rgba(232,98,42,0.4)',
        letterSpacing:'0.2px',
      }}>
        🔍 Search all Ontario Parks
      </button>
    </div>
  )
}
