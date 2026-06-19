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

  return (
    <div style={{background:'#F5F0E8', padding: compact ? 16 : '28px 20px 24px', borderRadius: compact ? 0 : '20px 20px 0 0', marginTop: compact ? 0 : -20, position:'relative', zIndex:2}}>
      {!compact && <p style={{fontFamily:'IBM Plex Mono, monospace', fontSize:13, color:'#2D5016', marginBottom:18, letterSpacing:'0.5px'}}>/&nbsp;find a campsite</p>}

      <div style={{marginBottom:14}}>
        <label className="field-label">Park or region</label>
        <div style={{position:'relative'}}>
          <button onClick={() => setShowRegion(v=>!v)} className="field-control" style={{display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', textAlign:'left', height:46, boxSizing:'border-box'}}>
            <span>{region}</span>
            <i className="ti ti-map-pin" style={{fontSize:17, color:'#4A7C2F'}} aria-hidden="true" />
          </button>
          {showRegion && (
            <div style={{position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'white', border:'1px solid #D4E4B8', borderRadius:12, boxShadow:'0 8px 24px rgba(28,43,26,0.12)', zIndex:20, maxHeight:200, overflowY:'auto'}}>
              {REGIONS.map(r => (
                <button key={r} onClick={() => { setRegion(r); setShowRegion(false) }} style={{width:'100%', textAlign:'left', padding:'12px 16px', fontSize:14, background:'none', border:'none', cursor:'pointer', color: r===region ? '#2D5016' : '#1C2B1A', fontWeight: r===region ? 500 : 400}}>
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{display:'flex', gap:12, marginBottom:14}}>
        <div style={{flex:1, minWidth:0}}>
          <label className="field-label">Check in</label>
          <div style={{position:'relative', height:46}}>
            <div className="field-control" style={{display:'flex', alignItems:'center', justifyContent:'space-between', height:46, boxSizing:'border-box', pointerEvents:'none'}}>
              <span>{formatDisplayDate(checkIn)}</span>
              <i className="ti ti-calendar" style={{fontSize:17, color:'#4A7C2F'}} aria-hidden="true" />
            </div>
            <input
              type="date"
              value={checkIn}
              onChange={e=>setCheckIn(e.target.value)}
              style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', border:'none', padding:0, margin:0}}
            />
          </div>
        </div>
        <div style={{flex:1, minWidth:0}}>
          <label className="field-label">Check out</label>
          <div style={{position:'relative', height:46}}>
            <div className="field-control" style={{display:'flex', alignItems:'center', justifyContent:'space-between', height:46, boxSizing:'border-box', pointerEvents:'none'}}>
              <span>{formatDisplayDate(checkOut)}</span>
              <i className="ti ti-calendar" style={{fontSize:17, color:'#4A7C2F'}} aria-hidden="true" />
            </div>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={e=>setCheckOut(e.target.value)}
              style={{position:'absolute', top:0, left:0, width:'100%', height:'100%', opacity:0, cursor:'pointer', border:'none', padding:0, margin:0}}
            />
          </div>
        </div>
      </div>

      <p className="field-label">Site type</p>
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:14}}>
        {SITE_TYPES.map(t => (
          <button key={t} onClick={() => toggleSiteType(t)} className={`chip ${siteTypes.includes(t) ? 'chip-active' : ''}`}>
            {SITE_TYPE_CONFIG[t].emoji} {SITE_TYPE_CONFIG[t].label}
          </button>
        ))}
      </div>

      <p className="field-label">Features</p>
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:20}}>
        {FEATURES.map(f => (
          <button key={f} onClick={() => toggleFeature(f)} className={`chip ${features.includes(f) ? 'chip-active' : ''}`}>
            {FEATURE_CONFIG[f].emoji} {FEATURE_CONFIG[f].label}
          </button>
        ))}
      </div>

      <button onClick={handleSearch} style={{width:'100%', background:'#E8622A', color:'white', border:'none', borderRadius:12, padding:'16px', fontSize:16, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8}}>
        <i className="ti ti-search" style={{fontSize:18}} aria-hidden="true" />
        Search all Ontario Parks
      </button>
    </div>
  )
}
