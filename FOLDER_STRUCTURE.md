# 📂 Project Folder Structure

This document explains the complete folder structure of your German Learning App.

## 📁 Complete Structure

```
german-learning-web-app/
│
├── 📂 components/                  # Reusable React components
│   ├── AddWordForm.js             # Form to add new German words
│   ├── Flashcards.js              # Flashcard learning component
│   ├── Navbar.js                  # Top navigation bar
│   ├── ProgressTracker.js         # Statistics and progress display
│   ├── QuizMode.js                # Multiple-choice quiz component
│   └── WordList.js                # Display and manage word list
│
├── 📂 context/                     # React Context for global state
│   └── ThemeContext.js            # Dark/Light theme management
│
├── 📂 lib/                         # Utility functions and services
│   ├── exportService.js           # Export to CSV/JSON
│   ├── firebase.js                # Firebase initialization
│   ├── firestoreService.js        # Database CRUD operations
│   └── speechService.js           # Text-to-speech functionality
│
├── 📂 pages/                       # Next.js pages (routes)
│   ├── _app.js                    # App wrapper with theme provider
│   ├── _document.js               # HTML document structure
│   ├── index.js                   # Home page - Word list
│   ├── flashcards.js              # /flashcards route
│   ├── quiz.js                    # /quiz route
│   └── progress.js                # /progress route
│
├── 📂 styles/                      # CSS styles
│   └── globals.css                # Global styles with Tailwind
│
├── 📂 node_modules/                # Dependencies (auto-generated)
│   └── [packages]                 # All npm packages
│
├── 📂 .next/                       # Next.js build output (auto-generated)
│   └── [build files]              # Don't edit these
│
├── 📄 .env.local                   # Environment variables (YOU CREATE THIS)
│   └── Your Firebase config       # ⚠️ Never commit to Git!
│
├── 📄 .env.local.example           # Template for environment variables
├── 📄 .gitignore                   # Files to ignore in Git
├── 📄 next.config.js               # Next.js configuration
├── 📄 package.json                 # Project dependencies and scripts
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 tailwind.config.js           # Tailwind CSS configuration
├── 📄 README.md                    # Main documentation
├── 📄 FIREBASE_SETUP.md            # Firebase setup guide
├── 📄 QUICKSTART.md                # Quick start guide
└── 📄 FOLDER_STRUCTURE.md          # This file
```

## 📝 File Descriptions

### Components Directory (`components/`)

**Purpose:** Contains all reusable UI components

| File | Purpose | Key Features |
|------|---------|--------------|
| `AddWordForm.js` | Add new vocabulary | Form validation, gender selection, tags |
| `WordList.js` | Display words | Search, filter, delete, pronunciation |
| `Flashcards.js` | Study mode | Flip animation, navigation, shuffle |
| `QuizMode.js` | Test knowledge | Multiple choice, scoring, results |
| `ProgressTracker.js` | View statistics | Charts, export data, levels |
| `Navbar.js` | Navigation | Routing, theme toggle, responsive |

### Context Directory (`context/`)

**Purpose:** Global state management

| File | Purpose |
|------|---------|
| `ThemeContext.js` | Manages dark/light mode across the entire app |

### Library Directory (`lib/`)

**Purpose:** Utility functions and external service integrations

| File | Purpose | Main Functions |
|------|---------|----------------|
| `firebase.js` | Firebase setup | Initialize Firebase, export db and auth |
| `firestoreService.js` | Database operations | addWord, getWords, deleteWord, updateWord |
| `speechService.js` | Text-to-speech | speakGerman, stopSpeaking |
| `exportService.js` | Data export | exportToCSV, exportToJSON |

### Pages Directory (`pages/`)

**Purpose:** Next.js routing (file-based routing)

| File | Route | Purpose |
|------|-------|---------|
| `_app.js` | All pages | Wraps entire app with providers |
| `_document.js` | All pages | HTML document structure |
| `index.js` | `/` | Home page with word list |
| `flashcards.js` | `/flashcards` | Flashcard study mode |
| `quiz.js` | `/quiz` | Quiz test mode |
| `progress.js` | `/progress` | Progress and statistics |

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Lists all dependencies and npm scripts |
| `next.config.js` | Next.js framework settings |
| `tailwind.config.js` | Tailwind CSS theme customization |
| `postcss.config.js` | CSS processing configuration |
| `.gitignore` | Tells Git which files to ignore |
| `.env.local.example` | Template for environment variables |

## 🎨 Component Relationships

```
_app.js
  └── ThemeProvider (context/ThemeContext.js)
      └── Navbar (components/Navbar.js)
          │
          ├── index.js (/)
          │   ├── AddWordForm
          │   └── WordList
          │
          ├── flashcards.js (/flashcards)
          │   └── Flashcards
          │
          ├── quiz.js (/quiz)
          │   └── QuizMode
          │
          └── progress.js (/progress)
              └── ProgressTracker
```

## 🔄 Data Flow

```
User Action
    ↓
Component (e.g., AddWordForm)
    ↓
Service (e.g., firestoreService.addWord)
    ↓
Firebase Firestore
    ↓
Update Local State
    ↓
Re-render Components
```

## 📦 What You Need to Create

You only need to create ONE file manually:

✅ `.env.local` - Copy from `.env.local.example` and add your Firebase keys

Everything else is already created!

## 🚫 Don't Edit These

These are auto-generated and should NOT be edited:

- ❌ `node_modules/` - Package installations
- ❌ `.next/` - Build output
- ❌ `package-lock.json` - Dependency lock file

## 📁 Where to Add New Features

| Feature Type | Add to |
|--------------|--------|
| New page/route | `pages/` directory |
| Reusable component | `components/` directory |
| Utility function | `lib/` directory |
| Global state | `context/` directory |
| Styling | `styles/globals.css` or Tailwind classes |

## 🔍 Quick File Finder

**Want to change...**
- Navigation menu? → `components/Navbar.js`
- Word form? → `components/AddWordForm.js`
- Flashcard appearance? → `components/Flashcards.js`
- Quiz logic? → `components/QuizMode.js`
- Progress display? → `components/ProgressTracker.js`
- Dark mode? → `context/ThemeContext.js`
- Database operations? → `lib/firestoreService.js`
- Colors/theme? → `tailwind.config.js`
- Firebase config? → `.env.local`

## 📚 Import Paths

The project uses absolute imports with `@/` prefix:

```javascript
// ✅ Correct
import Navbar from '@/components/Navbar';
import { speakGerman } from '@/lib/speechService';
import { useTheme } from '@/context/ThemeContext';

// ❌ Avoid (relative paths)
import Navbar from '../components/Navbar';
import { speakGerman } from '../../lib/speechService';
```

The `@/` maps to the root directory of your project.

## 🎯 Key Takeaways

1. **Components** = UI pieces (buttons, forms, lists)
2. **Pages** = Routes in your app (/, /quiz, /flashcards)
3. **Lib** = Helper functions (database, export, speech)
4. **Context** = Shared state (theme, could add more)
5. **Styles** = Global CSS and Tailwind config

---

**Need to find something?** Use this guide as a reference!
