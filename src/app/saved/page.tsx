import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'

export default function SavedPage() {
  return (
    <div className="rahlo-shell flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-6 pb-24">
        <h1 className="font-serif text-[26px] text-pine mb-1">Saved searches</h1>
        <p className="text-[14px] text-sage-400 mb-8">Your saved filter combinations for quick re-search.</p>
        <div className="bg-white rounded-2xl border border-sage-100 p-8 text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{background:'#F0F6E8'}}>
            <i className="ti ti-heart text-[28px] text-leaf" aria-hidden="true" />
          </div>
          <h2 className="font-serif text-[18px] text-pine mb-2">Nothing saved yet</h2>
          <p className="text-[14px] text-sage-400 leading-relaxed max-w-[220px] mx-auto mb-5">Sign in to save your favourite search filters.</p>
          <a href="/account" className="inline-flex items-center gap-2 bg-forest text-mist text-[14px] font-medium px-5 py-3 rounded-xl">
            <i className="ti ti-user text-[16px]" aria-hidden="true" />Sign in
          </a>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
