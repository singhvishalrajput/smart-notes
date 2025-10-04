export interface Note {
  _id?: string;
  userId: string;
  title: string;
  content: string; // JSON/HTML from Tiptap
  type: 'note' | 'todo';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  
  // Reminder & duration
  reminder?: Date;
  startDate?: Date;
  endDate?: Date;
  
  // To-dos
  deadline?: Date;
  status?: 'pending' | 'done' | 'expired';
}

export interface NoteFilters {
  search?: string;
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
  type?: 'note' | 'todo';
  status?: 'pending' | 'done' | 'expired';
}

export interface PaginatedNotes {
  notes: Note[];
  total: number;
  page: number;
  totalPages: number;
}