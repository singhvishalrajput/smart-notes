'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/types/note';
import Link from 'next/link';
import { CheckCircle, History, StickyNote } from 'lucide-react';

export default function DashboardPage() {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [upcomingTodos, setUpcomingTodos] = useState<Note[]>([]);
  const [stats, setStats] = useState({
    totalNotes: 0,
    pendingTodos: 0,
    completedToday: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent notes
      const notesRes = await fetch('/api/notes?page=1&limit=5');
      const notesData = await notesRes.json();
      setRecentNotes(notesData.notes);

      // Fetch upcoming todos
      const todosRes = await fetch('/api/todos?page=1&limit=5');
      const todosData = await todosRes.json();
      setUpcomingTodos(todosData.notes);

      // Update stats
      setStats({
        totalNotes: notesData.total,
        pendingTodos: todosData.total,
        completedToday: 0 // You can implement this with a dedicated endpoint
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Smart Notes Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="text-blue-600 text-sm font-medium mb-2">Total Notes</div>
          <div className="text-3xl font-bold text-blue-700">{stats.totalNotes}</div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="text-orange-600 text-sm font-medium mb-2">Pending To-Dos</div>
          <div className="text-3xl font-bold text-orange-700">{stats.pendingTodos}</div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-green-600 text-sm font-medium mb-2">Completed Today</div>
          <div className="text-3xl font-bold text-green-700">{stats.completedToday}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/notes/new"
          className="bg-blue-500 text-white rounded-lg p-6 text-center hover:bg-blue-600 transition-colors"
        >
          <div className="flex justify-center mb-2"><StickyNote className="w-8 h-8" /></div>
          <div className="font-semibold">Create Note</div>
        </Link>
        
        <Link
          href="/todos"
          className="bg-orange-500 text-white rounded-lg p-6 text-center hover:bg-orange-600 transition-colors"
        >
          <div className="flex justify-center mb-2"><CheckCircle className="w-8 h-8" /></div>
          <div className="font-semibold">View To-Dos</div>
        </Link>
        
        <Link
          href="/history"
          className="bg-green-500 text-white rounded-lg p-6 text-center hover:bg-green-600 transition-colors"
        >
          <div className="flex justify-center mb-2"><History className='w-8 h-8' /></div>
          <div className="font-semibold">History</div>
        </Link>
      </div>

      {/* Recent Notes & Upcoming Todos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Notes */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Notes</h2>
            <Link href="/notes" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          
          {recentNotes.length === 0 ? (
            <p className="text-gray-500">No notes yet</p>
          ) : (
            <div className="space-y-3">
              {recentNotes.map((note) => (
                <Link key={note._id} href={`/notes/${note._id}`}>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-1">{note.title}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Todos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Upcoming To-Dos</h2>
            <Link href="/todos" className="text-blue-600 hover:underline">
              View All
            </Link>
          </div>
          
          {upcomingTodos.length === 0 ? (
            <p className="text-gray-500">No pending todos</p>
          ) : (
            <div className="space-y-3">
              {upcomingTodos.map((todo) => (
                <div key={todo._id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-1">{todo.title}</h3>
                  {todo.deadline && (
                    <p className="text-sm text-orange-600">
                      Due: {new Date(todo.deadline).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}