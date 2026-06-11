
import React, { useState } from 'react';
import API from '../services/api';

export default function PredictionPage() {
  const [formData, setFormData] = useState({
  Brand: '',
  model_name: '',
  Year: new Date().getFullYear(),
  Age: '',
  kmDriven: '',
  FuelType: 'Petrol',
  Transmission: 'Manual',
  Owner: 'first',
  model: 'svr'
});

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        ...formData,
        Year: parseInt(formData.Year),
        Age: parseInt(formData.Age),
        kmDriven: parseInt(formData.kmDriven)
      };

      const res = await API.post('/predict', payload);

      setResult(res.data.predicted_price);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        'Prediction failed. Please check your inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatPrediction = (prediction) => {
    return `₹ ${Number(prediction).toLocaleString("en-IN")}`;
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen p-8 max-w-5xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-2xl">

        <h2 className="text-3xl font-bold text-indigo-400 mb-2">
          Used Car Price Prediction
        </h2>

        <p className="text-slate-400 text-sm mb-8">
          Enter vehicle details to estimate its current market value.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handlePredict}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Brand
            </label>

            <input
              type="text"
              required
              value={formData.Brand}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Brand: e.target.value
                })
              }
              placeholder="e.g. Hyundai"
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Model Name
            </label>

            <input
              type="text"
              required
              value={formData.model_name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  model_name: e.target.value
                })
              }
              placeholder="e.g. i20"
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            />
          </div>

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

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Age (Years)
            </label>

            <input
              type="number"
              required
              min="0"
              value={formData.Age}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Age: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Kilometers Driven
            </label>

            <input
              type="number"
              required
              value={formData.kmDriven}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kmDriven: e.target.value
                })
              }
              placeholder="e.g. 45000"
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Fuel Type
            </label>

            <select
              value={formData.FuelType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  FuelType: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            >
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid/CNG">Hybrid/CNG</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

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

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Owner
            </label>

            <select
              value={formData.Owner}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Owner: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            >
              <option value="first">First Owner</option>
              <option value="second">Second Owner</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              ML Model
            </label>

            <select
              value={formData.model}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  model: e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            >
              <option value="linear_regression">Linear Regression</option>
              <option value="ridge_regression">Ridge Regression</option>
              <option value="lasso_regression">Lasso Regression</option>
              <option value="decision_tree">Decision Tree</option>
              <option value="random_forest">Random Forest</option>
              <option value="gradient_boosting">Gradient Boosting</option>
              <option value="svr">SVR</option>
            </select>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="md:col-span-2 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-bold uppercase tracking-wider transition"
          >
            {loading ? 'Predicting...' : 'Predict Car Price'}
          </button>
        </form>

        {result !== null && (
          <div className="mt-8 border-t border-slate-800 pt-8 text-center">

            <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-2">
              Predicted Selling Price
            </h3>

            <div className="text-5xl font-black text-emerald-400">
              {formatPrediction(result)}
            </div>

            <div className="mt-3 text-slate-400 text-lg">
              ₹ {Number(result).toLocaleString("en-IN")}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

