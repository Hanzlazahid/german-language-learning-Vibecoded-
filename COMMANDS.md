# 💻 Command Reference

Quick reference for all commands you'll need to run this project.

## 🚀 Initial Setup

### 1. Install Dependencies
```powershell
npm install
```
**When to use:** First time setting up the project, or after pulling new code

**What it does:** Downloads all required packages from npm

---

### 2. Create Environment File
```powershell
copy .env.local.example .env.local
```
**When to use:** After cloning the project, before first run

**What it does:** Creates your local environment configuration file

---

## 🏃 Running the App

### Start Development Server
```powershell
npm run dev
```
**When to use:** Every time you want to work on the project

**What it does:**
- Starts the app at http://localhost:3000
- Enables hot reloading (changes appear instantly)
- Shows errors in the terminal

**To stop:** Press `Ctrl + C` in the terminal

---

### Build for Production
```powershell
npm run build
```
**When to use:** Before deploying to production

**What it does:**
- Creates an optimized production build
- Checks for errors
- Generates static files in `.next/` folder

---

### Start Production Server
```powershell
npm run start
```
**When to use:** After building, to test the production version locally

**What it does:** Runs the optimized production build

---

## 🧹 Maintenance Commands

### Clear Cache and Reinstall
```powershell
# Remove node_modules and .next
Remove-Item -Recurse -Force node_modules, .next

# Reinstall everything
npm install
```
**When to use:**
- Something is broken and you don't know why
- After major package updates
- "Turn it off and on again" for Node projects

---

### Update All Packages
```powershell
npm update
```
**When to use:** To get the latest compatible versions of packages

**Careful!** May break things. Test after updating.

---

## 🔍 Debugging Commands

### Check Node.js Version
```powershell
node --version
```
**Should show:** v18.0.0 or higher

---

### Check npm Version
```powershell
npm --version
```
**Should show:** 9.0.0 or higher

---

### List Installed Packages
```powershell
npm list --depth=0
```
**When to use:** To see what packages are installed

---

### Check for Outdated Packages
```powershell
npm outdated
```
**When to use:** To see which packages have newer versions available

---

## 📦 Package Management

### Install a New Package
```powershell
npm install package-name
```
**Example:**
```powershell
npm install axios
```

---

### Install a Dev Dependency
```powershell
npm install --save-dev package-name
```
**Example:**
```powershell
npm install --save-dev eslint
```

---

### Remove a Package
```powershell
npm uninstall package-name
```

---

## 🚢 Deployment Commands

### Deploy to Vercel (using Vercel CLI)

#### Install Vercel CLI
```powershell
npm install -g vercel
```

#### Login to Vercel
```powershell
vercel login
```

#### Deploy
```powershell
vercel
```

#### Deploy to Production
```powershell
vercel --prod
```

---

## 🔥 Firebase Commands

### Login to Firebase
```powershell
npm install -g firebase-tools
firebase login
```

### Initialize Firebase (if needed)
```powershell
firebase init
```

### Deploy Firebase Functions (if you add them later)
```powershell
firebase deploy --only functions
```

---

## 📊 Git Commands (if using version control)

### Initialize Git
```powershell
git init
```

### Add All Files
```powershell
git add .
```

### Commit Changes
```powershell
git commit -m "Initial commit"
```

### Push to GitHub
```powershell
git remote add origin https://github.com/yourusername/german-learning-app.git
git branch -M main
git push -u origin main
```

---

## 🆘 Troubleshooting Commands

### Problem: Port 3000 is already in use

**Find process using port 3000:**
```powershell
netstat -ano | findstr :3000
```

**Kill the process:**
```powershell
taskkill /PID [process_id] /F
```

---

### Problem: Permission Denied

**Run PowerShell as Administrator:**
1. Right-click PowerShell
2. Select "Run as Administrator"

---

### Problem: Can't run npm commands

**Fix npm permission (Windows):**
```powershell
npm config set cache C:\Users\[YourUsername]\AppData\Roaming\npm-cache --global
```

---

## 📝 Package.json Scripts Explained

The `package.json` file contains these scripts:

```json
{
  "scripts": {
    "dev": "next dev",          // Start development server
    "build": "next build",      // Build for production
    "start": "next start",      // Start production server
    "lint": "next lint"         // Check code quality
  }
}
```

You run them with: `npm run [script-name]`

---

## 🔄 Common Workflows

### Starting Your Day
```powershell
# Navigate to project
cd "C:\Users\Bismillah Traders\OneDrive\Desktop\german learning web app"

# Start the app
npm run dev
```

---

### After Making Changes
- Save your files
- Check the browser (http://localhost:3000)
- Changes appear automatically (hot reload)

---

### Before Deploying
```powershell
# Test the build
npm run build

# If successful, deploy
vercel --prod
```

---

### When Something Breaks
```powershell
# 1. Stop the server (Ctrl+C)
# 2. Clear cache
Remove-Item -Recurse -Force node_modules, .next
# 3. Reinstall
npm install
# 4. Restart
npm run dev
```

---

## 💡 Pro Tips

1. **Keep Terminal Open:** Run commands in the same terminal window where the dev server is running
2. **Use Tab Completion:** Type `npm run d` and press Tab to autocomplete
3. **Check Package.json:** All available scripts are listed in `package.json`
4. **Read Error Messages:** They usually tell you exactly what's wrong

---

## 🎯 Most Used Commands (Daily)

```powershell
npm run dev          # Start the app (90% of the time)
Ctrl + C             # Stop the server
npm install          # Install new packages
npm run build        # Build before deploying
```

---

**Need help?** Check the error message in the terminal or browser console (F12)
