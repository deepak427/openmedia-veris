export default function NotificationsPage() {
  return (
    <div className="w-full">
      <div className="border-b border-neutral-200 px-4 py-6 sticky top-0 bg-white z-10">
        <h1 className="text-2xl font-bold text-neutral-900">
          Notifications
        </h1>
      </div>

      <div className="p-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🔔</div>
          <p className="text-neutral-600">No notifications yet</p>
          <p className="text-sm text-neutral-500 mt-2">
            You'll be notified when your submissions are verified
          </p>
        </div>
      </div>
    </div>
  )
}
