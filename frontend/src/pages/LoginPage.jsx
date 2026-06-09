import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication operation matrix failure.');
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 p-8 rounded-xl border border-slate-800 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-400">Welcome Back</h2>
        {error && <p className="bg-rose-950 text-rose-400 p-3 rounded mb-4 text-xs">{error}</p>}
        <div className="mb-4">
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white" />
        </div>
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Secret Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-sm focus:outline-none focus:border-indigo-500 text-white" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded font-medium transition text-sm">
          Authenticate Session
        </button>
      </form>
    </div>
  );
}