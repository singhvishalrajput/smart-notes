import { NextRequest, NextResponse } from 'next/server';
import { NoteService } from '@/lib/services/noteService';

// GET - Get single note
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = 'user123'; // Replace with actual auth
    const params = await context.params;
    const note = await NoteService.getNoteById(params.id, userId);

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error: any) {
    console.error('Error fetching note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch note', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update note
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = 'user123'; // Replace with actual auth
    const body = await request.json();

    const params = await context.params;
    const note = await NoteService.updateNote(params.id, userId, body);

    if (!note) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error: any) {
    console.error('Error updating note:', error);
    return NextResponse.json(
      { error: 'Failed to update note', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete note
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = 'user123'; // Replace with actual auth
    const params = await context.params;
    const deleted = await NoteService.deleteNote(params.id, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Failed to delete note', message: error.message },
      { status: 500 }
    );
  }
}