#!/bin/bash
# Railway deployment script for backend

echo "🚀 Starting Railway deployment for GRC Guardian Backend..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
railway login

# Create project if not exists
railway projects

echo "📦 Deploying Backend..."
cd backend

# Link to project or create new one
railway link || railway init

# Set environment variables
echo "⚙️  Setting environment variables..."
railway variables set NODE_ENV=production
railway variables set PORT=5000

echo "🚀 Deploying..."
railway up

echo "✅ Backend deployment complete!"
echo "📝 Get your backend URL from Railway dashboard"
