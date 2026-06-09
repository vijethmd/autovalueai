import React, { useState } from 'react';
import API from '../services/api';

export default function CompareModelsPage() {
  const [formData, setFormData] = useState({
    Car_Name: '',
    Year: 2020,
    Present_Price: '',
    Kms_Driven: '',
    Fuel_Type: 'Petrol',
    Seller_Type: 'Dealer',
    Transmission: 'Manual',
    Owner: 0
  });

  const [matrix, setMatrix] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCompare = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setMatrix(null);

    try {
      const payload = {
        ...formData,
        Year: parseInt(formData.Year),
        Present_Price: parseFloat(formData.Present_Price),
        Kms_Driven: parseInt(formData.Kms_Driven),
        Owner: parseInt(formData.Owner)
      };

      const res = await API.post('/compare-models', payload);

      setMatrix(res.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
        'Unable to generate comparison matrix.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getBestModel = () => {
    if (!matrix) return null;

    return Object.entries(matrix).reduce((best, current) =>
      current[1] > best[1] ? current : best
    );
  };

  const bestModel = getBestModel();

  const formatPrediction = (prediction) => {
  const rupees = Number(prediction) * 100000;

  if (rupees < 50000) {
    return "Negligible Value";
  }

  return `₹ ${Number(prediction).toFixed(2)} Lakhs (₹ ${rupees.toLocaleString(
    "en-IN"
  )})`;
  };
  
  return (
    <div className="bg-slate-950 text-white min-h-screen p-8 max-w-6xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">
        
        <h2 className="text-3xl font-bold text-indigo-400 mb-2">
          ML Model Comparison Dashboard
        </h2>

        <p className="text-slate-400 text-sm mb-8">
          Compare predictions from all trained machine learning models.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={handleCompare}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8"
        >
          {/* Car Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Car Name
            </label>
            <input
              type="text"
              required
              value={formData.Car_Name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Car_Name: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
              placeholder="e.g. Swift"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Manufacturing Year
            </label>
            <input
              type="number"
              required
              value={formData.Year}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Year: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            />
          </div>

          {/* Present Price */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Present Price (Lakhs ₹)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.Present_Price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Present_Price: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            />
          </div>

          {/* Kms Driven */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Kilometers Driven
            </label>
            <input
              type="number"
              required
              value={formData.Kms_Driven}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Kms_Driven: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            />
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Fuel Type
            </label>
            <select
              value={formData.Fuel_Type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Fuel_Type: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
            </select>
          </div>

          {/* Seller Type */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Seller Type
            </label>
            <select
              value={formData.Seller_Type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Seller_Type: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            >
              <option value="Dealer">Dealer</option>
              <option value="Individual">Individual</option>
            </select>
          </div>

          {/* Transmission */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Transmission
            </label>
            <select
              value={formData.Transmission}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Transmission: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          {/* Owner */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Previous Owners
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.Owner}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Owner: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-bold uppercase tracking-wider transition"
          >
            {loading
              ? 'Running Comparison...'
              : 'Compare All Models'}
          </button>
        </form>

        {matrix && (
  <>
    {bestModel && (
      <div className="mb-6 p-4 rounded-lg border border-emerald-700 bg-emerald-950/20">
        <h3 className="text-emerald-400 font-bold text-lg">
          Best Prediction
        </h3>

        <p className="text-sm text-slate-300 mt-1">
          Model:{" "}
          <span className="font-bold capitalize">
            {bestModel[0].replace(/_/g, " ")}
          </span>
        </p>

        <p className="text-2xl font-black text-emerald-400 mt-2">
          {formatPrediction(bestModel[1])}
        </p>
      </div>
    )}

    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900">
            <th className="p-4 text-left text-slate-400 uppercase text-xs">
              Model
            </th>

            <th className="p-4 text-right text-slate-400 uppercase text-xs">
              Predicted Price (₹ Lakhs)
            </th>
          </tr>
        </thead>

        <tbody>
          {Object.entries(matrix)
            .sort((a, b) => b[1] - a[1])
            .map(([model, prediction]) => (
              <tr
                key={model}
                className={`border-b border-slate-800 ${
                  bestModel && model === bestModel[0]
                    ? "bg-emerald-950/20"
                    : ""
                }`}
              >
                <td className="p-4 capitalize">
                  {model.replace(/_/g, " ")}
                </td>

                <td className="p-4 text-right font-semibold">
                  {formatPrediction(prediction)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>

    <div className="mt-4 text-sm text-slate-400">
      <p>
        * Predictions below ₹50,000 are classified as{" "}
        <span className="text-orange-400 font-semibold">
          Negligible Value
        </span>
      </p>
    </div>
  </>
)}
      </div>
    </div>
  );
}