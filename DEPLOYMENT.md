# 🚀 Torrey Pines Automator - Complete Deployment Guide

## 🎯 What You're Deploying
A fully automated waitlist submission system for Torrey Pines Golf Course that:
- Runs 24/7 in the cloud
- Submits to WaitWhile automatically
- Handles precise timing (10-second intervals)
- Prevents multiple instances
- Spoofs geolocation to Torrey Pines
- Works from any device

## 📁 Project Structure
```
torrey-pines-webapp/
├── server.js              # Main server with Puppeteer automation
├── package.json           # Dependencies and scripts
├── railway.json           # Railway deployment config
├── nixpacks.toml          # Railway build config
├── public/
│   └── index.html         # Web interface
├── .gitignore             # Git ignore rules
└── deploy.sh              # Deployment helper script
```

## 🚀 Quick Deployment (5 minutes)

### Step 1: Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `torrey-pines-automator`
3. Description: `Torrey Pines Golf Waitlist Automator`
4. Make it **Public**
5. **Don't** initialize with README
6. Click "Create repository"

### Step 2: Push Code to GitHub
```bash
# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/torrey-pines-automator.git

# Push your code
git push -u origin master
```

### Step 3: Deploy to Railway
1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `torrey-pines-automator`
6. Click "Deploy"

### Step 4: Get Your Live URL
1. In Railway dashboard, click your project
2. Go to "Settings" → "Domains"
3. Copy your live URL (e.g., `https://torrey-pines-automator-production.railway.app`)

## ✅ Verification
Your app should now be live! Test it by:
1. Opening the Railway URL
2. Filling out the form
3. Clicking "Book Now" for immediate test
4. Or "Schedule for Later" for timed test

## 🔧 Technical Details

### Cloud Optimizations
- **Headless browser**: No GUI needed in cloud
- **Optimized Puppeteer args**: Better cloud performance
- **Single-instance protection**: Prevents duplicate submissions
- **Precise timing**: 10-second cron intervals
- **Geolocation spoofing**: Automatically sets Torrey Pines coordinates

### Dependencies
- `express`: Web server
- `puppeteer`: Browser automation
- `cors`: Cross-origin requests
- `node-cron`: Scheduled tasks
- `body-parser`: Request parsing

### Environment
- **Node.js**: 18+ (Railway supports this)
- **Platform**: Railway cloud hosting
- **Browser**: Headless Chrome via Puppeteer

## 🎯 Usage
1. **Immediate**: Fill form → "Book Now" → Instant submission
2. **Scheduled**: Fill form → "Schedule for Later" → Set exact time → Automatic submission

## �� Security Features
- Single-instance protection prevents flooding
- Geolocation spoofing bypasses geofencing
- Form validation and error handling
- Cloud-based execution (no local dependencies)

## �� Mobile Access
Once deployed, access from any device:
- iPhone/Android browsers
- Laptop/desktop
- Anywhere with internet

## 🏌️‍♂️ Ready for Competition
Your app is now optimized for competitive waitlist timing:
- **Precise execution**: Runs at exact scheduled times
- **Fast automation**: Optimized for speed
- **Reliable hosting**: 24/7 cloud availability
- **No laptop required**: Completely cloud-based

## 🎉 Success!
Your Torrey Pines waitlist automator is now live in the cloud! 🚀
