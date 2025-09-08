import { useState, useEffect } from 'react';

let notifyCallback;

export const notify = (message, type = 'success') => {
  if (notifyCallback) notifyCallback({ message, type });
};

export default function NotificationContainer() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    notifyCallback = setNotification;
    return () => { notifyCallback = null; };
  }, []);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!notification) return null;

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500 text-gray-900',
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-4 py-2 rounded shadow-lg text-white ${colors[notification.type]}`}>
        {notification.message}
      </div>
    </div>
  );
}
