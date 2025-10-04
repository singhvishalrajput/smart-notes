import { NextRequest, NextResponse } from 'next/server';
import { NoteService } from '@/lib/services/noteService';

// GET - List all notes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // For now, using a hardcoded userId - replace with actual auth
    const userId = 'user123';

    const result = await NoteService.getAllNotes(userId, page, limit);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, using a hardcoded userId - replace with actual auth
    const userId = 'user123';

    const noteData = {
      ...body,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const note = await NoteService.createNote(noteData);

    return NextResponse.json(note, { status: 201 });
  } catch (error: any) {
    console.error('Error creating note:', error);
    return NextResponse.json(
      { error: 'Failed to create note', message: error.message },
      { status: 500 }
    );
  }
}