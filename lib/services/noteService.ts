import NoteModel from '@/lib/models/Note';
import { Note, NoteFilters, PaginatedNotes } from '@/types/note';
import connectDB from '@/lib/db/mongodb';

export class NoteService {
  static async createNote(noteData: Partial<Note>): Promise<Note> {
    await connectDB();
    const note = new NoteModel(noteData);
    await note.save();
    return note.toObject();
  }

  static async getNoteById(id: string, userId: string): Promise<Note | null> {
    await connectDB();
    const note = await NoteModel.findOne({ _id: id, userId });
    return note ? note.toObject() : null;
  }

  static async updateNote(id: string, userId: string, updates: Partial<Note>): Promise<Note | null> {
    await connectDB();
    const note = await NoteModel.findOneAndUpdate(
      { _id: id, userId },
      { ...updates, updatedAt: new Date() },
      { new: true }
    );
    return note ? note.toObject() : null;
  }

  static async deleteNote(id: string, userId: string): Promise<boolean> {
    await connectDB();
    const result = await NoteModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  static async getAllNotes(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedNotes> {
    await connectDB();
    const skip = (page - 1) * limit;

    const query = {
      userId,
      type: 'note',
      $or: [
        { status: { $exists: false } },
        { status: 'pending' }
      ]
    };

    const [notes, total] = await Promise.all([
      NoteModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NoteModel.countDocuments(query)
    ]);

    return {
      notes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async searchNotes(
    userId: string,
    filters: NoteFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedNotes> {
    await connectDB();
    const skip = (page - 1) * limit;

    const query: any = { userId };

    // Text search
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    // Type filter
    if (filters.type) {
      query.type = filters.type;
    }

    // Status filter
    if (filters.status) {
      query.status = filters.status;
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    const [notes, total] = await Promise.all([
      NoteModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      NoteModel.countDocuments(query)
    ]);

    return {
      notes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async checkExpiredTodos(): Promise<void> {
    await connectDB();
    const now = new Date();
    
    await NoteModel.updateMany(
      {
        type: 'todo',
        status: 'pending',
        deadline: { $lt: now }
      },
      {
        status: 'expired',
        updatedAt: now
      }
    );
  }

  static async getUpcomingReminders(userId: string): Promise<Note[]> {
    await connectDB();
    const now = new Date();
    const nextHour = new Date(now.getTime() + 60 * 60 * 1000);

    const notes = await NoteModel.find({
      userId,
      reminder: {
        $gte: now,
        $lte: nextHour
      }
    }).lean();

    return notes;
  }
}