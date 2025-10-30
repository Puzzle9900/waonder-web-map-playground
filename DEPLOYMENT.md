# Deployment Guide

This guide provides step-by-step instructions for deploying the H3 Map Visualization application.

## Prerequisites

- [x] Application builds successfully (`npm run build` completes without errors)
- [x] All tests pass
- [x] Code is committed to git
- [x] Git tag `v1.0.0` created
- [ ] GitHub account (for repository hosting)
- [ ] Vercel account (for deployment) - Optional but recommended

## Current Status

✅ **Application Status**: Production-ready
✅ **Build Status**: Passing
✅ **Git Status**: Clean, tagged as v1.0.0
❌ **Remote Repository**: Not configured
❌ **Deployment**: Not deployed

## Step 1: Push to GitHub

### Option A: Using GitHub CLI (Fastest)

```bash
# 1. Install GitHub CLI (if not already installed)
brew install gh   # macOS
# or: sudo apt install gh   # Linux
# or: Download from https://cli.github.com/

# 2. Authenticate with GitHub
gh auth login
# Follow the prompts to authenticate via browser

# 3. Create repository and push
gh repo create waonder-web-map-playground \
  --public \
  --source=. \
  --remote=origin \
  --push

# 4. Push tags
git push origin --tags

# Verification
gh repo view --web  # Opens repository in browser
```

### Option B: Using GitHub Web Interface

```bash
# 1. Create a new repository on GitHub
# - Go to https://github.com/new
# - Repository name: waonder-web-map-playground
# - Description: Interactive H3 Map Visualization
# - Visibility: Public
# - DO NOT initialize with README, .gitignore, or license (we already have these)
# - Click "Create repository"

# 2. Add the remote to your local repository
git remote add origin https://github.com/YOUR_USERNAME/waonder-web-map-playground.git

# 3. Verify remote is configured
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/waonder-web-map-playground.git (fetch)
# origin  https://github.com/YOUR_USERNAME/waonder-web-map-playground.git (push)

# 4. Push code and tags to GitHub
git push -u origin main
git push origin --tags

# Verification
# Visit: https://github.com/YOUR_USERNAME/waonder-web-map-playground
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended for First Deploy)

```bash
# 1. Install Vercel CLI globally
npm install -g vercel

# 2. Login to Vercel
vercel login
# Choose your preferred login method (GitHub, GitLab, Bitbucket, or Email)

# 3. Deploy to production
vercel --prod

# Follow the interactive prompts:
# ? Set up and deploy "~/path/to/waonder-web-map-playground"? [Y/n] Y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] N
# ? What's your project's name? waonder-web-map-playground
# ? In which directory is your code located? ./

# Vercel will:
# - Auto-detect Next.js
# - Configure build settings
# - Build and deploy your app
# - Provide a production URL

# 4. Save the deployment URL
# Example: https://waonder-web-map-playground.vercel.app
```

### Option B: Using Vercel Dashboard (Easiest)

```bash
# 1. Go to Vercel Dashboard
# Visit: https://vercel.com/new

# 2. Import Git Repository
# - Click "Import Git Repository"
# - Select your GitHub account
# - Choose: waonder-web-map-playground
# - Click "Import"

# 3. Configure Project (Auto-detected by Vercel)
# Framework Preset: Next.js
# Root Directory: ./
# Build Command: npm run build
# Output Directory: .next
# Install Command: npm install
# Development Command: npm run dev

# ✅ All settings should be auto-detected correctly
# No need to change anything!

# 4. Deploy
# - Click "Deploy"
# - Wait for build to complete (1-2 minutes)
# - Get your production URL

# 5. Production URL
# Format: https://waonder-web-map-playground.vercel.app
# or custom domain if configured
```

### Option C: Using Vercel GitHub Integration (Best for Continuous Deployment)

```bash
# 1. Go to Vercel Dashboard
# Visit: https://vercel.com/dashboard

# 2. Click "Add New" → "Project"

# 3. Import from GitHub
# - Click "Import Git Repository"
# - Authorize Vercel to access your GitHub account (if not already done)
# - Select: waonder-web-map-playground repository

# 4. Configure Project
# All settings auto-detected - just click "Deploy"

# 5. Enable Auto-Deploy
# ✅ Enabled by default!
# Every push to main branch will auto-deploy

# Benefits:
# - Automatic deployments on git push
# - Preview deployments for pull requests
# - Rollback capabilities
# - Built-in CI/CD
```

## Step 3: Verify Deployment

### Post-Deployment Checklist

```bash
# 1. Check deployment status
vercel ls
# Should show your deployment as "Ready"

# 2. Open production URL in browser
# Visit: https://your-project-name.vercel.app

# 3. Test Core Functionality
- [ ] Map loads and displays OpenStreetMap tiles
- [ ] Can pan the map (click and drag)
- [ ] Can zoom the map (scroll wheel, +/- buttons)
- [ ] Zoom level displays in top-left corner
- [ ] Moving cursor over map shows blue hexagon
- [ ] Cell info displays in top-right (resolution + H3 index)
- [ ] Copy button works (copies H3 index to clipboard)
- [ ] No console errors (F12 → Console tab)

# 4. Test on Mobile
- [ ] Visit URL on mobile device
- [ ] Touch and drag works for panning
- [ ] Pinch-to-zoom works
- [ ] Touch on map shows hexagon (persists 2 seconds)
- [ ] UI elements visible and readable
- [ ] Copy button works on mobile

# 5. Test Performance
- [ ] Initial load time < 3 seconds
- [ ] Smooth cursor tracking (no lag)
- [ ] Hexagon updates quickly
- [ ] No frame drops when zooming/panning

# 6. Run Lighthouse Audit
# Chrome DevTools → Lighthouse → Generate Report
# Target Scores:
# - Performance: > 90
# - Accessibility: > 90
# - Best Practices: > 90
# - SEO: > 90
```

## Step 4: Update Documentation

### Update README.md with Live Demo

```bash
# 1. Edit README.md
# Add at the top after title:

## 🌐 Live Demo

**[View Live Application](https://your-project-name.vercel.app)**

# 2. Commit and push
git add README.md
git commit -m "docs: Add live demo URL to README"
git push origin main

# Vercel will auto-deploy the update!
```

## Step 5: Monitor Deployment

### Vercel Dashboard Monitoring

```bash
# 1. Access Vercel Dashboard
# Visit: https://vercel.com/dashboard

# 2. Select Your Project
# Click on: waonder-web-map-playground

# 3. Monitor Key Metrics
# - Deployments: View all deployments and their status
# - Analytics: See visitor stats (if Analytics enabled)
# - Logs: Real-time deployment and runtime logs
# - Domains: Manage custom domains

# 4. Check Deployment Logs
# For each deployment:
# - Build logs
# - Runtime logs
# - Error reports

# 5. Set up Notifications (Optional)
# Vercel → Project Settings → Integrations
# - Slack notifications for deployments
# - Email alerts for errors
# - GitHub commit status checks
```

## Deployment Environments

Vercel provides three environments automatically:

### 1. Production
- **URL**: `https://your-project-name.vercel.app`
- **Triggered by**: Push to `main` branch
- **Purpose**: Live application for end users

### 2. Preview
- **URL**: `https://your-project-name-{hash}.vercel.app`
- **Triggered by**: Push to any non-main branch, Pull Requests
- **Purpose**: Test changes before merging to main

### 3. Development
- **URL**: `http://localhost:3000`
- **Run with**: `npm run dev`
- **Purpose**: Local development and testing

## Troubleshooting

### Build Failed on Vercel

**Error**: "Build failed with exit code 1"

**Solution**:
```bash
# 1. Test build locally first
npm run build

# 2. If local build works, check Vercel build logs
# Usually Node version mismatch or missing dependencies

# 3. Ensure package.json has correct engines
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  }
}

# 4. Redeploy
vercel --prod --force
```

### Deployment Successful but App Not Working

**Symptoms**: Blank page or errors in production

**Solution**:
```bash
# 1. Check browser console for errors
# F12 → Console tab

# 2. Check Vercel runtime logs
# Vercel Dashboard → Project → Logs

# 3. Common issues:
# - Missing environment variables (not needed for this app)
# - SSR errors with Leaflet (should be fixed with dynamic import)
# - API routes not working (not used in this app)

# 4. Verify build output
vercel logs
```

### Custom Domain Not Working

**Symptoms**: Custom domain shows DNS error

**Solution**:
```bash
# 1. Add domain in Vercel Dashboard
# Project Settings → Domains → Add

# 2. Update DNS records at your domain registrar
# Add provided CNAME or A record

# 3. Wait for DNS propagation (up to 48 hours, usually 5-10 minutes)

# 4. Verify domain
dig your-domain.com
```

## Custom Domain Setup (Optional)

```bash
# 1. Purchase domain (optional)
# Providers: Namecheap, GoDaddy, Google Domains, etc.

# 2. Add domain to Vercel
# Vercel Dashboard → Project → Settings → Domains
# Click "Add" and enter your domain

# 3. Configure DNS
# Vercel will provide DNS records to add at your domain registrar

# For root domain (example.com):
# Type: A
# Name: @
# Value: 76.76.21.21 (Vercel's IP)

# For www subdomain (www.example.com):
# Type: CNAME
# Name: www
# Value: cname.vercel-dns.com

# 4. Wait for verification
# Vercel will automatically verify once DNS propagates

# 5. Set primary domain
# Choose which domain is primary (with or without www)
```

## Rollback Deployment

```bash
# If you need to rollback to a previous version:

# 1. View deployment history
vercel ls

# 2. Find the deployment you want to rollback to
# Note the deployment URL

# 3. Promote previous deployment to production
# Vercel Dashboard → Deployments → [Select deployment] → Promote to Production

# Or via CLI:
vercel alias set [deployment-url] waonder-web-map-playground.vercel.app

# 4. Verify rollback
# Visit production URL and test
```

## Environment Variables (Not Needed for This App)

This application is client-side only and doesn't require environment variables. If you add backend features in the future:

```bash
# Add environment variables in Vercel:
# 1. Project Settings → Environment Variables
# 2. Add key-value pairs
# 3. Choose environments (Production, Preview, Development)
# 4. Redeploy for changes to take effect
```

## Continuous Deployment Workflow

With Vercel + GitHub integration enabled:

```bash
# Development workflow:
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: Add new feature"

# 3. Push to GitHub
git push origin feature/new-feature

# ✅ Vercel automatically creates preview deployment

# 4. Create Pull Request on GitHub
# ✅ Vercel adds deployment preview URL to PR

# 5. Review, test preview, and merge PR
# ✅ Vercel automatically deploys to production

# 6. Clean up
git checkout main
git pull origin main
git branch -d feature/new-feature
```

## Post-Deployment Tasks

- [ ] Add live demo URL to README.md
- [ ] Share deployment URL with stakeholders
- [ ] Monitor Vercel dashboard for first 24 hours
- [ ] Set up uptime monitoring (optional): [UptimeRobot](https://uptimerobot.com/), [Pingdom](https://www.pingdom.com/)
- [ ] Enable Vercel Analytics (optional): Project Settings → Analytics
- [ ] Set up error tracking (optional): [Sentry](https://sentry.io/), [LogRocket](https://logrocket.com/)
- [ ] Document production URL in implementation plan
- [ ] Create milestone release notes on GitHub

## Cost Considerations

### Vercel Pricing (as of 2025)

**Hobby Plan (Free)**:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth per month
- ✅ Serverless functions (not used in this app)
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Edge Network (CDN)
- ⚠️ Vercel branding on error pages

**Pro Plan ($20/month)**:
- Everything in Hobby +
- ✅ Custom domains without branding
- ✅ 1 TB bandwidth
- ✅ Priority support
- ✅ Team collaboration features

**For this app**: Hobby plan is sufficient for personal projects and demos.

## Next Steps After Deployment

1. **Monitor Usage**: Check Vercel Analytics to see user engagement
2. **Gather Feedback**: Share with users and collect feedback
3. **Plan v2 Features**: See `tech-specs/MASTER.md` for future enhancements
4. **Performance Optimization**: Use Lighthouse CI in your deployment pipeline
5. **Documentation**: Keep README and guides up to date

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **Next.js Deployment Guide**: https://nextjs.org/docs/deployment
- **Vercel Status**: https://www.vercel-status.com/

---

**Deployment Checklist Summary**:

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Production URL tested and working
- [ ] Documentation updated with live demo URL
- [ ] Monitoring set up
- [ ] Stakeholders notified

**Status**: Ready for deployment! 🚀

**Last Updated**: 2025-10-30
