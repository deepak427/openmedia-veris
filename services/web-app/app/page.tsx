import ClaimFeed from '@/components/ClaimFeed'

export default function Home() {
  console.log('Home page rendering')
  
  return (
    <div className="w-full min-h-screen bg-white">
      <div className="border-b border-neutral-200 px-4 py-6 bg-white">
        <h1 className="text-2xl font-bold text-neutral-900">
          Home
        </h1>
      </div>
      
      <div className="w-full">
        <ClaimFeed />
      </div>
    </div>
  )
}
