'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'
import { CampsiteCard } from '@/components/results/CampsiteCard'
import { AlertCtaBanner } from '@/components/alerts/AlertCtaBanner'
import { AlertSetupSheet } from '@/components/alerts/AlertSetupSheet'
import type { CampsiteResult, SearchFilters, SiteType, SiteFeature } from '@/types'
import { sortResults } from '@/lib/utils'
import { mockResults } from '@/lib/mockData'
import type { SortKey } from '@/lib/utils'

function SearchResults() {
  const params = useSearchParams()
  const checkIn = params.get('checkIn') ?? ''
  const checkOut = params.get('checkOut') ?? ''
  const region = params.get('region') ?? 'Within 3 hrs of Toronto'
  const siteTypes = (params.get('siteTypes') ?? 'tent').split(',') as SiteType[]
  const features = (params.get('features') ?? '').split(',').filter(Boolean) as SiteFeature[]
  const filters: SearchFilters = { region, checkIn, checkOut, siteTypes, features, partySize: 2 }

  const [results, setResults] = useState<CampsiteResult[]>([])
  const [loading, setLoading] = useState(true)
  const [sortKey, setSortKey] = useState<SortKey>('urgency')
  const [alertTarget, setAlertTarget] = useState<CampsiteResult | null>(null)
  const [showGlobalAlert, setShowGlobalAlert] = useState(false)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => { setResults(mockResults); setLoading(false) }, 900)
  }, [checkIn, checkOut, region])

  const sorted = sortResults(results, sortKey)

  return (
    <div style={{minHeight:'100vh'}}>
      <Navbar ctaLabel="Set alert" onCta={() => setShowGlobalAlert(true)} />
      <div style={{background:'#1C2B1A', padding:'12px 20px', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
        <span style={{color:'#C8E6A0', fontSize:13}}>{region}</span>
        <span style={{fontFamily:'IBM Plex Mono, monospace', fontSize:11, color:'#6B8558'}}>{checkIn} – {checkOut}</span>
      </div>
      <main style={{flex:1, paddingBottom:96}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 16px 8px'}}>
          <h2 style={{fontFamily:'Playfair Display, Georgia, serif', fontSize:20, color:'#1C2B1A', margin:0}}>
            {loading ? 'Searching…' : `${sorted.length} sites found`}
          </h2>
          <div style={{display:'flex', gap:8}}>
            {(['urgency','distance','price'] as SortKey[]).map(k => (
              <button key={k} onClick={() => setSortKey(k)} style={{fontSize:11, padding:'4px 10px', borderRadius:20, border:'1px solid', cursor:'pointer', background: sortKey===k ? '#2D5016' : 'white', color: sortKey===k ? '#C8E6A0' : '#2D5016', borderColor: sortKey===k ? '#2D5016' : '#D4E4B8'}}>
                {k}
              </button>
            ))}
          </div>
        </div>
        <div style={{padding:'0 16px'}}>
          {loading ? (
            [1,2,3].map(i => <div key={i} style={{background:'white', borderRadius:12, height:160, marginBottom:12, opacity:0.5}} />)
          ) : (
            sorted.map(r => <CampsiteCard key={r.id} result={r} checkIn={checkIn} checkOut={checkOut} onAlert={setAlertTarget} />)
          )}
        </div>
        {!loading && <AlertCtaBanner onSetAlert={() => setShowGlobalAlert(true)} />}
      </main>
      <BottomNav />
      {(alertTarget || showGlobalAlert) && (
        <AlertSetupSheet filters={filters} onClose={() => { setAlertTarget(null); setShowGlobalAlert(false) }} onSave={email => console.log('Alert saved for', email)} />
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', color:'#6B8558'}}>Loading…</div>}>
      <SearchResults />
    </Suspense>
  )
}
