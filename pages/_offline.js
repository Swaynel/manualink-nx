export default function Offline() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">You’re offline</h1>
      <p className="text-gray-600 mb-6">
        It looks like you’ve lost your internet connection. Don’t worry —
        you can still browse what’s cached, and your data will sync once you’re back online.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
      >
        Retry Connection
      </button>
    </div>
  );
}
