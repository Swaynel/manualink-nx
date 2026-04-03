"use client";

import { useEffect, useState } from "react";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationState {
  message: string;
  type: NotificationType;
}

let notifyCallback: ((notification: NotificationState | null) => void) | null = null;

export const notify = (
  message: string,
  type: NotificationType = "success",
) => {
  notifyCallback?.({ message, type });
};

export default function NotificationContainer() {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  useEffect(() => {
    notifyCallback = setNotification;
    return () => {
      notifyCallback = null;
    };
  }, []);

  useEffect(() => {
    if (!notification) {
      return;
    }

    const timer = window.setTimeout(() => setNotification(null), 3000);
    return () => window.clearTimeout(timer);
  }, [notification]);

  if (!notification) {
    return null;
  }

  const colors: Record<NotificationType, string> = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500 text-gray-900",
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      <div
        className={`rounded px-4 py-2 text-white shadow-lg ${colors[notification.type]}`}
      >
        {notification.message}
      </div>
    </div>
  );
}
