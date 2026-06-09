import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics')
      .then(res => { setData(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) return <div className="text-center p-20 text-white text-sm">Decoding serialization analytics blocks...</div>;

  // 1. Sort the data from highest R2 score to lowest
  const sortedEntries = Object.entries(data.model_performance).sort(
    (a, b) => b[1].r2_score - a[1].r2_score
  );

  const performanceLabels = sortedEntries.map(([k]) => k.replace('_', ' ').toUpperCase());
  const performanceR2 = sortedEntries.map(([_, val]) => val.r2_score);

  // 2. Dynamic coloring: Make the best model Emerald, the rest Indigo
  const backgroundColors = performanceR2.map((_, index) => 
    index === 0 ? 'rgba(52, 211, 153, 0.9)' : 'rgba(99, 102, 241, 0.8)' // Emerald for 1st, Indigo for rest
  );

  const r2ChartData = {
    labels: performanceLabels,
    datasets: [{ 
      label: 'R² Score', 
      data: performanceR2, 
      backgroundColor: backgroundColors,
      borderRadius: 4
    }]
  };

  // Utility for formatting currency
  const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-slate-950 text-white min-h-screen p-8 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-8 text-indigo-400">Statistical Performance Metric Dashboards</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          {/* 4. Fixed the R^2 typo in the title */}
          <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400 mb-6">Model Validation Performance (R²)</h3>
          <div className="h-72">
             <Bar 
               data={r2ChartData} 
               options={{ 
                 maintainAspectRatio: false, 
                 plugins: { legend: { display: false } }, // Hide redundant legend
                 scales: { y: { max: 1 } } 
               }} 
             />
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl overflow-x-auto">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400 mb-4">Algorithmic Leaderboard Matrix</h3>
          <table className="w-full text-left text-xs mt-2">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="pb-3 font-semibold uppercase tracking-wider">Algorithm</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-right">MAE</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-right">RMSE</th>
                <th className="pb-3 font-semibold uppercase tracking-wider text-right">R² Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {sortedEntries.map(([k, val], index) => (
                <tr key={k} className={index === 0 ? "bg-emerald-900/20" : ""}>
                  <td className={`py-4 uppercase font-medium ${index === 0 ? "text-emerald-400 font-bold" : ""}`}>
                    {index === 1 && "🏆 "} {/* Adds a subtle trophy to the winner */}
                    {k.replace('_', ' ')}
                  </td>
                  {/* 3. Formatted MAE and RMSE as Currency */}
                  <td className="py-4 text-right tabular-nums text-slate-400">{formatMoney(val.mae)}</td>
                  <td className="py-4 text-right tabular-nums text-slate-400">{formatMoney(val.rmse)}</td>
                  <td className={`py-4 text-right tabular-nums font-bold ${index === 0 ? "text-emerald-400" : "text-indigo-400"}`}>
                    {val.r2_score.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}