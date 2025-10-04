import { NextRequest, NextResponse } from 'next/server';
import { NoteService } from '@/lib/services/noteService';
import { NoteFilters } from '@/types/note';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filters, page = 1, limit = 20 } = body;
    
    const userId = 'user123'; // Replace with actual auth

    const result = await NoteService.searchNotes(
      userId,
      filters as NoteFilters,
      page,
      limit
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error searching notes:', error);
    return NextResponse.json(
      { error: 'Failed to search notes', message: error.message },
      { status: 500 }
    );
  }
}