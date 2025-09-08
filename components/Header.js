import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Header({ currentUser }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push('/');
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  };

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="container">
        <nav className="flex justify-between items-center py-4">
          <Link href="/" className="logo">
            <h1 className="text-2xl font-bold text-blue-600">ManuaLink</h1>
            <p className="text-sm text-gray-600">Connecting Kenyan workers with opportunities</p>
          </Link>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-1">
            <li>
              <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/jobs" className={`nav-link ${isActive('/jobs') ? 'active' : ''}`}>
                Find Jobs
              </Link>
            </li>
            <li>
              <Link href="/workers" className={`nav-link ${isActive('/workers') ? 'active' : ''}`}>
                Find Workers
              </Link>
            </li>
            <li>
              <Link href="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
                Contact
              </Link>
            </li>
            {currentUser && (
              <li>
                <Link href="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                  Profile
                </Link>
              </li>
            )}
          </ul>
          
          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {!currentUser ? (
              <>
                <button className="btn btn-primary" onClick={() => document.getElementById('loginModal').classList.add('active')}>
                  Login
                </button>
                <button className="btn btn-secondary" onClick={() => document.getElementById('registerModal').classList.add('active')}>
                  Register
                </button>
              </>
            ) : (
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-2xl ml-4"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </nav>
        
        {/* Mobile Navigation */}
        <div className={`mobile-menu md:hidden ${mobileMenuOpen ? 'active' : ''}`}>
          <div className="p-6">
            <ul className="space-y-4">
              <li>
                <Link href="/" className={`nav-link block ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/jobs" className={`nav-link block ${isActive('/jobs') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/workers" className={`nav-link block ${isActive('/workers') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  Find Workers
                </Link>
              </li>
              <li>
                <Link href="/about" className={`nav-link block ${isActive('/about') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`nav-link block ${isActive('/contact') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>
              {currentUser && (
                <li>
                  <Link href="/profile" className={`nav-link block ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}