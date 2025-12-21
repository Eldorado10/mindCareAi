'use client';

import { useState, useEffect } from 'react';
import { Plus, X, AlertCircle, CheckCircle } from 'lucide-react';

export default function HealthDataImport() {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [healthData, setHealthData] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    condition: '',
    description: '',
    severity: 'moderate',
    status: 'active',
    treatmentStartDate: '',
    notes: '',
    recordedDate: new Date().toISOString().split('T')[0],
  });

  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};

  // Fetch health data
  useEffect(() => {
    if (!user.id) return;

    const fetchHealthData = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch(
          `/api/health?userId=${user.id}&limit=10&sortBy=recordedDate&sortOrder=DESC`,
          {
            headers: {
              'x-user-id': user.id,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setHealthData(result.data || []);
        } else {
          console.error('Failed to fetch health data');
        }
      } catch (err) {
        console.error('Error fetching health data:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchHealthData();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.condition.trim()) {
      setError('Health condition is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch('/api/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id,
        },
        body: JSON.stringify({
          userId: user.id,
          condition: formData.condition,
          description: formData.description,
          severity: formData.severity,
          status: formData.status,
          treatmentStartDate: formData.treatmentStartDate || null,
          notes: formData.notes,
          recordedDate: formData.recordedDate,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to save health data');
      }

      const result = await response.json();
      setSuccess('Health condition recorded successfully!');
      
      // Reset form
      setFormData({
        condition: '',
        description: '',
        severity: 'moderate',
        status: 'active',
        treatmentStartDate: '',
        notes: '',
        recordedDate: new Date().toISOString().split('T')[0],
      });

      // Refresh health data list
      setHealthData((prev) => [result, ...prev]);
      
      // Close form after success
      setTimeout(() => {
        setShowForm(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error('Error saving health data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this health record?')) return;

    try {
      const response = await fetch(`/api/health?id=${id}&userId=${user.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user.id,
        },
      });

      if (response.ok) {
        setHealthData((prev) => prev.filter((item) => item.id !== id));
        setSuccess('Health record deleted successfully!');
        setTimeout(() => setSuccess(null), 2000);
      } else {
        throw new Error('Failed to delete health record');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting health data:', err);
    }
  };

  const severityColors = {
    mild: 'bg-green-100 text-green-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    severe: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    active: 'bg-blue-100 text-blue-800',
    'in-remission': 'bg-purple-100 text-purple-800',
    resolved: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-6">
      {/* Import Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Health Conditions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition w-full sm:w-auto"
        >
          <Plus size={20} />
          Add Health Condition
        </button>
      </div>

      {/* Import Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Record Health Condition</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <CheckCircle size={18} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Health Condition *
              </label>
              <input
                type="text"
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                placeholder="e.g., Anxiety, Depression, Chronic Pain"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your condition..."
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Severity and Status */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="in-remission">In Remission</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
            </div>

            {/* Treatment Start Date and Recorded Date */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment Start Date
                </label>
                <input
                  type="date"
                  name="treatmentStartDate"
                  value={formData.treatmentStartDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Record Date *
                </label>
                <input
                  type="date"
                  name="recordedDate"
                  value={formData.recordedDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Additional notes..."
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition w-full sm:w-auto"
              >
                {loading ? 'Saving...' : 'Save Health Condition'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Health Data Table */}
      {fetchLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">Loading health records...</div>
        </div>
      ) : healthData.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">No health conditions recorded yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first health condition
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Recorded Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Treatment Start
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {healthData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.condition}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          severityColors[item.severity] || severityColors.moderate
                        }`}
                      >
                        {item.severity || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[item.status] || statusColors.active
                        }`}
                      >
                        {item.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.recordedDate
                        ? new Date(item.recordedDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.treatmentStartDate
                        ? new Date(item.treatmentStartDate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800 transition font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
