'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Review } from '@/types';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reviews')
      .then(r => setReviews(r.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Reviews</h2>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Consumer</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Provider</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Rating</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Comment</th>
              <th className="text-left px-4 py-3 text-gray-500 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td></tr>}
            {!loading && reviews.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400">No reviews found</td></tr>}
            {reviews.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{r.consumer.name}</td>
                <td className="px-4 py-3 text-gray-600">{r.provider.user.name}</td>
                <td className="px-4 py-3 text-yellow-500 tracking-tight">{stars(r.rating)}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{r.comment}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(r.createdAt).toLocaleDateString('en-PK')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}