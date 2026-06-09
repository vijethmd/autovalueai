import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between text-white">
      <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold tracking-wider text-indigo-400">
        AutoValue AI
      </Link>
      
      <div className="flex items-center gap-6">
        {user ? (
          <button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-700 px-4 py-1.5 rounded font-bold text-sm tracking-wider uppercase transition">
            Logout Session
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-indigo-400 text-sm transition">Login</Link>
            <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded text-sm transition">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}