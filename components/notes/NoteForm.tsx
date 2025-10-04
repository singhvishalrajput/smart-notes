'use client';

import { useState } from 'react';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { Note } from '@/types/note';

interface NoteFormProps {
  initialNote?: Partial<Note>;
  onSubmit: (note: Partial<Note>) => void;
  onCancel?: () => void;
}

export default function NoteForm({ initialNote, onSubmit, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(initialNote?.title || '');
  const [content, setContent] = useState(initialNote?.content || '');
  const [type, setType] = useState<'note' | 'todo'>(initialNote?.type || 'note');
  const [tags, setTags] = useState<string>(initialNote?.tags?.join(', ') || '');
  const [reminder, setReminder] = useState(
    initialNote?.reminder ? new Date(initialNote.reminder).toISOString().slice(0, 16) : ''
  );
  const [startDate, setStartDate] = useState(
    initialNote?.startDate ? new Date(initialNote.startDate).toISOString().slice(0, 16) : ''
  );
  const [endDate, setEndDate] = useState(
    initialNote?.endDate ? new Date(initialNote.endDate).toISOString().slice(0, 16) : ''
  );
  const [deadline, setDeadline] = useState(
    initialNote?.deadline ? new Date(initialNote.deadline).toISOString().slice(0, 16) : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const noteData: Partial<Note> = {
      title,
      content,
      type,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    if (reminder) noteData.reminder = new Date(reminder);
    if (startDate) noteData.startDate = new Date(startDate);
    if (endDate) noteData.endDate = new Date(endDate);
    
    if (type === 'todo') {
      if (deadline) noteData.deadline = new Date(deadline);
      noteData.status = 'pending';
    }

    onSubmit(noteData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter note title"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as 'note' | 'todo')}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="note">Note</option>
          <option value="todo">To-Do</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Content</label>
        <TiptapEditor content={content} onChange={setContent} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="work, personal, ideas"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Reminder</label>
          <input
            type="datetime-local"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {type === 'todo' && (
          <div>
            <label className="block text-sm font-medium mb-2">Deadline</label>
            <input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Note
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}