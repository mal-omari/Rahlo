import { Navbar } from '@/components/ui/Navbar'
import { BottomNav } from '@/components/ui/BottomNav'

export default function AccountPage() {
  return (
    <div className="rahlo-shell flex flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-6 pb-24">
        <h1 className="font-serif text-[26px] text-pine mb-1">Account</h1>
        <p className="text-[14px] text-sage-400 mb-8">Sign in to manage alerts and saved searches.</p>
        <div className="bg-white rounded-2xl border border-sage-100 p-6 mb-4">
          <h2 className="font-serif text-[18px] text-pine mb-4">Sign in to Rahlo</h2>
          <div className="space-y-3">
            <div>
              <label className="field-label">Email</label>
              <input type="email" placeholder="you@example.com" className="field-control" />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input type="password" placeholder="••••••••" className="field-control" />
            </div>
          </div>
          <button className="w-full font-semibold py-3.5 rounded-xl text-[15px] mt-5" style={{background:'#2D5016',color:'#C8E6A0'}}>Sign in</button>
          <p className="text-center text-[13px] text-sage-400 mt-3">No account? <a href="#" className="text-leaf font-medium">Create one free</a></p>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
