import { NextRequest, NextResponse } from 'next/server';
import { TodoService } from '@/lib/services/todoService';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const userId = 'user123'; // Replace with actual auth
    const body = await request.json();
    const { complete } = body; // true or false

    const params = await context.params;
    let note;
    if (complete) {
      note = await TodoService.markTodoComplete(params.id, userId);
    } else {
      note = await TodoService.markTodoIncomplete(params.id, userId);
    }

    if (!note) {
      return NextResponse.json(
        { error: 'Todo not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error: any) {
    console.error('Error updating todo:', error);
    return NextResponse.json(
      { error: 'Failed to update todo', message: error.message },
      { status: 500 }
    );
  }
}