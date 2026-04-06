#!/bin/bash
# Railway deployment script for frontend

echo "🚀 Starting Railway deployment for EzRiskManagement Frontend..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
railway login

echo "📦 Deploying Frontend..."
cd frontend

# Link to project or create new one
railway link || railway init

# Set environment variables
echo "⚙️  Setting environment variables..."
railway variables set NODE_ENV=production

# Update VITE_API_URL with backend URL
echo "⚠️  Make sure to update VITE_API_URL in Railway with your backend URL"

echo "🚀 Deploying..."
railway up

echo "✅ Frontend deployment complete!"
echo "📝 Get your frontend URL from Railway dashboard"
