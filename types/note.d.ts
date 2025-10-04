export interface Note {
  _id?: string; // mongo id
  id?: string;
  title?: string;
  content?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
  reminder?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  status?: 'pending' | 'done' | 'expired' | string;
  type?: 'note' | 'todo' | string;
}

export interface NoteFilters {
  tag?: string;
  tags?: string[];
  search?: string;
  q?: string;
  type?: string;
  status?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  page?: number;
  limit?: number;
}

export interface PaginatedNotes {
  notes: Note[];
  total: number;
  page: number;
  totalPages?: number;
}
