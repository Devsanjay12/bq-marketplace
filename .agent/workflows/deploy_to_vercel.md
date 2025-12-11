---
description: How to deploy the BQ Marketplace to Vercel
---

# Deploying to Vercel

Follow these steps to deploy your Next.js application to Vercel.

## Prerequisites
1.  A [Vercel account](https://vercel.com/signup).
2.  A [GitHub account](https://github.com/).
3.  Your project pushed to a GitHub repository.

## Step 1: Push to GitHub
If you haven't already, push your code to a GitHub repository.
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Step 2: Import Project in Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub repository and click **"Import"**.

## Step 3: Configure Project
1.  **Framework Preset**: Ensure "Next.js" is selected.
2.  **Root Directory**: Leave as `./` (unless your app is in a subdirectory).
3.  **Build and Output Settings**:
    -   Build Command: `next build` (default)
    -   Output Directory: `.next` (default)
    -   Install Command: `npm install` (default)
4.  **Environment Variables**:
    Expand the "Environment Variables" section and add the following keys from your `.env` file. **IMPORTANT**: Use production values (e.g., your production database URL).

    | Key | Description |
    | :--- | :--- |
    | `DATABASE_URL` | Connection string for your production PostgreSQL database (e.g. Neon, Supabase) |
    | `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://your-app.vercel.app`) |
    | `NEXTAUTH_SECRET` | A long random string (generate with `openssl rand -base64 32`) |
    | `GITHUB_ID` | GitHub OAuth Client ID |
    | `GITHUB_SECRET` | GitHub OAuth Client Secret |
    | `GROQ_API_KEY` | Your Groq API Key |
    | `UPLOADTHING_SECRET` | UploadThing Secret |
    | `UPLOADTHING_APP_ID` | UploadThing App ID |
    | `RESEND_API_KEY` | Resend API Key (if using email) |
    | `EMAIL_FROM` | Email sender address |

## Step 4: Deploy
1.  Click **"Deploy"**.
2.  Vercel will build your application.
3.  Once complete, you will see a "Congratulations!" screen with your live URL.

## Troubleshooting
-   **Database Connection**: Ensure your database allows connections from Vercel (0.0.0.0/0 or Vercel IP ranges).
-   **Build Errors**: Check the build logs. Common issues include type errors or missing env vars.
-   **Prisma**: The `postinstall` script in `package.json` (`prisma generate`) should run automatically. If you see Prisma client errors, ensure this script ran.
