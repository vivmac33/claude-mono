# Monomorph Vercel Deployment Guide

## Quick Deploy (5 minutes)

### Option A: Vercel Web Interface (Recommended)

1. **Push to GitHub** (if not already)
   ```bash
   cd monomorph
   git init
   git add .
   git commit -m "Initial commit - Monomorph v1.3.0"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/monomorph.git
   git push -u origin main
   ```

2. **Go to Vercel**
   - Visit https://vercel.com/new
   - Click "Import Git Repository"
   - Select your `monomorph` repo

3. **Configure Build Settings**
   Vercel should auto-detect from `vercel.json`, but verify:
   - Framework Preset: `Vite`
   - Build Command: `cd apps/web && npm install && npm run build`
   - Output Directory: `apps/web/dist`
   - Install Command: `npm install`

4. **Click Deploy**
   - Wait ~2 minutes for build
   - You'll get: `https://monomorph-XXXX.vercel.app`

---

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from project root
cd monomorph
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name: monomorph
# - Directory: ./
# - Override settings? No
```

---

## Your Deploy URL

After deployment, you'll get:
```
https://monomorph.vercel.app
```
or
```
https://monomorph-xyz123.vercel.app
```

---

## For Zerodha Kite Connect

Use this as your **Redirect URL**:
```
https://YOUR_VERCEL_URL/auth/zerodha/callback
```

Example:
```
https://monomorph.vercel.app/auth/zerodha/callback
```

---

## Environment Variables (Optional for now)

Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | (leave empty for now) | Will add after Railway deploy |

---

## Next Steps After Deploy

1. ✅ Copy your Vercel URL
2. ✅ Go back to Kite Connect form
3. ✅ Paste: `https://YOUR_URL/auth/zerodha/callback`
4. ⏳ Deploy backend to Railway (next task)
5. ⏳ Add VITE_API_URL env var pointing to Railway

---

## Troubleshooting

**Build fails?**
- Check Node version (needs 18+)
- Run `npm run build` locally first

**404 on pages?**
- vercel.json handles SPA routing
- Make sure it's in project root

**API calls fail?**
- Expected! Backend not deployed yet
- UI will work, data endpoints won't
