# 🚀 GitHub Pages Deployment Guide

## Quick Deployment

### Option 1: Automated Deployment (Recommended)
1. **Push to GitHub**: Simply push your changes to the `main` branch
2. **GitHub Actions**: The workflow will automatically build and deploy your app
3. **Access**: Your app will be live at `https://karthikganesh256.github.io/skillchain`

### Option 2: Manual Deployment
1. **Run the deployment script**:
   ```bash
   deploy-github-pages.bat
   ```
2. **Configure GitHub Pages**:
   - Go to: https://github.com/KARTHIKganesh256/skillchain/settings/pages
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/docs`
   - Click "Save"

## 🔧 Configuration

### Frontend Configuration
- **Homepage**: Set to `https://karthikganesh256.github.io/skillchain`
- **Build Output**: Automatically configured for GitHub Pages
- **Routing**: Uses React Router with proper GitHub Pages support

### Environment Variables
Make sure to set up your environment variables in GitHub:
1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL`

## 📁 File Structure
```
skillchain/
├── .github/workflows/deploy.yml    # GitHub Actions workflow
├── docs/                          # GitHub Pages build output
├── frontend/                      # React app source
├── deploy-github-pages.bat        # Manual deployment script
└── GITHUB_PAGES_DEPLOYMENT.md     # This guide
```

## 🌐 Live URLs
- **Main App**: https://karthikganesh256.github.io/skillchain
- **GitHub Repository**: https://github.com/KARTHIKganesh256/skillchain
- **Actions**: https://github.com/KARTHIKganesh256/skillchain/actions

## 🛠️ Troubleshooting

### Common Issues
1. **404 Error**: Make sure GitHub Pages is configured to use `/docs` folder
2. **Build Fails**: Check that all dependencies are installed
3. **Routing Issues**: Ensure `homepage` is set correctly in package.json

### Manual Build
```bash
cd frontend
npm install
npm run build
```

### Check Deployment Status
- GitHub Actions: https://github.com/KARTHIKganesh256/skillchain/actions
- GitHub Pages Settings: https://github.com/KARTHIKganesh256/skillchain/settings/pages

## 🎯 Features Deployed
- ✅ React Frontend
- ✅ Responsive Design
- ✅ Modern UI Components
- ✅ SkillChain Core Features
- ✅ GitHub Pages Optimization

## 📱 Mobile Support
The deployed app is fully responsive and works on:
- Desktop browsers
- Mobile devices
- Tablets
- PWA (Progressive Web App) features

---

**Ready to deploy?** Run `deploy-github-pages.bat` or push to main branch! 🚀
