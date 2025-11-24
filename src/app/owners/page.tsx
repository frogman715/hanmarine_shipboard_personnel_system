'use client'

import { useState, useEffect } from 'react'

type Owner = {
  id: number
  name: string
  code?: string
  country?: string
  contact?: string
  email?: string
  notes?: string
  _count?: { vessels: number }
}

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    country: '',
    contact: '',
    email: '',
    notes: '',
  })

  useEffect(() => {
    fetchOwners()
  }, [])

  async function fetchOwners() {
    setLoading(true)
    const res = await fetch('/api/owners?includeCount=true')
    const data = await res.json()
    setOwners(data)
    setLoading(false)
  }

  function handleCreate() {
    setEditingId(null)
    setFormData({ name: '', code: '', country: '', contact: '', email: '', notes: '' })
    setShowForm(true)
  }

  function handleEdit(owner: Owner) {
    setEditingId(owner.id)
    setFormData({
      name: owner.name,
      code: owner.code || '',
      country: owner.country || '',
      contact: owner.contact || '',
      email: owner.email || '',
      notes: owner.notes || '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/api/owners?id=${editingId}` : '/api/owners'
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setShowForm(false)
      fetchOwners()
    } else {
      alert('Failed to save owner')
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete owner "${name}"?`)) return
    
    const res = await fetch(`/api/owners?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchOwners()
    } else {
      alert('Failed to delete owner (might have linked vessels)')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Owner Management</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Owner
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Owner' : 'Add New Owner'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Owner Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., LUNDQVIST REDERIERNA"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., LUNDQVIST"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., Sweden"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Contact Person</label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="e.g., contact@owner.com"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Code</th>
                <th className="text-left p-3">Country</th>
                <th className="text-left p-3">Contact</th>
                <th className="text-left p-3">Email</th>
                <th className="text-center p-3">Vessels</th>
                <th className="text-center p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{owner.name}</td>
                  <td className="p-3 text-gray-600">{owner.code || '-'}</td>
                  <td className="p-3 text-gray-600">{owner.country || '-'}</td>
                  <td className="p-3 text-gray-600">{owner.contact || '-'}</td>
                  <td className="p-3 text-gray-600">{owner.email || '-'}</td>
                  <td className="p-3 text-center">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {owner._count?.vessels || 0}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleEdit(owner)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(owner.id, owner.name)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
