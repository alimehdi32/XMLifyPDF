// app/Components/Navbar.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user authentication status from the database via API
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/user'); // Ensure this route is working
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        setUser(null);
        router.push('/');
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
        {user ? (
          <>
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-2xl" />
              <span>Hi {user.name || 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-700 transition">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
