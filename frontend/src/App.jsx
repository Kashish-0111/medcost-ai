import { useState } from 'react'
import axios from 'axios'

function App() {
  const [form, setForm] = useState({ procedure: '', city: '', budget: '' })
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResults(null)

    try {
      const res = await axios.post('http://localhost:5000/api/search', {
        procedure: form.procedure,
        city: form.city,
        budget: form.budget ? Number(form.budget) : null
      })
      setResults(res.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <span className="text-3xl">🏥</span>
          <div>
            <h1 className="text-2xl font-bold text-teal-600">MedCost AI</h1>
            <p className="text-gray-500 text-sm">AI-Powered Healthcare Navigator & Cost Estimator</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Find Best Hospitals & Estimate Cost 🔍</h2>

          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Procedure / Surgery</label>
                <input
                  type="text"
                  placeholder="e.g. Heart Surgery"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={form.procedure}
                  onChange={(e) => setForm({ ...form, procedure: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">City</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Budget (₹) — Optional</label>
                <input
                  type="number"
                  placeholder="e.g. 300000"
                  className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg transition w-full md:w-auto"
            >
              {loading ? 'Searching... ⏳' : 'Find Hospitals 🔍'}
            </button>
          </form>

          {error && (
            <p className="text-red-500 mt-4 text-sm">{error}</p>
          )}
        </div>

        {/* Results */}
   {results && (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-4">
      Top Hospitals for <span className="text-teal-600">{results.aiDetectedProcedure || results.procedure}</span> in <span className="text-teal-600">{results.city}</span>
    </h2>

    {/* AI Detection Info */}
    {results.aiDetectedProcedure && (
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
        <p className="text-teal-700 font-medium">
          🤖 AI detected: <span className="font-bold">{results.aiDetectedProcedure}</span>
          <span className="ml-2 text-sm">({results.confidence}% confidence)</span>
        </p>
        {results.suggestions?.length > 0 && (
          <ul className="mt-2 text-sm text-teal-600">
            {results.suggestions.map((s, i) => (
              <li key={i}>💡 {s}</li>
            ))}
          </ul>
        )}
      </div>
    )}

    <div className="flex flex-col gap-6">
      {results.topHospitals.map((item, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-md p-6">
          {/* Hospital Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-teal-500">#{index + 1}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.hospital.name}</h3>
                <p className="text-gray-500 text-sm">{item.hospital.address}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold">
                Score: {item.score}
              </span>
            </div>
          </div>

          {/* Hospital Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Rating</p>
              <p className="font-bold text-gray-800">⭐ {item.hospital.rating}/5</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Success Rate</p>
              <p className="font-bold text-green-600">{item.hospital.successRate}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Accreditation</p>
              <p className="font-bold text-blue-600">{item.hospital.accreditation}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Total Beds</p>
              <p className="font-bold text-gray-800">{item.hospital.totalBeds}</p>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">💰 Cost Estimate</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Surgery', data: item.costEstimate.surgery, color: 'blue' },
                { label: 'Hospital', data: item.costEstimate.hospital, color: 'purple' },
                { label: 'Medicines', data: item.costEstimate.medicines, color: 'green' },
                { label: 'Buffer', data: item.costEstimate.buffer, color: 'yellow' },
                { label: 'Total', data: item.costEstimate.total, color: 'teal' },
              ].map((cost, i) => (
                <div key={i} className={`bg-${cost.color}-50 rounded-lg p-3 text-center`}>
                  <p className="text-xs text-gray-500">{cost.label}</p>
                  <p className="font-bold text-gray-800 text-xs">
                    ₹{(cost.data.min/1000).toFixed(0)}k - ₹{(cost.data.max/1000).toFixed(0)}k
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
      </main>
    </div>
  )
}

export default App