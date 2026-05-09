'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/users', label: 'Users', icon: '👥' },
  { href: '/dashboard/providers', label: 'Providers', icon: '🔧' },
  { href: '/dashboard/bookings', label: 'Bookings', icon: '📅' },
  { href: '/dashboard/reviews', label: 'Reviews', icon: '⭐' },
];

export default function Sidebar() {
  const path = usePathname();

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    window.location.href = '/login';
  };

  return (
    <aside className="w-52 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="font-semibold text-gray-900">HunarLink</h1>
        <p className="text-xs text-gray-500">Admin Panel</p>
      </div>

      <nav className="p-2 flex-1">
        {links.map((l) => (
          <Link key={l.href} href={l.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-colors
              ${path === l.href
                ? 'bg-gray-100 text-gray-900 font-medium'
                : 'text-gray-600 hover:bg-gray-50'}`}>
            <span>{l.icon}</span>{l.label}
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-gray-200">
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full">
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}