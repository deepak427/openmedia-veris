import Link from 'next/link'
import { Home, Search, PlusSquare, Heart, User } from 'lucide-react'

export default function BottomNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 px-4 py-3">
            <div className="flex justify-between items-center max-w-md mx-auto">
                <Link href="/" className="p-2 text-neutral-900">
                    <Home size={24} />
                </Link>
                <Link href="/search" className="p-2 text-neutral-500 hover:text-neutral-900">
                    <Search size={24} />
                </Link>
                <Link href="/submit" className="p-2 text-neutral-500 hover:text-neutral-900">
                    <PlusSquare size={24} />
                </Link>
                <Link href="/notifications" className="p-2 text-neutral-500 hover:text-neutral-900">
                    <Heart size={24} />
                </Link>
                <Link href="/profile" className="p-2 text-neutral-500 hover:text-neutral-900">
                    <User size={24} />
                </Link>
            </div>
        </nav>
    )
}
