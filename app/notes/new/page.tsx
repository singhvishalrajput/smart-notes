'use client';

import { useRouter } from 'next/navigation';
import NoteForm from '@/components/notes/NoteForm';
import { Note } from '@/types/note';

export default function NewNotePage() {
  const router = useRouter();

  const handleSubmit = async (noteData: Partial<Note>) => {
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        router.push('/notes');
      } else {
        alert('Failed to create note');
      }
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Error creating note');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Note</h1>
      <NoteForm 
        onSubmit={handleSubmit}
        onCancel={() => router.push('/notes')}
      />
    </div>
  );
}