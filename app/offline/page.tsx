"use client";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
      <h1 className="mb-4 text-3xl font-bold text-blue-600">You&apos;re offline</h1>
      <p className="mb-6 text-gray-600">
        It looks like you&apos;ve lost your internet connection. Don&apos;t
        worry, you can still browse what&apos;s cached, and your data will sync
        once you&apos;re back online.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
      >
        Retry Connection
      </button>
    </div>
  );
}
