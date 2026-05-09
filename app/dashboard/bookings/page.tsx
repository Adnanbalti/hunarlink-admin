'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Booking } from '@/types';

type Status = 'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<Status>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings')
      .then(r => setBookings(r.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL'
    ? bookings
    : bookings.filter(b => b.status === filter);

  const statusStyle: Record<string, string> = {
    PENDING: 'bg-yellow-50 text-yellow-700',
    CONFIRMED: 'bg-blue-50 text-blue-700',
    COMPLETED: 'bg-green-50 text-green-700',
    CANCELLED: 'bg-red-50 text-red-600',
  };

  const filters: Status[] = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Bookings</h2>
        <div className="flex gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors
                ${filter === f
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Consumer</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Provider</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Scheduled</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Amount</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400">No bookings found</td></tr>}
            {filtered.map((b) => (
              <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                {/* <td className="px-4 py-3 font-medium">{b.consumer.name}</td> */}
                <td className="px-4 py-3 font-medium text-gray-900">{b.consumer.name}</td>
                <td className="px-4 py-3 text-gray-600">{b.provider.user.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(b.scheduledAt).toLocaleDateString('en-PK')}
                </td>
                <td className="px-4 py-3 text-gray-600">Rs. {b.totalAmount}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle[b.status]}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}