# Debug Storage Upload Issue

## Critical Steps to Fix 403 Error

### Step 1: Verify Your User Document in Firestore

1. Go to Firebase Console → Firestore Database
2. Open `users` collection
3. Find your document with UID: `f1U7tolpkDd6CY4eZog9ovTWHFL2`
4. **VERIFY:**
   - Document exists ✅
   - Has `role` field ✅
   - `role` value is exactly `"admin"` (not "Admin" or "ADMIN") ✅

### Step 2: Deploy Storage Rules (CRITICAL)

The rules in your local file are correct, but they MUST be deployed to Firebase Console:

1. **Copy the ENTIRE content** from `storage.rules` file
2. Go to [Firebase Console](https://console.firebase.google.com/)
3. Select project: `graddrive-e3695`
4. Click **Storage** → **Rules** tab
5. **DELETE ALL existing rules**
6. **PASTE** the new rules from `storage.rules`
7. Click **"Publish"** button
8. Wait 30 seconds

### Step 3: Verify Rules Were Deployed

After publishing, check:
- Rules tab shows the same content as `storage.rules`
- No syntax errors shown
- Green checkmark or success message

### Step 4: Clear Browser Cache & Re-authenticate

1. **Log out** from your app
2. **Clear browser cache** (or use incognito mode)
3. **Log back in** via `/admin` with passkey
4. **Try uploading again**

## If Still Not Working

### Test 1: Check Authentication State

Open browser console and run:
```javascript
// Check if user is authenticated
import { getAuth } from 'firebase/auth';
const auth = getAuth();
console.log('Current user:', auth.currentUser);
console.log('User UID:', auth.currentUser?.uid);
```

### Test 2: Verify User Document Exists

In Firebase Console → Firestore:
- Confirm document with your UID exists
- Confirm `role` field is exactly `"admin"` (lowercase, with quotes)

### Test 3: Temporary Test Rule (USE WITH CAUTION)

If you want to test if rules are the issue, temporarily use this in Storage Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posters/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ WARNING:** This allows ANY authenticated user to upload. Only use for testing, then revert to proper rules!

## Most Common Issues

1. **Rules not deployed** - Most common! Rules in local file ≠ rules in Firebase
2. **Role field missing** - User document doesn't have `role` field
3. **Role value wrong** - Role is "user" instead of "admin"
4. **Case sensitivity** - Role is "Admin" instead of "admin" (must be lowercase)
5. **User document doesn't exist** - Need to sign up again or create manually

## Quick Checklist

- [ ] User document exists in Firestore `users` collection
- [ ] User document has `role` field
- [ ] `role` value is exactly `"admin"` (lowercase)
- [ ] Storage rules deployed to Firebase Console
- [ ] Rules match the content in `storage.rules` file
- [ ] Logged out and logged back in after deploying rules
- [ ] Browser cache cleared

If all checked, uploads should work!

