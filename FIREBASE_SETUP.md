# 🔥 Firebase Setup Guide

This guide will walk you through setting up Firebase for your German Learning App step-by-step.

## Step 1: Create a Firebase Account

1. Go to [https://firebase.google.com/](https://firebase.google.com/)
2. Click "Get Started" (top right)
3. Sign in with your Google account
4. Accept the terms and conditions

## Step 2: Create a New Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., `german-learning-app`)
4. Click **"Continue"**
5. **Disable Google Analytics** (optional, not needed for this project)
6. Click **"Create project"**
7. Wait for Firebase to set up your project (takes ~30 seconds)
8. Click **"Continue"** when ready

## Step 3: Set Up Firestore Database

### 3.1 Create Database

1. In the Firebase Console, find **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
   - This allows read/write access without authentication
   - ⚠️ For production, you'll want to set up proper security rules
4. Select a **Cloud Firestore location** (choose the one closest to you):
   - Examples: `us-central`, `europe-west`, `asia-southeast`
5. Click **"Enable"**
6. Wait for the database to be created

### 3.2 Verify Database

- You should now see an empty Firestore database
- It will show "No documents yet"
- Don't worry - the app will create documents automatically when you add words

## Step 4: Register Your Web App

### 4.1 Add Web App to Firebase Project

1. In Firebase Console, click the **gear icon ⚙️** next to "Project Overview" (top left)
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** `</>` (it looks like this: `</>`
)
5. Enter an app nickname: `German Learning Web App`
6. **Do NOT** check "Set up Firebase Hosting" (we'll use Vercel)
7. Click **"Register app"**

### 4.2 Copy Firebase Configuration

You'll see a code snippet that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "german-learning-app.firebaseapp.com",
  projectId: "german-learning-app",
  storageBucket: "german-learning-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abc123"
};
```

**COPY THESE VALUES!** You'll need them in the next step.

8. Click **"Continue to console"**

## Step 5: Configure Environment Variables

### 5.1 Create .env.local File

1. In your project folder, find the file named `.env.local.example`
2. Create a copy and rename it to `.env.local`

**On Windows PowerShell:**
```powershell
copy .env.local.example .env.local
```

**On Windows Command Prompt:**
```cmd
copy .env.local.example .env.local
```

### 5.2 Add Your Firebase Values

1. Open `.env.local` in your code editor
2. Replace the placeholder values with your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC_your_actual_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=1:your_app_id:web:your_app_code
```

### 5.3 Example

**Before (from Firebase config):**
```javascript
apiKey: "AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
authDomain: "german-learning-app-12345.firebaseapp.com"
projectId: "german-learning-app-12345"
```

**After (in .env.local):**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=german-learning-app-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=german-learning-app-12345
```

⚠️ **Important Notes:**
- Remove any quotes around the values
- Don't add spaces around the `=` sign
- Each value should be on its own line
- The file should NOT be committed to Git (it's in .gitignore)

## Step 6: Test the Connection

1. Save the `.env.local` file
2. Restart your development server:
   ```bash
   # Stop the server (Ctrl+C if running)
   # Then start it again
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)
4. Try adding a word
5. If successful, go to Firebase Console → Firestore Database
6. You should see a new collection called `words` with your data!

## Step 7: Configure Firestore Security Rules (Optional)

For now, test mode works fine. But for production, update your rules:

1. In Firebase Console → Firestore Database
2. Click the **"Rules"** tab
3. Replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /words/{wordId} {
      allow read, write: if true; // For personal use only
      // For authenticated users only, use:
      // allow read, write: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**

## 🎉 You're Done!

Your Firebase is now set up and connected to your app!

## 🔍 How to Find Your Firebase Config Again

If you ever need to find your Firebase configuration again:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → **Project settings**
4. Scroll down to **"Your apps"**
5. You'll see your web app listed
6. Click the **config** radio button to see your configuration

## 🆘 Troubleshooting

### "Firebase not defined" error
- Make sure `.env.local` exists and has correct values
- Restart the dev server after creating `.env.local`
- Check that all environment variables start with `NEXT_PUBLIC_`

### "Permission denied" error
- Check Firestore security rules
- Make sure you're in "test mode" or rules allow access
- Rules tab in Firestore should show `allow read, write: if true;`

### Words not appearing in Firebase
- Check browser console for errors (F12)
- Verify `.env.local` values are correct
- Make sure Firestore Database is created and enabled
- Try the localStorage fallback (should work even if Firebase fails)

### Can't find .env.local.example
- It should be in the root of your project folder
- If missing, create a new file named `.env.local` manually
- Copy the template from the README

## 📱 Firebase Free Tier Limits

The free tier (Spark Plan) includes:
- ✅ Firestore: 1 GB storage
- ✅ 50,000 reads/day
- ✅ 20,000 writes/day
- ✅ 20,000 deletes/day

**This is MORE than enough for personal use!** You can store thousands of words without any cost.

## 🚀 Next Steps

- Start adding words to your vocabulary
- The app will automatically sync with Firebase
- Your data will be available on any device
- Export backups regularly using the Export feature

---

**Need Help?** Check the main README.md or the Firebase documentation at [firebase.google.com/docs](https://firebase.google.com/docs)
