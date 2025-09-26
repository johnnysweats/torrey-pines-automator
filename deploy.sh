#!/bin/bash

echo "🚀 Torrey Pines Automator - Deployment Script"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Please run this from the project directory."
    exit 1
fi

echo "✅ Project files found"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Git not initialized. Please run 'git init' first."
    exit 1
fi

echo "✅ Git repository initialized"

# Check if we have commits
if [ -z "$(git log --oneline 2>/dev/null)" ]; then
    echo "❌ Error: No commits found. Please commit your changes first."
    exit 1
fi

echo "✅ Git commits found"

echo ""
echo "📋 Next Steps:"
echo "1. Go to https://github.com/new"
echo "2. Create repository: 'torrey-pines-automator'"
echo "3. Make it PUBLIC"
echo "4. Don't initialize with README"
echo "5. Copy the repository URL"
echo "6. Run: git remote add origin YOUR_REPO_URL"
echo "7. Run: git push -u origin master"
echo "8. Go to https://railway.app"
echo "9. Deploy from GitHub repository"
echo ""
echo "🎯 Your app is ready for cloud deployment!"
echo "   - Headless browser automation"
echo "   - Precise timing (10-second intervals)"
echo "   - Single-instance protection"
echo "   - Geolocation spoofing to Torrey Pines"
echo "   - 24/7 cloud hosting"
