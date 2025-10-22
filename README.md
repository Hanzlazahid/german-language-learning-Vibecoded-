# 🇩🇪 German Language Learning Web App

A personal German language learning web application that allows users to store, listen to, and practice German vocabulary and sentences interactively.

**Created by:** Hanzla Zahid

## ✨ Features

- 📘 **Vocabulary Management** - Add, view, search, and delete German words and sentences
- 💬 **Flashcard Mode** - Interactive flashcards for memorization with flip animation
- 🧠 **Quiz Mode** - Multiple-choice quiz with score tracking
- 📊 **Progress Tracker** - Track learning progress with detailed statistics
- 🔊 **Text-to-Speech** - German pronunciation using Web Speech API
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 💾 **Data Sync** - Syncs across devices via Firebase with localStorage fallback
- 📥 **Export/Backup** - Export vocabulary as CSV or JSON
- 🎨 **Gender Colors** - Visual indicators for noun genders (Der/Die/Das)

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Firebase Firestore
- **Icons:** Lucide React
- **Text-to-Speech:** Web Speech API (de-DE)
- **Hosting:** Vercel (ready to deploy)

## 📁 Project Structure

```
german-learning-web-app/
├── components/
│   ├── AddWordForm.js         # Form to add new words
│   ├── WordList.js            # Display vocabulary list
│   ├── Flashcards.js          # Flashcard component
│   ├── QuizMode.js            # Quiz component
│   ├── ProgressTracker.js     # Progress statistics
│   └── Navbar.js              # Navigation bar
├── context/
│   └── ThemeContext.js        # Dark mode context
├── lib/
│   ├── firebase.js            # Firebase configuration
│   ├── firestoreService.js    # Firestore CRUD operations
│   ├── speechService.js       # Text-to-speech functions
│   └── exportService.js       # CSV/JSON export functions
├── pages/
│   ├── _app.js                # App wrapper
│   ├── _document.js           # HTML document
│   ├── index.js               # Home page (Words)
│   ├── flashcards.js          # Flashcards page
│   ├── quiz.js                # Quiz page
│   └── progress.js            # Progress page
├── styles/
│   └── globals.css            # Global styles
├── .env.local.example         # Environment variables template
├── package.json               # Dependencies
├── tailwind.config.js         # Tailwind configuration
└── next.config.js             # Next.js configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase account (free tier is sufficient)
- A code editor (VS Code recommended)

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

### Step 2: Set Up Firebase

#### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `german-learning-app` (or any name you prefer)
4. Disable Google Analytics (optional for this project)
5. Click "Create project"

#### 2.2 Create Firestore Database

1. In Firebase Console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to you
5. Click "Enable"

#### 2.3 Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the Web icon `</>`
5. Register your app with a nickname (e.g., "German Learning Web App")
6. **Copy the firebaseConfig object** - you'll need these values!

#### 2.4 Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:

```bash
copy .env.local.example .env.local
```

2. Open `.env.local` and paste your Firebase configuration values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456:web:abc123
```

⚠️ **IMPORTANT:** Never commit `.env.local` to version control!

### Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage Guide

### Adding Words

1. Click "Add New Word" button
2. Fill in the form:
   - **German**: The German word/sentence (e.g., "Der Hund")
   - **English**: English translation (e.g., "The dog")
   - **Type**: Word, Sentence, or Phrase
   - **Gender**: Der (masculine), Die (feminine), Das (neuter)
   - **Tags**: Comma-separated tags (e.g., "noun, animal, A1")
3. Click "Add Word"

### Using Flashcards

1. Click "Flashcards" in the navigation
2. Click the card to flip between German and English
3. Use "Previous" and "Next" buttons to navigate
4. Click "Shuffle" to randomize the order
5. Click "Reset" to start from the beginning

### Taking a Quiz

1. Click "Quiz" in the navigation (requires at least 4 words)
2. Read the German word
3. Select the correct English translation from 4 options
4. View your score at the end
5. Click "Take Quiz Again" to retry

### Tracking Progress

1. Click "Progress" in the navigation
2. View statistics:
   - Total vocabulary count
   - Learning level (Beginner to Expert)
   - Word type distribution
   - Gender distribution for nouns
   - Most used tags
3. Export your data as CSV or JSON

## 🎨 UI/UX Features

- **Clean, Minimal Design** - Focus on learning
- **Gender Color Coding:**
  - 💙 Blue for Der (Masculine)
  - ❤️ Red for Die (Feminine)
  - 💚 Green for Das (Neuter)
- **Smooth Animations** - Powered by Framer Motion
- **Responsive Layout** - Works on all screen sizes
- **Dark Mode** - Eye-friendly for night studying

## 🔊 Pronunciation

Click the speaker icon 🔊 next to any German word to hear it pronounced using the Web Speech API. The app uses the German (de-DE) language setting for accurate pronunciation.

## 💾 Data Storage

- **Primary:** Firebase Firestore (cloud sync)
- **Fallback:** Browser localStorage (offline support)
- **Export:** Download as CSV or JSON for backup

## 🚢 Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables from `.env.local`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# (Repeat for all environment variables)

# Deploy to production
vercel --prod
```

### Important: Set Environment Variables in Vercel

Don't forget to add all your Firebase environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Settings → Environment Variables
3. Add each variable from your `.env.local`

## 📱 Browser Compatibility

- **Chrome/Edge:** ✅ Full support
- **Firefox:** ✅ Full support
- **Safari:** ✅ Full support (speech may vary)
- **Mobile Browsers:** ✅ Responsive design

## 🔒 Security

- Firebase API keys are stored in environment variables
- Firestore security rules should be configured for production
- Never commit `.env.local` to version control

### Recommended Firestore Security Rules

In Firebase Console → Firestore → Rules, update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /words/{word} {
      allow read, write: if true; // For personal use
      // For production with auth, use:
      // allow read, write: if request.auth != null;
    }
  }
}
```

## 🆘 Troubleshooting

### Words not saving?

- Check Firebase configuration in `.env.local`
- Verify Firestore database is created
- Check browser console for errors
- Words will save to localStorage as fallback

### Speech not working?

- Ensure you're using HTTPS (or localhost)
- Check browser permissions for audio
- Try a different browser (Chrome works best)

### Build errors?

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

## 📝 Future Enhancements (Optional)

- 🔁 Spaced Repetition Algorithm
- 🎤 Voice Input for pronunciation testing
- 📚 Grammar notes per word
- 👥 User authentication
- 📖 Sentence examples
- 🎓 Learning streaks and achievements

## 📄 License

This project is created for personal use by Hanzla Zahid.

## 🤝 Contributing

This is a personal project, but feel free to fork and customize for your own use!

## 📧 Contact

Created by **Hanzla Zahid**

---

**Happy Learning! Viel Erfolg! 🇩🇪**
