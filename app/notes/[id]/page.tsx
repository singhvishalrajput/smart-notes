'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NoteForm from '@/components/notes/NoteForm';
import { Note } from '@/types/note';

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNote();
  }, [params.id]);

  const fetchNote = async () => {
    try {
      const response = await fetch(`/api/notes/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setNote(data);
      } else {
        alert('Note not found');
        router.push('/notes');
      }
    } catch (error) {
      console.error('Error fetching note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (noteData: Partial<Note>) => {
    try {
      const response = await fetch(`/api/notes/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        router.push('/notes');
      } else {
        alert('Failed to update note');
      }
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Error updating note');
    }
  };

  if (loading) {
    return <div className="p-8">Loading note...</div>;
  }

  if (!note) {
    return <div className="p-8">Note not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Note</h1>
      <NoteForm 
        initialNote={note}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/notes')}
      />
    </div>
  );
}