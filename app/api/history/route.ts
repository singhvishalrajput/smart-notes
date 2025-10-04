import { NextRequest, NextResponse } from 'next/server';
import { TodoService } from '@/lib/services/todoService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    const userId = 'user123'; // Replace with actual auth

    const result = await TodoService.getHistory(userId, page, limit);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history', message: error.message },
      { status: 500 }
    );
  }
}