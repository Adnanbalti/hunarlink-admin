'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/admin/login', credentials);
      const token = res.data.data.token;
      document.cookie = `admin_token=${token}; path=/`;
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-sm">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">HunarLink</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel — Sign in</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={e => setCredentials({ ...credentials, username: e.target.value })}
              placeholder="admin"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 text-gray-900 placeholder:text-gray-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Password</label>
            <input
              type="password"
              value={credentials.password}
              onChange={e => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400 text-gray-900 placeholder:text-gray-300"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gray-900 text-white text-sm py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          username: <span className="font-medium text-gray-700">admin</span> · password: <span className="font-medium text-gray-700">hunarlink123</span>
        </p>
      </div>
    </div>
  );
}