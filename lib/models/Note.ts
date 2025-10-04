import mongoose, { Schema, Model } from 'mongoose';
import { Note } from '@/types/note';

const NoteSchema = new Schema<Note>({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['note', 'todo'],
    default: 'note',
    index: true,
  },
  tags: {
    type: [String],
    default: [],
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  // Reminder & duration
  reminder: {
    type: Date,
    index: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
    index: true,
  },
  
  // To-dos
  deadline: {
    type: Date,
    index: true,
  },
  status: {
    type: String,
    enum: ['pending', 'done', 'expired'],
    default: 'pending',
    index: true,
  },
});

// Text index for search
NoteSchema.index({ title: 'text', content: 'text' });

// Compound indexes for common queries
NoteSchema.index({ userId: 1, type: 1, status: 1 });
NoteSchema.index({ userId: 1, createdAt: -1 });

// Middleware to update updatedAt
NoteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const NoteModel: Model<Note> = mongoose.models.Note || mongoose.model<Note>('Note', NoteSchema);

export default NoteModel;