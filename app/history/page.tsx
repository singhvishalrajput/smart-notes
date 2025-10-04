'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/types/note';
import Link from 'next/link';
import { CheckCircle, XCircle, Search } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/history?page=${page}&limit=20`);
      const data = await response.json();
      setHistory(data.notes);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('/api/notes/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filters: {
            search: searchTerm,
            status: ['done', 'expired']
          },
          page: 1,
          limit: 20
        }),
      });
      const data = await response.json();
      setHistory(data.notes);
      setTotalPages(data.totalPages);
      setPage(1);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading history...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">History</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search completed or expired items..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 inline-flex items-center"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              fetchHistory();
            }}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Clear
          </button>
        </div>
      </form>

      {history.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No history items found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/notes/${item._id}`}>
                  <h2 className="text-lg font-semibold hover:text-blue-600">{item.title}</h2>
                </Link>
                <span className={`px-3 py-1 rounded text-sm ${
                  item.status === 'done' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <span className="inline-flex items-center">
                    {item.status === 'done' ? (
                      <><CheckCircle className="w-4 h-4 mr-1" /> Completed</>
                    ) : (
                      <><XCircle className="w-4 h-4 mr-1" /> Expired</>
                    )}
                  </span>
                </span>
              </div>

              <div
                className="prose max-w-none text-gray-600 text-sm mb-2 line-clamp-2"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />

              <div className="flex flex-wrap gap-2 mb-2">
                {item.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                {item.type === 'todo' && item.deadline && (
                  <span className="mr-4">
                    Deadline was: {new Date(item.deadline).toLocaleString()}
                  </span>
                )}
                <span>
                  {item.status === 'done' ? 'Completed' : 'Expired'}: {new Date(item.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}