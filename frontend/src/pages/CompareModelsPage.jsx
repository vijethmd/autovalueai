
import React, { useState } from 'react';
import API from '../services/api';

export default function CompareModelsPage() {
  const [formData, setFormData] = useState({
    Brand: '',
    model_name: '',
    Year: new Date().getFullYear(),
    Age: '',
    kmDriven: '',
    FuelType: 'Petrol',
    Transmission: 'Manual',
    Owner: 'first'
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
        Age: parseInt(formData.Age),
        kmDriven: parseInt(formData.kmDriven)
      };

      const res = await API.post(
        '/compare-models',
        payload
      );

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

    return Object.entries(matrix).reduce(
      (best, current) =>
        current[1] > best[1]
          ? current
          : best
    );
  };

  const bestModel = getBestModel();

  const formatPrediction = (
    prediction
  ) => {
    return `₹ ${Number(
      prediction
    ).toLocaleString('en-IN')}`;
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
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
              placeholder="e.g. Hyundai"
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
                  model_name:
                    e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
              placeholder="e.g. i20"
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
              value={
                formData.kmDriven
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  kmDriven:
                    e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
              placeholder="e.g. 45000"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Fuel Type
            </label>

            <select
              value={
                formData.FuelType
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  FuelType:
                    e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            >
              <option value="Petrol">
                Petrol
              </option>

              <option value="Diesel">
                Diesel
              </option>

              <option value="Hybrid/CNG">
                Hybrid/CNG
              </option>

              <option value="hybrid">
                Hybrid
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">
              Transmission
            </label>

            <select
              value={
                formData.Transmission
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  Transmission:
                    e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            >
              <option value="Manual">
                Manual
              </option>

              <option value="Automatic">
                Automatic
              </option>
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
                  Owner:
                    e.target.value
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm"
            >
              <option value="first">
                First Owner
              </option>

              <option value="second">
                Second Owner
              </option>
            </select>
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
                  Highest Predicted Value
                </h3>

                <p className="text-sm text-slate-300 mt-1">
                  Model:{' '}
                  <span className="font-bold capitalize">
                    {bestModel[0].replace(
                      /_/g,
                      ' '
                    )}
                  </span>
                </p>

                <p className="text-2xl font-black text-emerald-400 mt-2">
                  {formatPrediction(
                    bestModel[1]
                  )}
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
                      Predicted Price (₹)
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {Object.entries(
                    matrix
                  )
                    .sort(
                      (a, b) =>
                        b[1] - a[1]
                    )
                    .map(
                      ([
                        model,
                        prediction
                      ]) => (
                        <tr
                          key={model}
                          className={`border-b border-slate-800 ${
                            bestModel &&
                            model ===
                              bestModel[0]
                              ? 'bg-emerald-950/20'
                              : ''
                          }`}
                        >

                          <td className="p-4 capitalize">
                            {model.replace(
                              /_/g,
                              ' '
                            )}
                          </td>

                          <td className="p-4 text-right font-semibold">
                            {formatPrediction(
                              prediction
                            )}
                          </td>

                        </tr>
                      )
                    )}

                </tbody>

              </table>

            </div>
          </>
        )}

      </div>
    </div>
  );
}

