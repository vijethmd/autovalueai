import React, { useState, useEffect } from 'react';
import API from '../services/api';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [model, setModel] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (model) params.append('model', model);
    if (sortBy) params.append('sort_by', sortBy);

    API.get(`/history?${params.toString()}`)
      .then(res => setHistory(res.data))
      .catch(() => {});
  }, [search, model, sortBy]);

  return (
    <div className="bg-slate-950 text-white min-h-screen p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-400 mb-6">Historical Run Inferences Engine Vault</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input type="text" placeholder="Filter by vehicle matching search token..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-xs p-2.5 rounded text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500" />
        
        <select value={model} onChange={e => setModel(e.target.value)} className="bg-slate-900 border border-slate-800 text-xs p-2.5 rounded text-white focus:outline-none focus:border-indigo-500">
          <option value="">All Running Models</option>
          <option value="linear">Linear Regression</option>
          <option value="random_forest">Random Forest</option>
          <option value="xgboost">XGBoost Regressor</option>
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-slate-900 border border-slate-800 text-xs p-2.5 rounded text-white focus:outline-none focus:border-indigo-500">
          <option value="date_desc">Date execution sequential fallback (Newest)</option>
          <option value="price_desc">Price Tier Evaluation (Highest)</option>
          <option value="price_asc">Price Tier Evaluation (Lowest)</option>
        </select>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="p-4">Timestamp Run</th>
              <th className="p-4">Vehicle Specs Identifier</th>
              <th className="p-4">Model Pipeline Component</th>
              <th className="p-4 text-right">Computed Evaluation Index Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {history.map((h) => (
              <tr key={h.id} className="hover:bg-slate-800/40 transition">
                <td className="p-4 text-slate-500">{h.date}</td>
                <td className="p-4 font-bold text-white">{h.car_name} <span className="text-xs font-normal text-slate-400">({h.year})</span></td>
                <td className="p-4 uppercase tracking-wider text-indigo-400 text-[10px] font-semibold">{h.selected_model.replace('_', ' ')}</td>
                <td className="p-4 text-right text-sm font-black text-emerald-400">₹{h.predicted_price.toLocaleString()}</td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">No active process query strings inside history cache database.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}