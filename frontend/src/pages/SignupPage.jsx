import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(''); // Clear previous error states
  try {
    const res = await API.post('/auth/signup', { name, email, password });
    login(res.data.token);
    navigate('/dashboard');
  } catch (err) {
    // 1. Log the full object to your DevTools Console for quick inspection
    console.error("Registration Pipe Error Context:", err);

    // 2. Safely parse complex Pydantic errors or drop down to the standard string message
    if (err.response?.data?.detail) {
      if (Array.isArray(err.response.data.detail)) {
        // Formats structured Pydantic errors cleanly
        setError(err.response.data.detail.map(e => `${e.loc[1]}: ${e.msg}`).join(', '));
      } else {
        setError(err.response.data.detail);
      }
    } else {
      setError(err.message || 'Account system validation registration breakdown.');
    }
  }
};

  return (
    <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl border border-slate-800 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-400">Create Account</h2>
        {error && <p className="bg-rose-950 text-rose-400 p-3 rounded mb-4 text-xs">{error}</p>}
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Full Name</label>
          <input type="text" required value={name} onChange={e => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white" />
        </div>
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white" />
        </div>
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Secure Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-sm focus:outline-none focus:border-emerald-500 text-white" />
        </div>
        <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 py-2.5 rounded font-medium transition text-sm">
          Provision Platform Workspace
        </button>
      </form>
    </div>
  );
}