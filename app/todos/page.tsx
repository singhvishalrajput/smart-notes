'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/types/note';
import Link from 'next/link';
import { Calendar, AlertCircle } from 'lucide-react';

export default function TodosPage() {
  const [todos, setTodos] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/todos');
      const data = await response.json();
      setTodos(data.notes);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (id: string, currentStatus: string) => {
    try {
      const response = await fetch(`/api/todos/${id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complete: currentStatus !== 'done' }),
      });

      if (response.ok) {
        fetchTodos();
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const isOverdue = (deadline: Date) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return <div className="p-8">Loading todos...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My To-Dos</h1>
        <Link
          href="/notes/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Create New To-Do
        </Link>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No pending todos. Great job!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`border rounded-lg p-4 flex items-start gap-4 ${
                todo.deadline && isOverdue(todo.deadline) ? 'border-red-300 bg-red-50' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={todo.status === 'done'}
                onChange={() => toggleComplete(todo._id!, todo.status!)}
                className="mt-1 w-5 h-5 cursor-pointer"
              />
              
              <div className="flex-1">
                <Link href={`/notes/${todo._id}`}>
                  <h2 className={`text-lg font-semibold hover:text-blue-600 ${
                    todo.status === 'done' ? 'line-through text-gray-500' : ''
                  }`}>
                    {todo.title}
                  </h2>
                </Link>

                <div
                  className="prose max-w-none text-gray-600 text-sm mt-1"
                  dangerouslySetInnerHTML={{ __html: todo.content }}
                />

                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  {todo.deadline && (
                    <span className={`${
                      isOverdue(todo.deadline) ? 'text-red-600 font-semibold' : 'text-gray-600'
                    }`}>
                      <Calendar className="inline-block w-4 h-4 mr-1" /> Due: {new Date(todo.deadline).toLocaleString()}
                      {isOverdue(todo.deadline) && (
                        <span className="inline-flex items-center ml-1">
                          <AlertCircle className="w-4 h-4 mr-1" /> Overdue!
                        </span>
                      )}
                    </span>
                  )}
                  {todo.tags.length > 0 && (
                    <div className="flex gap-1">
                      {todo.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}