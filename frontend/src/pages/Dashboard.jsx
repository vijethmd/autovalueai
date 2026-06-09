import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/dashboard')
      .then(res => { setMetrics(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center p-20 text-white text-sm">Loading workspace...</div>;

  return (
    <div className="bg-slate-950 text-white min-h-screen p-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 tracking-tight">System Workspace Dashboard</h2>
      
      {/* 1. Status Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">System Status</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2 uppercase">{metrics?.status || 'Online'}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Data Logging</div>
          <div className="text-2xl font-bold text-amber-400 mt-2 uppercase">{metrics?.data_persistence || 'None'}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Active ML Pipelines</div>
          <div className="text-4xl font-extrabold text-indigo-400 mt-1">{metrics?.active_models || 8}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <div className="text-xs uppercase tracking-wider text-slate-400 mb-1">Optimal Engine Node</div>
          <div className="text-2xl font-bold text-purple-400 uppercase mt-2">{metrics?.best_performing_model || 'XGBoost'}</div>
        </div>
      </div>

      <hr className="border-slate-800 mb-10" />

      {/* 2. Big Action Buttons Row */}
      <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400 mb-4">Core Platform Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Link to="/predict" className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 hover:border-indigo-500 p-10 rounded-2xl text-center group transition-all duration-300">
          <div className="text-3xl font-black mb-3 text-indigo-400 group-hover:scale-105 transition-transform">Predict Price</div>
          <div className="text-sm text-slate-400">Run individual vehicle valuations through the target execution engine.</div>
        </Link>

        <Link to="/compare" className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/30 hover:border-emerald-500 p-10 rounded-2xl text-center group transition-all duration-300">
          <div className="text-3xl font-black mb-3 text-emerald-400 group-hover:scale-105 transition-transform">Compare Models</div>
          <div className="text-sm text-slate-400">Execute parallel pipeline requests to analyze algorithm variance.</div>
        </Link>

        <Link to="/analytics" className="bg-gradient-to-br from-purple-900/50 to-slate-900 border border-purple-500/30 hover:border-purple-500 p-10 rounded-2xl text-center group transition-all duration-300">
          <div className="text-3xl font-black mb-3 text-purple-400 group-hover:scale-105 transition-transform">Analytics</div>
          <div className="text-sm text-slate-400">View statistical training performance dashboards and R² scores.</div>
        </Link>

      </div>
    </div>
  );
}