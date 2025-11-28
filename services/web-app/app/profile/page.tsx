export default function ProfilePage() {
  return (
    <div className="w-full">
      <div className="border-b border-neutral-200 px-4 py-6 sticky top-0 bg-white z-10">
        <h1 className="text-2xl font-bold text-neutral-900">
          Profile
        </h1>
      </div>

      <div className="p-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl">👤</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Guest User</h2>
          <p className="text-neutral-600 mb-6">Fact-checking enthusiast</p>
          
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">0</div>
              <div className="text-sm text-neutral-600">Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">0</div>
              <div className="text-sm text-neutral-600">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900">0</div>
              <div className="text-sm text-neutral-600">Following</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
