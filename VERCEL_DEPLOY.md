# GRC Guardian - Vercel Deployment Guide

## 🚀 Quick Deploy Instructions

### Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Create Vercel account at https://vercel.com

---

## Backend Deployment (Vercel)

### Step 1: Update Backend for Vercel
Backend already has `vercel.json` configured.

### Step 2: Deploy Backend
```bash
cd backend
vercel
```

### Step 3: Set Environment Variables
In Vercel dashboard, add these variables:
```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### Step 4: Get Backend URL
After deployment, copy your backend URL (e.g., `https://grc-guardian-backend.vercel.app`)

---

## Frontend Deployment (Vercel)

### Step 1: Update Environment Variables
Edit `frontend/.env`:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

### Step 2: Deploy Frontend
```bash
cd frontend
vercel
```

### Step 3: Set Environment Variable in Vercel
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

---

## 🔧 Important Configuration

### CORS (Already Fixed)
✅ Backend mein CORS already configured for all origins:
```javascript
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));
```

### MongoDB Atlas Setup
1. Create cluster at https://cloud.mongodb.com
2. Create database user
3. Get connection string
4. Whitelist all IPs (0.0.0.0/0) for Vercel

---

## 📋 Deployment Checklist

- [ ] MongoDB Atlas database ready
- [ ] Backend deployed to Vercel
- [ ] Backend environment variables set
- [ ] Frontend API URL updated
- [ ] Frontend deployed to Vercel
- [ ] Test API calls from frontend
- [ ] Test login/register functionality

---

## 🆘 Troubleshooting

### CORS Errors
- Backend CORS already configured hai
- Check backend URL correct hai
- Verify environment variables

### MongoDB Connection Issues
- Check MONGODB_URI correct hai
- IP whitelist mein 0.0.0.0/0 add karo
- Database user credentials check karo

### Build Failures
- Check Node.js version (18+ required)
- Run `npm install` before deploy
- Check Vercel build logs

---

## 📞 Vercel CLI Commands

```bash
# Login
vercel login

# Deploy
vercel

# Deploy with custom name
vercel --name "grc-guardian-backend"

# Production deploy
vercel --prod

# View logs
vercel logs

# Add environment variable
vercel env add MONGODB_URI

# List projects
vercel projects
```

---

## 🌐 Alternative: Git Integration

### GitHub + Vercel (Recommended)
1. Push code to GitHub
2. Connect Vercel to GitHub repo
3. Auto-deploy on every push

---

**Ready to deploy!** 🎉
