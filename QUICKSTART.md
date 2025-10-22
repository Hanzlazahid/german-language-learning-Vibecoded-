# ⚡ Quick Start Guide

Get your German Learning App running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- [ ] Node.js installed (version 18 or higher)
- [ ] A web browser (Chrome, Firefox, Edge, or Safari)
- [ ] A Google account (for Firebase)

**Check Node.js version:**
```bash
node --version
```
If you don't have Node.js, download it from [nodejs.org](https://nodejs.org/)

## 🚀 Installation Steps

### 1. Install Dependencies (2 minutes)

Open PowerShell or Command Prompt in your project folder and run:

```powershell
npm install
```

Wait for all packages to download and install.

### 2. Set Up Firebase (3 minutes)

Follow these quick steps:

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Create a new project** → Name it anything you like
3. **Create Firestore Database** → Choose "test mode"
4. **Add a Web App** → Give it a nickname
5. **Copy the config values** (apiKey, projectId, etc.)

### 3. Configure Environment Variables (1 minute)

Create `.env.local` file:

```powershell
copy .env.local.example .env.local
```

Open `.env.local` and paste your Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 4. Start the App! (10 seconds)

```powershell
npm run dev
```

Open your browser and go to:
**[http://localhost:3000](http://localhost:3000)**

🎉 **You're ready!**

## 📱 First Steps

### Add Your First Word

1. Click **"Add New Word"** button
2. Fill in:
   - German: `Hallo`
   - English: `Hello`
   - Type: `Word`
   - Tags: `greeting, A1`
3. Click **"Add Word"**
4. Click the 🔊 speaker icon to hear the pronunciation!

### Try Flashcards

1. Add a few more words (at least 3-4)
2. Click **"Flashcards"** in the navigation
3. Click the card to flip it
4. Use arrows to navigate

### Take a Quiz

1. Add at least 4 words
2. Click **"Quiz"** in the navigation
3. Answer the questions
4. See your score!

## 🎯 Pro Tips

- **Add gender for nouns** (Der/Die/Das) to see color coding
- **Use tags** to organize words by topic or level
- **Export regularly** to back up your data (Progress page)
- **Try dark mode** using the moon icon 🌙

## 🆘 Having Issues?

### App won't start?
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules, .next
npm install
npm run dev
```

### Words not saving?
- Check `.env.local` has correct Firebase values
- Words will still save to browser storage as backup
- Check browser console (F12) for errors

### Need detailed Firebase help?
Read the `FIREBASE_SETUP.md` file in your project folder.

## 📚 What's Next?

- Add more vocabulary words
- Practice with flashcards daily
- Test yourself with quizzes
- Track your progress
- Deploy to Vercel to access from anywhere

## 🚢 Deploy to Vercel (Optional)

Want to access your app from anywhere?

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add your Firebase environment variables
5. Deploy!

**Detailed deployment instructions in `README.md`**

---

## 🎓 Learning Path Suggestion

**Week 1:** Add 50 basic words (greetings, numbers, common nouns)
**Week 2:** Practice with flashcards daily
**Week 3:** Take quizzes to test retention
**Week 4:** Add sentences and phrases
**Month 2:** Reach 100+ words, export and review statistics

---

**Ready to learn German? Viel Erfolg! 🇩🇪**

Have questions? Check the detailed `README.md` or `FIREBASE_SETUP.md`
