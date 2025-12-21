# Configure CORS for Firebase Storage Downloads

## ✅ QUICK FIX (No CORS Needed!)

**We've added a Next.js API route that bypasses CORS entirely!** The downloads should work now without any CORS configuration. If you still want to configure CORS for direct downloads, follow the steps below.

## The Problem

Files are opening in the browser instead of downloading because Firebase Storage needs CORS headers configured to allow cross-origin requests.

## Solution: Configure CORS using Firebase CLI

### Step 1: Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase

```bash
firebase login
```

### Step 3: Create CORS Configuration File

Create a file named `cors.json` in your project root with this content:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Content-Disposition"]
  }
]
```

**Note:** For production, replace `"*"` with your actual domain(s):

```json
[
  {
    "origin": ["https://yourdomain.com", "https://www.yourdomain.com"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Content-Disposition"]
  }
]
```

### Step 4: Apply CORS Configuration

Run this command (replace `graddrive-e3695` with your bucket name if different):

```bash
gsutil cors set cors.json gs://graddrive-e3695.firebasestorage.app
```

**Alternative:** If you don't have `gsutil` installed, you can use Firebase CLI:

```bash
firebase storage:rules:deploy
```

But CORS needs to be set via `gsutil` or Google Cloud Console.

### Step 5: Verify CORS Configuration

Check if CORS is configured:

```bash
gsutil cors get gs://graddrive-e3695.firebasestorage.app
```

## Alternative: Using Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `graddrive-e3695`
3. Go to **Cloud Storage** > **Buckets**
4. Click on your bucket: `graddrive-e3695.firebasestorage.app`
5. Go to **Configuration** tab
6. Scroll to **CORS** section
7. Click **Edit CORS configuration**
8. Add this JSON:

```json
[
  {
    "origin": ["*"],
    "method": ["GET", "HEAD"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["Content-Type", "Content-Disposition"]
  }
]
```

9. Click **Save**

## What This Does

- Allows GET and HEAD requests from any origin (or your specific domains)
- Enables `Content-Disposition` header which helps force downloads
- Sets cache to 1 hour (3600 seconds)

## After Configuration

1. Wait a few minutes for changes to propagate
2. Clear your browser cache
3. Try downloading again - files should download instead of opening

## Troubleshooting

### Still opening in browser?

1. **Check CORS is applied:**

   ```bash
   gsutil cors get gs://graddrive-e3695.firebasestorage.app
   ```

2. **Verify bucket name:**

   - Check your `.env.local` or Firebase config
   - Bucket name should be: `graddrive-e3695.firebasestorage.app`

3. **Try incognito mode:**

   - Browser cache might be interfering

4. **Check browser console:**
   - Look for CORS errors in the Network tab

## Quick Test

After configuring CORS, test with:

```bash
curl -I "https://firebasestorage.googleapis.com/v0/b/graddrive-e3695.firebasestorage.app/o/posters%2F..."
```

You should see `Access-Control-Allow-Origin` in the response headers.
