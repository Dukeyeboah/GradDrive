# Deploy Firestore and Storage Rules

## IMPORTANT: You MUST deploy these rules to Firebase for authentication to work!

### Current Issue
You're getting "Missing or insufficient permissions" because the rules in Firebase Console are still the old version that doesn't allow users to create their own documents.

### Solution: Deploy Updated Rules

#### Step 1: Copy Firestore Rules

1. Open `firestore.rules` in this project
2. Copy ALL the contents
3. Go to [Firebase Console](https://console.firebase.google.com/)
4. Select project: `graddrive-e3695`
5. Go to **Firestore Database** > **Rules** tab
6. **Delete all existing rules**
7. **Paste the new rules**
8. Click **"Publish"**

#### Step 2: Copy Storage Rules

1. Open `storage.rules` in this project
2. Copy ALL the contents
3. In Firebase Console, go to **Storage** > **Rules** tab
4. **Delete all existing rules**
5. **Paste the new rules**
6. Click **"Publish"**

### What the Updated Rules Do

**Firestore Rules:**
- ✅ Users can create their own user document when signing up
- ✅ Users can read/update their own data
- ✅ Admins can manage all collections
- ✅ Everyone can read public content (photographers, posters, ebooks)

**Storage Rules:**
- ✅ Everyone can read images
- ✅ Only admins can upload/delete files
- ✅ Users can manage files in their own folder

### After Deploying

1. Try signing up a new user
2. Check Firestore Database - you should see a `users` collection
3. User documents should be created automatically with:
   - `uid`: User ID
   - `email`: User email
   - `displayName`: User name
   - `photoURL`: Profile picture (if Google sign-in)
   - `role`: "user" or "admin"
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

### Testing

After deploying rules:
1. Sign up a regular user → Should create document in `users` collection
2. Sign up an admin (with passkey) → Should create document with `role: "admin"`
3. Sign in → Should redirect to correct dashboard based on role

