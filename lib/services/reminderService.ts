import cron from 'node-cron';
import { NoteService } from './noteService';

export class ReminderService {
  private static isInitialized = false;

  static initialize() {
    if (this.isInitialized) {
      console.log('⏰ Reminder service already initialized');
      return;
    }

    // Check for expired todos every hour
    cron.schedule('0 * * * *', async () => {
      console.log('🔍 Checking for expired todos...');
      try {
        await NoteService.checkExpiredTodos();
        console.log('✅ Expired todos updated');
      } catch (error) {
        console.error('❌ Error checking expired todos:', error);
      }
    });

    // Check for upcoming reminders every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      console.log('🔔 Checking for upcoming reminders...');
      try {
        // This would trigger browser notifications
        // For now, just log the reminders
        const userId = 'user123'; // In production, loop through active users
        const reminders = await NoteService.getUpcomingReminders(userId);
        
        if (reminders.length > 0) {
          console.log(`📢 Found ${reminders.length} upcoming reminders`);
          // Here you would send notifications
          reminders.forEach(note => {
            console.log(`- Reminder: ${note.title} at ${note.reminder}`);
          });
        }
      } catch (error) {
        console.error('❌ Error checking reminders:', error);
      }
    });

    this.isInitialized = true;
    console.log('✅ Reminder service initialized');
  }

  static async sendNotification(userId: string, noteId: string, title: string, message: string) {
    // In a real app, this would use Web Push API or similar
    // For now, we'll just log it
    console.log(`📬 Notification for user ${userId}:`);
    console.log(`   Note: ${noteId}`);
    console.log(`   Title: ${title}`);
    console.log(`   Message: ${message}`);
    
    // TODO: Implement actual push notifications
    // This would typically use service workers and the Push API
  }
}

// Auto-initialize in development
if (process.env.NODE_ENV === 'development') {
  ReminderService.initialize();
}