'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Provider } from '@/types';

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/providers')
      .then(r => setProviders(r.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    await api.patch(`/providers/${id}/verify`);
    setProviders(prev => prev.map(p => p.id === id ? { ...p, isVerified: true } : p));
  };

  const handleReject = async (id: string) => {
    await api.delete(`/providers/${id}`);
    setProviders(prev => prev.filter(p => p.id !== id));
  };

  const filtered = filter === 'pending' ? providers.filter(p => !p.isVerified) : providers;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Providers</h2>
        <div className="flex gap-2">
          <button onClick={() => setFilter('pending')}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${filter === 'pending' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            Pending ({providers.filter(p => !p.isVerified).length})
          </button>
          <button onClick={() => setFilter('all')}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${filter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            All
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Skill</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">City</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Rate/hr</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">No providers found</td></tr>}
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{p.user.name}</td>
                <td className="px-4 py-3 text-gray-600">{p.skills ? p.skills.join(', ') : p.skill}</td>
                <td className="px-4 py-3 text-gray-600">{p.city}</td>
                <td className="px-4 py-3 text-gray-600">Rs. {p.hourlyRate}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.isVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                    {p.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {!p.isVerified && (
                    <>
                      <button onClick={() => handleApprove(p.id)} className="text-xs px-3 py-1 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 mr-2">Approve</button>
                      <button onClick={() => handleReject(p.id)} className="text-xs px-3 py-1 rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}