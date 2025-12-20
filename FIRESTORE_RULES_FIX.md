# Firestore Rules Fix

## Problem
Users were getting "Missing or insufficient permissions" errors when signing up because:
1. The rules only allowed admins to create user documents
2. New users couldn't create their own user document during signup
3. The `isAdmin()` function would fail if the user document didn't exist yet

## Solution
Updated `firestore.rules` to:

1. **Allow users to create their own document**: 
   ```javascript
   allow create: if isOwner(userId);
   ```
   This allows authenticated users to create their own user document when signing up.

2. **Fixed `isAdmin()` function**:
   Added `exists()` check to prevent errors when checking admin status for non-existent users:
   ```javascript
   function isAdmin() {
     return isAuthenticated() && 
            exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
            get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
   }
   ```

3. **Allow role updates by admins**:
   Updated the update rule to allow admins to change roles:
   ```javascript
   allow update: if isOwner(userId) && 
                   (!('role' in request.resource.data) || 
                    request.resource.data.role == resource.data.role ||
                    isAdmin());
   ```

## Deployment
To deploy these rules to Firebase:

1. **Via Firebase Console**:
   - Go to Firebase Console > Firestore Database > Rules
   - Copy the contents of `firestore.rules`
   - Paste into the rules editor
   - Click "Publish"

2. **Via Firebase CLI** (if you have it installed):
   ```bash
   firebase deploy --only firestore:rules
   ```

## Testing
After deploying:
1. Try signing up a new user (regular user)
2. Try signing up an admin user
3. Verify user documents are created in Firestore
4. Check that collections appear in Firebase Console

