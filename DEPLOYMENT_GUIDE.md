# Harambee Deployment Guide

This guide will walk you through deploying the Harambee crowdfunding platform with:
- **Backend**: Render (Python/Flask + PostgreSQL)
- **Frontend**: Vercel (React/Vite)

---

## Part 1: Backend Deployment (Render)

### Step 1: Create a Render Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub account

### Step 2: Create a PostgreSQL Database
1. In Render dashboard, click "New" → "PostgreSQL"
2. Configure:
   - **Name**: `harambee-db`
   - **Database Name**: `harambee`
   - **User**: `harambee_user`
3. Click "Create Database"
4. Wait for it to provision, then copy the "Internal Database URL"

### Step 3: Create a Web Service for Backend
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `harambee-backend`
   - **Root Directory**: `harambee-backend`
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

### Step 4: Set Environment Variables
Add these environment variables in the Render dashboard:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | The PostgreSQL connection string from Step 2 |
| `SECRET_KEY` | Generate a secure random key (e.g., using `python -c "import secrets; print(secrets.token_hex(32))"`) |
| `CORS_ORIGINS` | Your Vercel URL (e.g., `https://your-app.vercel.app`) |
| `MPESA_CONSUMER_KEY` | Your M-Pesa consumer key (or leave default for sandbox) |
| `MPESA_CONSUMER_SECRET` | Your M-Pesa consumer secret (or leave default for sandbox) |
| `MPESA_SHORTCODE` | Your M-Pesa shortcode |
| `MPESA_PASSKEY` | Your M-Pesa passkey |
| `MPESA_ENV` | `sandbox` or `production` |

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for the build to complete
3. Once deployed, copy your backend URL (e.g., `https://harambee-backend.onrender.com`)

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Create a Vercel Account
1. Go to [vercel.com](https://vercel.com) and sign up
2. Import your GitHub repository

### Step 2: Configure the Project
1. In Vercel, select the repository
2. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `harambee-frontend`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables
Add these environment variables:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your Render backend URL + `/api` (e.g., `https://harambee-backend.onrender.com/api`) |

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

---

## Part 3: Verify the Deployment

### Test the Backend
```bash
curl https://your-backend.onrender.com/api/campaigns/
```

### Test the Frontend
Open your Vercel URL in a browser.

### Test Authentication
1. Go to your Vercel site
2. Try to sign up/login
3. Create a campaign
4. Make a donation

---

## Part 4: Database Migrations (First Time Only)

If this is a fresh database, you need to run migrations:

### Option A: Using Render's Shell
1. Go to your Render backend service
2. Click "Shell"
3. Run:
```bash
flask db upgrade
```

### Option B: Locally (then push to Render)
1. Update your local `.env` with the Render DATABASE_URL
2. Run:
```bash
cd harambee-backend
flask db upgrade
```

---

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure:
1. `CORS_ORIGINS` in Render includes your Vercel URL
2. The URL starts with `https://`

### Database Connection Errors
1. Verify DATABASE_URL is correct
2. Check that PostgreSQL is fully provisioned (green status)

### 500 Errors
1. Check Render logs for error details
2. Verify all required environment variables are set

---

## Updating the App

### Backend Updates
1. Push changes to GitHub
2. Render will automatically redeploy

### Frontend Updates
1. Push changes to GitHub
2. Vercel will automatically redeploy

---

## Notes

- The app uses M-Pesa in sandbox mode by default. For production payments, set `MPESA_ENV=production` and update your M-Pesa credentials.
- The database uses SQLite locally and PostgreSQL in production.
- Image uploads are stored locally. For production, consider using cloud storage (AWS S3, Cloudinary, etc.).
