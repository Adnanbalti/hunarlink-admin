'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    avgRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/providers'),
      api.get('/bookings'),
      api.get('/reviews'),
    ]).then(([users, providers, bookings, reviews]) => {
      const reviewList = reviews.data.data ?? [];
      const avg = reviewList.length
        ? (reviewList.reduce((s: number, r: any) => s + r.rating, 0) / reviewList.length).toFixed(1)
        : 0;
      setStats({
        totalUsers: users.data.data?.length ?? 0,
        totalProviders: providers.data.data?.length ?? 0,
        totalBookings: bookings.data.data?.length ?? 0,
        avgRating: Number(avg),
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
    { label: 'Providers', value: stats.totalProviders, icon: '🔧' },
    { label: 'Bookings', value: stats.totalBookings, icon: '📅' },
    { label: 'Avg Rating', value: stats.avgRating, icon: '⭐' },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Dashboard</h2>
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((c) => (
            <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-2xl mb-2">{c.icon}</div>
              <div className="text-2xl font-semibold">{c.value}</div>
              <div className="text-sm text-gray-500 mt-1">{c.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}