"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, type User } from "firebase/auth";
import { auth } from "../lib/firebase";
import type { ModalType } from "../types/app";

interface HeaderProps {
  currentUser: User | null;
  setActiveModal: (modal: ModalType | null) => void;
}

const navItems = [
  { path: "/", label: "Home" },
  { path: "/jobs", label: "Find Jobs" },
  { path: "/workers", label: "Find Workers" },
  { path: "/about", label: "About" },
  { path: "/contacts", label: "Contact" },
] as const;

export default function Header({ currentUser, setActiveModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (!auth) {
      return;
    }

    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          <Link href="/" className="flex flex-col">
            <h1 className="text-2xl font-bold text-blue-600">ManuaLink</h1>
            <p className="text-sm text-gray-500">
              Connecting Kenyan workers with opportunities
            </p>
          </Link>

          <ul className="hidden items-center space-x-6 md:flex">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`font-medium text-gray-700 transition hover:text-blue-600 ${
                    isActive(item.path)
                      ? "border-b-2 border-blue-600 pb-1 text-blue-600"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {currentUser && (
              <li>
                <Link
                  href="/worker-dashboard"
                  className={`font-medium text-gray-700 transition hover:text-blue-600 ${
                    isActive("/worker-dashboard") || isActive("/employer-dashboard")
                      ? "border-b-2 border-blue-600 pb-1 text-blue-600"
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-2">
            {!currentUser ? (
              <>
                <button
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                  onClick={() => setActiveModal("login")}
                >
                  Login
                </button>
                <button
                  className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300"
                  onClick={() => setActiveModal("register")}
                >
                  Register
                </button>
              </>
            ) : (
              <button
                className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}

            <button
              className="ml-2 text-2xl md:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <i className="fas fa-bars" />
            </button>
          </div>
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed right-0 top-0 z-50 h-full w-64 transform bg-white/90 shadow-xl backdrop-blur-md transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold text-gray-800">Menu</h2>
          <button
            className="text-2xl"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <ul className="flex flex-col space-y-4 p-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block font-medium text-gray-800 transition hover:text-blue-600 ${
                  isActive(item.path) ? "text-blue-600" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}

          {currentUser && (
            <li>
              <Link
                href="/worker-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-medium text-gray-800 transition hover:text-blue-600"
              >
                Dashboard
              </Link>
            </li>
          )}

          {!currentUser && (
            <li className="space-y-4">
              <button
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                onClick={() => {
                  setActiveModal("login");
                  setMobileMenuOpen(false);
                }}
              >
                Login
              </button>
              <button
                className="w-full rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-800 transition hover:bg-gray-300"
                onClick={() => {
                  setActiveModal("register");
                  setMobileMenuOpen(false);
                }}
              >
                Register
              </button>
            </li>
          )}
        </ul>
      </aside>
    </header>
  );
}
