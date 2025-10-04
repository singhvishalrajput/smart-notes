# Smart Notes - Phase 1 Setup Guide

## Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas account)

## Installation Steps

### 1. Create Next.js Project
```bash
npx create-next-app@latest smart-notes --typescript --tailwind --app --no-src-dir
cd smart-notes
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install mongoose

# Tiptap editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-highlight @tiptap/extension-image @tiptap/extension-code-block-lowlight lowlight

# Cron for reminders
npm install node-cron
npm install @types/node-cron --save-dev

# Auth utilities
npm install bcryptjs
npm install @types/bcryptjs --save-dev

# Date utilities
npm install date-fns
```

### 3. Setup MongoDB
#### Option A: Local MongoDB
```bash
# Start MongoDB service
# On Mac: brew services start mongodb-community
# On Ubuntu: sudo systemctl start mongod
# On Windows: net start MongoDB
```

#### Option B: MongoDB Atlas
1. Create account at mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Replace in `.env.local`

### 4. Environment Variables
Create `.env.local` file in root:
```
MONGODB_URI=mongodb://localhost:27017/smart-notes
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 5. Initialize Database (Optional)
```bash
npm run init-db
```

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure Overview

```
smart-notes/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── notes/           # Notes CRUD
│   │   ├── todos/           # Todos management
│   │   └── history/         # History endpoint
│   ├── notes/               # Notes pages
│   ├── todos/               # Todos page
│   ├── history/             # History page
│   └── page.tsx             # Dashboard
├── components/              # React components
│   ├── editor/             # Tiptap editor
│   └── notes/              # Note components
├── lib/                     # Backend logic
│   ├── db/                 # Database connection
│   ├── models/             # Mongoose models
│   ├── services/           # Business logic
│   └── utils/              # Utilities
└── types/                   # TypeScript types
```

## Core Features Implemented

### ✅ Notes Management
- Create, read, update, delete notes
- Rich text editing with Tiptap
- Tags for organization
- Reminders and duration support

### ✅ To-Do System
- Create todos with deadlines
- Mark complete/incomplete
- Auto-expire overdue todos
- Visual overdue indicators

### ✅ History
- View completed/expired items
- Search with filters
- Pagination support

### ✅ Dashboard
- Quick stats overview
- Recent notes
- Upcoming todos
- Quick action buttons

### ✅ Background Jobs
- Hourly check for expired todos
- 15-minute reminder checks
- Cron-based scheduling

## API Endpoints

### Notes
- `GET /api/notes` - List all notes (paginated)
- `POST /api/notes` - Create new note
- `GET /api/notes/:id` - Get single note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/search` - Search notes with filters

### Todos
- `GET /api/todos` - List pending todos
- `POST /api/todos/:id/complete` - Toggle completion status

### History
- `GET /api/history` - List completed/expired items

## Testing the App

1. **Create a Note:**
   - Go to Dashboard → Click "Create Note"
   - Fill in title, content, add tags
   - Optionally set reminder/dates
   - Save

2. **Create a To-Do:**
   - Create a new note
   - Select type "To-Do"
   - Set a deadline
   - Save

3. **Complete a To-Do:**
   - Go to "To-Dos" page
   - Check the checkbox to mark complete
   - Item moves to History

4. **Search History:**
   - Go to "History" page
   - Use search bar to filter items

## Known Limitations (Phase 1)

- **No Authentication:** Uses hardcoded userId (`user123`)
- **No Real Notifications:** Browser push not implemented yet
- **Basic UI:** Minimal styling, functionality-focused
- **Local MongoDB:** Requires local installation

## Next Steps (Phase 2+)

- [ ] Implement proper authentication (JWT/OAuth)
- [ ] Add browser push notifications
- [ ] Enhance UI/UX with better design
- [ ] Add file attachments
- [ ] Implement sharing features
- [ ] Add mobile responsiveness
- [ ] Deploy to production

## Troubleshooting

### MongoDB Connection Error
```bash
# Check MongoDB is running
# Mac: brew services list | grep mongodb
# Linux: sudo systemctl status mongod
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Tiptap Styling Issues
Add to `globals.css`:
```css
.ProseMirror {
  outline: none;
}
```

## Support

For issues or questions, refer to:
- Next.js docs: https://nextjs.org/docs
- MongoDB docs: https://docs.mongodb.com
- Tiptap docs: https://tiptap.dev

---

**Smart Notes Phase 1** - Built with ❤️ using Next.js, TypeScript, and MongoDB