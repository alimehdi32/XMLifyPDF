// app/Components/Navbar.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Cookies from "js-cookie";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/credential', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setIsLoggedIn(true);
        setUser(data.username);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
    }
  };
  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth(); // call re-auth check
    };
  
    window.addEventListener("auth-change", handleAuthChange);
  
    // Clean up listener
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);
    
  

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/user/logout', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        console.log(data.message); // Logout successful message
        setIsLoggedIn(false);
        setUser(null);
        router.push('/'); // Redirect only after successful logout
      } else {
        console.error('Logout failed:', res.statusText);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg">
      <Link href="/">
        <div className="text-2xl font-bold cursor-pointer">PDF to XML</div>
      </Link>
      <div className="flex items-center gap-4">
        <Link href="/profile"><FontAwesomeIcon icon={faUser} size="2x" /> </Link>
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-2xl" />
              <span>Hi {user || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-700 transition cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-700 transition cursor-pointer">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
