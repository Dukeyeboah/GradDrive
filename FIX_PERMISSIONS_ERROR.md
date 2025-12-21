# Fix "Missing or insufficient permissions" Error

## The Problem
You're getting this error because the Firestore rules in Firebase Console are still the **old version** that doesn't allow users to create their own documents.

## The Solution: Deploy Updated Rules

### Step 1: Copy Firestore Rules

1. Open the file `firestore.rules` in this project
2. **Select ALL** (Cmd+A / Ctrl+A) and **Copy** (Cmd+C / Ctrl+C)
3. Go to [Firebase Console](https://console.firebase.google.com/)
4. Select your project: **graddrive-e3695**
5. Click **Firestore Database** in the left sidebar
6. Click the **Rules** tab at the top
7. **Delete ALL existing rules** in the editor
8. **Paste** the new rules you copied
9. Click **"Publish"** button (top right)

### Step 2: Copy Storage Rules

1. Open the file `storage.rules` in this project
2. **Select ALL** and **Copy**
3. In Firebase Console, click **Storage** in the left sidebar
4. Click the **Rules** tab at the top
5. **Delete ALL existing rules** in the editor
6. **Paste** the new rules you copied
7. Click **"Publish"** button

### Step 3: Verify Rules Are Deployed

After publishing, you should see:
- ✅ Green checkmark or success message
- ✅ Rules should match what's in your local files

### Step 4: Test Authentication

1. Try signing up a new user
2. Check Firestore Database → You should see a `users` collection
3. User documents should be created automatically

## What the Updated Rules Do

**Firestore Rules:**
- ✅ Users can **create their own** user document when signing up
- ✅ Users can read/update their own data
- ✅ Admins can manage all collections
- ✅ Everyone can read public content

**Storage Rules:**
- ✅ Everyone can read images
- ✅ Only admins can upload/delete files

## Important Notes

- The rules in your local files (`firestore.rules` and `storage.rules`) are **correct**
- You **MUST** copy them to Firebase Console for them to take effect
- Rules are not automatically synced - you must manually deploy them
- After deploying, wait a few seconds for changes to propagate

## Still Getting Errors?

If you still get permission errors after deploying:

1. **Double-check** the rules in Firebase Console match your local files exactly
2. **Clear browser cache** and try again
3. **Check browser console** for specific error messages
4. **Verify** you're signed in (check Firebase Console → Authentication)

## Cross-Origin-Opener-Policy Warning

The `Cross-Origin-Opener-Policy` warning is just a warning and won't break functionality. It's related to Google sign-in popup. The real issue is the permissions error, which will be fixed once you deploy the rules.

