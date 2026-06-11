import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="text-center p-20 text-white text-sm">
        Loading Analytics Dashboard...
      </div>
    );
  }

  const sortedEntries = Object.entries(
    data.model_performance || {}
  ).sort(
    (a, b) => (b[1].R2 || 0) - (a[1].R2 || 0)
  );

  const performanceLabels = sortedEntries.map(([model]) =>
    model.replace(/_/g, ' ').toUpperCase()
  );

  const performanceR2 = sortedEntries.map(
    ([, metrics]) => metrics.R2 || 0
  );

  const backgroundColors = performanceR2.map((_, index) =>
    index === 0
      ? 'rgba(52, 211, 153, 0.9)'
      : 'rgba(99, 102, 241, 0.8)'
  );

  const r2ChartData = {
    labels: performanceLabels,
    datasets: [
      {
        label: 'R² Score',
        data: performanceR2,
        backgroundColor: backgroundColors,
        borderRadius: 6
      }
    ]
  };

  const formatMoney = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value || 0);

  const bestModel =
    sortedEntries.length > 0
      ? sortedEntries[0][0]
      : 'N/A';

  const bestR2 =
    sortedEntries.length > 0
      ? sortedEntries[0][1].R2
      : 0;

  return (
    <div className="bg-slate-950 text-white min-h-screen p-8 max-w-6xl mx-auto">

      <h2 className="text-3xl font-bold text-indigo-400 mb-8">
        Statistical Performance Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-xs uppercase tracking-wider">
            Active Models
          </p>

          <h3 className="text-4xl font-black text-indigo-400 mt-2">
            {sortedEntries.length}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-xs uppercase tracking-wider">
            Best Model
          </p>

          <h3 className="text-xl font-bold text-emerald-400 mt-2 capitalize">
            {bestModel.replace(/_/g, ' ')}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-slate-400 text-xs uppercase tracking-wider">
            Best R² Score
          </p>

          <h3 className="text-4xl font-black text-emerald-400 mt-2">
            {bestR2.toFixed(4)}
          </h3>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
          <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400 mb-6">
            Model Validation Performance (R²)
          </h3>

          <div className="h-80">
            <Bar
              data={r2ChartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 1
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl overflow-x-auto">

          <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-400 mb-4">
            Algorithm Leaderboard
          </h3>

          <table className="w-full text-left text-xs">

            <thead>
              <tr className="border-b border-slate-800 text-slate-500">
                <th className="pb-3 uppercase tracking-wider">
                  Algorithm
                </th>

                <th className="pb-3 uppercase tracking-wider text-right">
                  MAE
                </th>

                <th className="pb-3 uppercase tracking-wider text-right">
                  RMSE
                </th>

                <th className="pb-3 uppercase tracking-wider text-right">
                  R² Score
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/50 text-slate-300">

              {sortedEntries.map(([model, metrics], index) => (

                <tr
                  key={model}
                  className={
                    index === 0
                      ? 'bg-emerald-900/20'
                      : ''
                  }
                >

                  <td
                    className={`py-4 uppercase font-medium ${
                      index === 0
                        ? 'text-emerald-400 font-bold'
                        : ''
                    }`}
                  >
                    {index === 0 ? '🏆 ' : ''}
                    {model.replace(/_/g, ' ')}
                  </td>

                  <td className="py-4 text-right tabular-nums text-slate-400">
                    {formatMoney(metrics.MAE)}
                  </td>

                  <td className="py-4 text-right tabular-nums text-slate-400">
                    {formatMoney(metrics.RMSE)}
                  </td>

                  <td
                    className={`py-4 text-right tabular-nums font-bold ${
                      index === 0
                        ? 'text-emerald-400'
                        : 'text-indigo-400'
                    }`}
                  >
                    {(metrics.R2 || 0).toFixed(4)}
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