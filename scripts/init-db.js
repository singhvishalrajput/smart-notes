// scripts/init-db.js
// This script creates text indexes for search functionality

const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-notes';

async function initDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Create text index on notes collection
    console.log('Creating text index on notes...');
    await db.collection('notes').createIndex(
      { title: 'text', content: 'text' },
      { name: 'notes_text_search' }
    );
    console.log('✅ Text index created');

    // Create other useful indexes
    console.log('Creating additional indexes...');
    await db.collection('notes').createIndex({ userId: 1, type: 1, status: 1 });
    await db.collection('notes').createIndex({ userId: 1, createdAt: -1 });
    await db.collection('notes').createIndex({ deadline: 1 });
    await db.collection('notes').createIndex({ reminder: 1 });
    console.log('✅ All indexes created');

    console.log('\n🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();