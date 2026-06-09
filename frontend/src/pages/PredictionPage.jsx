import React, { useState } from 'react';
import API from '../services/api';

export default function PredictionPage() {
  const [formData, setFormData] = useState({
    Car_Name: '',
    Year: 2020,
    Present_Price: '',
    Kms_Driven: '',
    Fuel_Type: 'Petrol',
    Seller_Type: 'Dealer',
    Transmission: 'Manual',
    Owner: 0,
    model: 'xgboost'
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResult(null);

    const payload = {
      ...formData,
      Year: parseInt(formData.Year),
      Present_Price: parseFloat(formData.Present_Price),
      Kms_Driven: parseInt(formData.Kms_Driven),
      Owner: parseInt(formData.Owner)
    };

    try {
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
  const rupees = Number(prediction) * 100000;

  if (rupees < 50000) {
    return "Negligible Value";
  }

  return `₹ ${Number(prediction).toFixed(2)} Lakhs`;
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
                setFormData({ ...formData, Car_Name: e.target.value })
              }
              placeholder="e.g. Swift, City, Innova"
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
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
                setFormData({ ...formData, Year: e.target.value })
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
              placeholder="e.g. 8.50"
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
              placeholder="e.g. 45000"
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
              Number of Previous Owners
            </label>
            <input
              type="number"
              required
              min="0"
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

          {/* Model Selection */}
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
              <option value="xgboost">XGBoost</option>
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
      Predicted Selling Price (₹ Lakhs)
    </h3>

    <div className="text-5xl font-black text-emerald-400">
      {formatPrediction(result)}
    </div>

    {Number(result) * 100000 >= 50000 && (
      <div className="mt-3 text-slate-400 text-lg">
        ₹ {(Number(result) * 100000).toLocaleString("en-IN")}
      </div>
    )}
  </div>
)}
      </div>
    </div>
  );
}