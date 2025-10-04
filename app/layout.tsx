import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { LayoutDashboard, StickyNote, CheckCircle, History } from 'lucide-react';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Smart Notes - Your Personal Note Manager',
  description: 'Efficiently create, organize, and manage your notes and to-dos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 text-white p-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Smart Notes</h1>
              <p className="text-gray-400 text-sm">Phase 1</p>
            </div>

            <nav className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" /> Dashboard
              </Link>
              <Link
                href="/notes"
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                <StickyNote className="w-5 h-5" /> Notes
              </Link>
              <Link
                href="/todos"
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                <CheckCircle className="w-5 h-5" /> To-Dos
              </Link>
              <Link
                href="/history"
                className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                <History className="w-5 h-5" /> History
              </Link>
            </nav>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <Link
                href="/notes/new"
                className="block w-full px-4 py-2 bg-blue-600 text-center rounded hover:bg-blue-700 transition-colors"
              >
                + New Note
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-gray-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}