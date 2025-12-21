# Deploy Storage Rules to Fix 403 Error

## The Problem
You're getting a `403 (storage/unauthorized)` error when trying to upload files because the Storage rules in Firebase Console haven't been updated with the latest rules.

## Quick Fix: Deploy Storage Rules

### Step 1: Copy Storage Rules

1. Open the file `storage.rules` in this project
2. **Select ALL** (Cmd+A / Ctrl+A) and **Copy** (Cmd+C / Ctrl+C)

### Step 2: Deploy to Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **graddrive-e3695**
3. Click **Storage** in the left sidebar
4. Click the **Rules** tab at the top
5. **Delete ALL existing rules** in the editor
6. **Paste** the new rules you copied from `storage.rules`
7. Click **"Publish"** button (top right)

### Step 3: Verify Your User Has Admin Role

1. Go to **Firestore Database** in Firebase Console
2. Click on the **users** collection
3. Find your user document (by your UID or email)
4. Check that the `role` field is set to either:
   - `"admin"` 
   - `"super admin"`

If the role is missing or set to `"user"`:
- The user document should have been created when you signed up via `/admin`
- If it doesn't have the admin role, you can manually update it in Firestore

### Step 4: Test Upload

After deploying the rules:
1. Refresh your browser
2. Try uploading a poster again
3. It should work now!

## What the Storage Rules Do

- ✅ **Everyone** can read/view images (posters, photographers, ebooks, cap designs)
- ✅ **Only admins** can upload/delete files to:
  - `posters/` folder
  - `photographers/` folder
  - `ebooks/` folder
  - `cap-designs/` folder
- ✅ **Users** can manage files in their own `users/{userId}/` folder

## Troubleshooting

### Still Getting 403 Error?

1. **Check your user role in Firestore:**
   - Go to Firestore Database > users collection
   - Find your user document
   - Verify `role` is `"admin"` or `"super admin"`

2. **Verify rules were deployed:**
   - Go to Storage > Rules tab
   - Make sure the rules match what's in `storage.rules` file
   - The `isAdmin()` function should check for both 'admin' and 'super admin' roles

3. **Clear browser cache and refresh:**
   - Sometimes cached authentication tokens can cause issues
   - Try logging out and logging back in

4. **Check Firebase Console logs:**
   - Go to Firebase Console > Storage > Usage tab
   - Look for any error messages

### User Document Doesn't Have Admin Role?

If your user document exists but doesn't have the admin role:

1. Go to Firestore Database > users collection
2. Find your user document
3. Click on it to edit
4. Add or update the `role` field to `"admin"` or `"super admin"`
5. Save the document
6. Try uploading again

## Alternative: Use Firebase CLI

If you have Firebase CLI installed, you can deploy rules using:

```bash
firebase deploy --only storage
```

Make sure you're logged in:
```bash
firebase login
```

And that you're in the project directory with `firebase.json` configured.

