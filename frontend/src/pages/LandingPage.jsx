import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="bg-slate-950 text-white min-h-screen flex flex-col justify-between">
      <div className="max-w-5xl mx-auto px-6 pt-24 text-center flex-1">
        <h1 className="text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
          AutoValue AI
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Predict Used Car Prices Using Machine Learning. Leverage 8 parallel execution models to lock down true ecosystem valuations instantly.
        </p>
        <div className="flex justify-center gap-4 mb-20">
          <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-lg font-medium transition">
            Get Started
          </Link>
          <Link to="/login" className="bg-slate-800 hover:bg-slate-700 px-8 py-3 rounded-lg font-medium transition border border-slate-700">
            Login Portal
          </Link>
        </div>

        <div className="grid md:grid-cols-4 gap-6 text-left">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-indigo-400 mb-2">8 ML Models</h3>
            <p className="text-sm text-slate-400">Simultaneous predictive processing from Linear Models to Deep Gradient Boosted Trees.</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-emerald-400 mb-2">Compare Values</h3>
            <p className="text-sm text-slate-400">Evaluate full dynamic price variance structures across algorithms instantly side-by-side.</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-amber-400 mb-2">Analytics Engine</h3>
            <p className="text-sm text-slate-400">Complete performance scoring with historical statistical metrics visual layout indicators.</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-bold text-purple-400 mb-2">History Ledger</h3>
            <p className="text-sm text-slate-400">Persisted historical pipeline runs saved with advanced filtering capability control configurations.</p>
          </div>
        </div>
      </div>
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        &copy; 2026 AutoValue AI Inc. &bull; GitHub Ecosystem Deployment Platform.
      </footer>
    </div>
  );
}