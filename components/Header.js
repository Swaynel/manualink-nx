import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Header({ currentUser, setActiveModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth)
      .then(() => router.push('/'))
      .catch((error) => console.error('Logout error:', error));
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/jobs', label: 'Find Jobs' },
    { path: '/workers', label: 'Find Workers' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => router.pathname === path;

  return (
    <header className="bg-white shadow sticky top-0 z-50 w-full">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <h1 className="text-2xl font-bold text-blue-600">ManuaLink</h1>
            <p className="text-sm text-gray-500">
              Connecting Kenyan workers with opportunities
            </p>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`text-gray-700 hover:text-blue-600 font-medium transition ${
                    isActive(item.path) ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {currentUser && (
              <li>
                <Link
                  href="/profile"
                  className={`text-gray-700 hover:text-blue-600 font-medium transition ${
                    isActive('/profile') ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''
                  }`}
                >
                  Profile
                </Link>
              </li>
            )}
          </ul>

          {/* Auth Buttons & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {!currentUser ? (
              <>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                  onClick={() => setActiveModal('login')}
                >
                  Login
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                  onClick={() => setActiveModal('register')}
                >
                  Register
                </button>
              </>
            ) : (
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-2xl ml-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-md rounded-b-lg mt-2">
            <ul className="flex flex-col p-4 space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-gray-700 hover:text-blue-600 font-medium transition ${
                      isActive(item.path) ? 'text-blue-600' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {currentUser && (
                <li>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block text-gray-700 hover:text-blue-600 font-medium transition ${
                      isActive('/profile') ? 'text-blue-600' : ''
                    }`}
                  >
                    Profile
                  </Link>
                </li>
              )}
              {!currentUser && (
                <li className="flex flex-col space-y-2 mt-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    onClick={() => { setActiveModal('login'); setMobileMenuOpen(false); }}
                  >
                    Login
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
                    onClick={() => { setActiveModal('register'); setMobileMenuOpen(false); }}
                  >
                    Register
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
