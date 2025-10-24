# 🚀 Quick Deploy Guide - SkillChain

## ✅ **What's Already Done:**
- ✅ Code pushed to GitHub: https://github.com/KARTHIKganesh256/skillchain
- ✅ Frontend ready for GitHub Pages
- ✅ Security issues fixed
- ✅ All deployment files created

## 🎯 **Deploy Now - Choose Your Method:**

### **Method 1: Railway (Recommended) - 5 minutes**

#### **Step 1: Deploy Backend**
```bash
# Run this command:
.\deploy-backend-railway.bat
```

#### **Step 2: Deploy AI API**
```bash
# Run this command:
.\deploy-ai-railway.bat
```

#### **Step 3: Enable GitHub Pages**
1. Go to: https://github.com/KARTHIKganesh256/skillchain/settings/pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Save

### **Method 2: Vercel (All-in-One) - 3 minutes**

1. Go to: https://vercel.com
2. Sign up with GitHub
3. Import repository: `KARTHIKganesh256/skillchain`
4. Deploy all services automatically

### **Method 3: Render (Free) - 5 minutes**

1. Go to: https://render.com
2. Sign up with GitHub
3. Create 3 services:
   - **Frontend**: Static Site (from `frontend/` folder)
   - **Backend**: Web Service (from `backend/` folder)
   - **AI API**: Web Service (from `ai-api/` folder)

## 🌐 **Your App URLs:**
- **Frontend**: https://karthikganesh256.github.io/skillchain
- **Backend**: [Your deployment URL]
- **AI API**: [Your deployment URL]

## 🔧 **Environment Variables to Set:**

### **Frontend (.env.production)**
```
REACT_APP_API_URL=https://your-backend-url.railway.app
REACT_APP_AI_API_URL=https://your-ai-api-url.railway.app
```

### **Backend (Railway Dashboard)**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_super_strong_jwt_secret_here
DATABASE_URL=your_production_database_url
```

### **AI API (Railway Dashboard)**
```
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
BACKEND_URL=https://your-backend-url.railway.app
```

## 🚀 **Quick Start Commands:**

```bash
# Deploy everything with Railway
.\deploy-all.bat

# Or deploy individually
.\deploy-backend-railway.bat
.\deploy-ai-railway.bat
```

## 📱 **Test Your Deployment:**
1. Frontend: https://karthikganesh256.github.io/skillchain
2. Backend: https://your-backend-url.railway.app/api/test
3. AI API: https://your-ai-api-url.railway.app/health

## 🆘 **Need Help?**
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
