#!/bin/bash

echo "🚀 Torrey Pines Automator - Auto Deployment"
echo "==========================================="

# Open GitHub repository creation page
echo "📝 Opening GitHub repository creation page..."
open "https://github.com/new?name=torrey-pines-automator&description=Torrey%20Pines%20Golf%20Waitlist%20Automator%20-%20Automated%20waitlist%20submission%20with%20precise%20timing&public=true"

echo ""
echo "✅ GitHub page opened! Please:"
echo "1. Sign in to GitHub if needed"
echo "2. Click 'Create repository' (don't change any settings)"
echo "3. Copy the repository URL (it will look like: https://github.com/YOUR_USERNAME/torrey-pines-automator.git)"
echo "4. Come back here and press Enter"
echo ""
read -p "Press Enter after creating the repository..."

echo ""
echo "📋 Please paste the repository URL here:"
read -p "Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "🔄 Adding remote and pushing code..."

# Add remote
git remote add origin "$REPO_URL"

# Push code
echo "Pushing to GitHub..."
git push -u origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Code pushed to GitHub successfully!"
    echo ""
    echo "🚀 Now deploying to Railway..."
    echo "Opening Railway deployment page..."
    open "https://railway.app/new"
    
    echo ""
    echo "📋 Railway deployment steps:"
    echo "1. Sign in to Railway with GitHub"
    echo "2. Click 'Deploy from GitHub repo'"
    echo "3. Select 'torrey-pines-automator'"
    echo "4. Click 'Deploy'"
    echo "5. Wait for deployment to complete"
    echo "6. Copy your live URL from Railway dashboard"
    echo ""
    echo "🎉 Your app will be live in the cloud!"
    
else
    echo "❌ Error pushing to GitHub. Please check the repository URL and try again."
fi
