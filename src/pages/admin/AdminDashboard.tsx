import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Users, FileText, Settings } from 'lucide-react';

const ADMIN_LINKS = [
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { path: '/admin/settings', label: 'Settings', icon: Settings }
];

export function AdminDashboard() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/admin" className="text-xl font-bold text-gray-900">
                BondMate Admin
              </Link>
              <nav className="ml-8 flex space-x-4">
                {ADMIN_LINKS.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
                      location.pathname.startsWith(path)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <Link
              to="/dashboard"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to App
            </Link>
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}