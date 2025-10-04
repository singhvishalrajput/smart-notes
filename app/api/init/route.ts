import { NextResponse } from 'next/server';
import { ReminderService } from '@/lib/services/reminderService';
import connectDB from '@/lib/db/mongodb';

export async function GET() {
  try {
    // Initialize database connection
    await connectDB();
    
    // Initialize reminder service
    ReminderService.initialize();
    
    return NextResponse.json({ 
      message: 'Smart Notes initialized successfully',
      status: 'ok'
    });
  } catch (error: any) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize', message: error.message },
      { status: 500 }
    );
  }
}