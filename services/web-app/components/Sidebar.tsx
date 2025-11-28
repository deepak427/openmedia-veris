import Link from 'next/link'
import { Home, Search, PlusSquare, Heart, User, ShieldCheck } from 'lucide-react'

export default function Sidebar() {
    return (
        <aside className="hidden md:flex flex-col w-[244px] border-r border-neutral-200 fixed h-screen bg-white z-50">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">V</span>
                    </div>
                    <span className="text-xl font-bold text-neutral-900">Veris</span>
                </Link>

                <nav className="space-y-2">
                    <Link href="/" className="sidebar-link active">
                        <Home size={24} />
                        <span>Home</span>
                    </Link>
                    <Link href="/search" className="sidebar-link">
                        <Search size={24} />
                        <span>Search</span>
                    </Link>
                    <Link href="/submit" className="sidebar-link">
                        <PlusSquare size={24} />
                        <span>Verify Claim</span>
                    </Link>
                    <Link href="/notifications" className="sidebar-link">
                        <Heart size={24} />
                        <span>Notifications</span>
                    </Link>
                    <Link href="/profile" className="sidebar-link">
                        <User size={24} />
                        <span>Profile</span>
                    </Link>
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-neutral-100">
                <Link href="/submit" className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors">
                    <ShieldCheck size={20} />
                    <span className="font-medium">Verified by Veris</span>
                </Link>
            </div>
        </aside>
    )
}
