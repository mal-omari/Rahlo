import { Navbar } from '@/components/ui/Navbar'
import { Hero } from '@/components/ui/Hero'
import { SearchFilterPanel } from '@/components/search/SearchFilterPanel'
import { BottomNav } from '@/components/ui/BottomNav'

export default function HomePage() {
  return (
    <div className="rahlo-shell flex flex-col">
      <Navbar />
      <main className="flex-1 pb-20">
        <Hero />
        <SearchFilterPanel />
      </main>
      <BottomNav />
    </div>
  )
}
