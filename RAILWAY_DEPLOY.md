# EzRiskManagement - Railway Deployment Guide

## 🚀 Quick Deploy Instructions

### Prerequisites
1. Install Railway CLI: `npm install -g @railway.cli`
2. Login to Railway: `railway login`
3. Create Railway account at https://railway.app

### Backend Deployment

#### Step 1: Deploy Backend
```bash
cd backend
railway init
railway up
```

#### Step 2: Set Environment Variables in Railway Dashboard
Go to your backend project Variables tab and add:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
PORT=5000
```

#### Step 3: Get Backend URL
After deployment, copy your backend URL from Railway dashboard (e.g., `https://grc-guardian-backend.up.railway.app`)

### Frontend Deployment

#### Step 1: Update API URL
Edit `frontend/.env` file:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

#### Step 2: Deploy Frontend
```bash
cd frontend
railway init
railway up
```

#### Step 3: Set Environment Variable
In Railway dashboard, set:
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

## 🔧 Important Notes

### CORS Configuration
✅ Backend mein CORS already allow all origins ke liye configure ho gaya hai:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```

### MongoDB Atlas Setup
1. Create cluster at https://cloud.mongodb.com
2. Create database user
3. Get connection string
4. Whitelist all IPs (0.0.0.0/0) for Railway

### Scripts
- `deploy-backend.sh` - Backend auto-deploy script
- `deploy-frontend.sh` - Frontend auto-deploy script

## 📋 Deployment Checklist

- [ ] MongoDB Atlas database ready
- [ ] Backend deployed to Railway
- [ ] Backend environment variables set
- [ ] Frontend API URL updated
- [ ] Frontend deployed to Railway
- [ ] Test API calls from frontend
- [ ] Test login/register functionality

## 🆘 Troubleshooting

### CORS Errors
Backend CORS already configured hai. Agar error aaye toh:
1. Check backend deployed successfully
2. Verify environment variables
3. Check Railway logs: `railway logs`

### MongoDB Connection Issues
1. Check MONGODB_URI correct hai
2. IP whitelist mein 0.0.0.0/0 add karo
3. Database user credentials check karo

### Build Failures
1. Check Node.js version (18+ required)
2. Run `npm install` before deploy
3. Check Railway build logs

## 📞 Railway CLI Commands

```bash
# Login
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs

# View variables
railway variables

# Set variable
railway variables set KEY=value
```

---
**Ready to deploy!** 🎉
