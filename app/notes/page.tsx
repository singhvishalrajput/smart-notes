'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/types/note';
import Link from 'next/link';
import { Bell, Trash2 } from 'lucide-react';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNotes();
  }, [page]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notes?page=${page}&limit=20`);
      const data = await response.json();
      setNotes(data.notes);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  if (loading) {
    return <div className="p-8">Loading notes...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Notes</h1>
        <Link
          href="/notes/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <div key={note._id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <Link href={`/notes/${note._id}`} className="flex-1">
                  <h2 className="text-xl font-semibold hover:text-blue-600">{note.title}</h2>
                </Link>
                <button
                  onClick={() => deleteNote(note._id!)}
                  className="text-red-500 hover:text-red-700 ml-4"
                  title="Delete note"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <div
                className="prose max-w-none text-gray-600 mb-3 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />

              <div className="flex flex-wrap gap-2 mb-2">
                {note.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-sm text-gray-500">
                Created: {new Date(note.createdAt).toLocaleDateString()}
                {note.reminder && (
                  <span className="ml-4 inline-flex items-center">
                    <Bell className="w-4 h-4 mr-1" /> Reminder: {new Date(note.reminder).toLocaleString()}
                  </span>
                )}
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