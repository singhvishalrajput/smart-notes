import NoteModel from '@/lib/models/Note';
import { Note, PaginatedNotes } from '@/types/note';
import connectDB from '@/lib/db/mongodb';

export class TodoService {
  static async getAllTodos(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedNotes> {
    await connectDB();
    const skip = (page - 1) * limit;

    const query = {
      userId,
      type: 'todo',
      status: 'pending'
    };

    const [notes, total] = await Promise.all([
      NoteModel.find(query)
        .sort({ deadline: 1 }) // Sort by deadline ascending
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

  static async markTodoComplete(id: string, userId: string): Promise<Note | null> {
    await connectDB();
    
    const note = await NoteModel.findOneAndUpdate(
      { _id: id, userId, type: 'todo' },
      { 
        status: 'done',
        updatedAt: new Date()
      },
      { new: true }
    );

    return note ? note.toObject() : null;
  }

  static async markTodoIncomplete(id: string, userId: string): Promise<Note | null> {
    await connectDB();
    
    const note = await NoteModel.findOneAndUpdate(
      { _id: id, userId, type: 'todo' },
      { 
        status: 'pending',
        updatedAt: new Date()
      },
      { new: true }
    );

    return note ? note.toObject() : null;
  }

  static async getHistory(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedNotes> {
    await connectDB();
    const skip = (page - 1) * limit;

    const query = {
      userId,
      $or: [
        { status: 'done' },
        { status: 'expired' }
      ]
    };

    const [notes, total] = await Promise.all([
      NoteModel.find(query)
        .sort({ updatedAt: -1 })
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

  static async getUpcomingDeadlines(userId: string, days: number = 7): Promise<Note[]> {
    await connectDB();
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const todos = await NoteModel.find({
      userId,
      type: 'todo',
      status: 'pending',
      deadline: {
        $gte: now,
        $lte: futureDate
      }
    })
    .sort({ deadline: 1 })
    .lean();

    return todos;
  }
}