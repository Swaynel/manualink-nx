"use client";

import type { ReactNode } from "react";

interface SharedModalProps {
  show: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function SharedModal({
  show,
  onClose,
  title,
  children,
}: SharedModalProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="absolute right-3 top-3 text-xl font-bold text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {title && <h2 className="mb-4 text-xl font-semibold">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
}
