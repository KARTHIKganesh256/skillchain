# 🚀 SkillChain Deployment Guide

## Quick Deployment Options

### Option 1: GitHub Pages (Frontend) + Railway (Backend & AI API)

#### 1. Frontend - GitHub Pages
```bash
# 1. Push your code to GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Enable GitHub Pages in your repository settings
# Go to Settings > Pages > Source: GitHub Actions
```

#### 2. Backend - Railway
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Deploy backend
cd backend
railway init
railway up

# 4. Set environment variables in Railway dashboard
# Copy from backend/env.production.txt
```

#### 3. AI API - Railway
```bash
# 1. Deploy AI API
cd ai-api
railway init
railway up

# 2. Set environment variables in Railway dashboard
# Copy from ai-api/env.production.txt
```

### Option 2: Vercel (All Services)

#### 1. Frontend - Vercel
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy frontend
cd frontend
vercel

# 3. Set environment variables in Vercel dashboard
```

#### 2. Backend - Vercel
```bash
# 1. Deploy backend
cd backend
vercel

# 2. Set environment variables in Vercel dashboard
```

#### 3. AI API - Vercel
```bash
# 1. Deploy AI API
cd ai-api
vercel

# 2. Set environment variables in Vercel dashboard
```

### Option 3: Render (All Services)

#### 1. Frontend - Render
- Connect your GitHub repository
- Build Command: `cd frontend && npm install && npm run build`
- Publish Directory: `frontend/build`

#### 2. Backend - Render
- Connect your GitHub repository
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && npm start`

#### 3. AI API - Render
- Connect your GitHub repository
- Build Command: `cd ai-api && pip install -r requirements-simple.txt`
- Start Command: `cd ai-api && python -m uvicorn main-simple:app --host 0.0.0.0 --port $PORT`

## Environment Variables Setup

### Frontend (.env.production)
```
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_AI_API_URL=https://your-ai-api-url.railway.app
```

### Backend (Railway/Render Dashboard)
```
NODE_ENV=production
PORT=5000
DATABASE_URL=your_production_database_url
JWT_SECRET=your_super_strong_jwt_secret_here
OPENAI_API_KEY=your_openai_api_key
CORS_ORIGIN=https://yourusername.github.io
```

### AI API (Railway/Render Dashboard)
```
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
BACKEND_URL=https://your-backend-url.railway.app
FRONTEND_URL=https://yourusername.github.io/skillchain
```

## Quick Start Commands

### For Railway:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
cd backend && railway up
cd ../ai-api && railway up
```

### For Vercel:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy all services
cd frontend && vercel
cd ../backend && vercel
cd ../ai-api && vercel
```

## Testing Your Deployment

1. **Frontend**: https://yourusername.github.io/skillchain
2. **Backend**: https://your-backend-url.railway.app/api/test
3. **AI API**: https://your-ai-api-url.railway.app/health

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Update CORS_ORIGIN in backend environment
2. **API Connection**: Check REACT_APP_API_URL in frontend
3. **Database**: Ensure production database is accessible
4. **Environment Variables**: Double-check all variables are set correctly

### Support:
- Railway: https://railway.app/docs
- Vercel: https://vercel.com/docs
- GitHub Pages: https://pages.github.com
