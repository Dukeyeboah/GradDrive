# Test Upload Debugging Guide

## Step 1: Add Debug Logging

I've added console logging to the upload function. When you try to upload, check your browser console for:
- User UID
- User Data
- User Role
- Authentication status

## Step 2: Test with Temporary Open Rules

To test if the issue is with the admin role check, we can temporarily use open rules:

1. **Copy the content from `storage.rules.test`**
2. Go to Firebase Console → Storage → Rules
3. **Replace** the current rules with the test rules
4. Click "Publish"
5. **Try uploading** - if it works, the issue is with the role check
6. **If it works**, the problem is either:
   - Rules not deployed correctly
   - User document doesn't have admin role
   - Role check syntax issue

## Step 3: Check Console Logs

After trying to upload, check browser console for:
```
=== UPLOAD DEBUG INFO ===
User: [object]
User UID: f1U7tolpkDd6CY4eZog9ovTWHFL2
User Data: [object]
User Role: admin
Is Authenticated: true
=========================
```

**What to look for:**
- ✅ User UID matches your Firestore document ID
- ✅ User Role is "admin" (not undefined or "user")
- ✅ Is Authenticated is true

## Step 4: Verify Firestore Document

1. Go to Firebase Console → Firestore
2. Open `users` collection
3. Find document with ID: `f1U7tolpkDd6CY4eZog9ovTWHFL2`
4. Verify:
   - Document exists
   - Has `role` field
   - `role` value is exactly `"admin"` (string, lowercase)

## Step 5: If Test Rules Work

If uploads work with the test rules (allowing any authenticated user), then:

1. **The issue is with the admin role check**
2. **Possible causes:**
   - Storage rules in Firebase Console are different from local file
   - User document doesn't exist when rules check
   - Role field name/value mismatch

## Step 6: Fix and Revert

Once we identify the issue:

1. Fix the root cause
2. **Revert to secure rules** from `storage.rules` (not `.test`)
3. Deploy the fixed rules
4. Test again

## Important Notes

⚠️ **NEVER leave test rules in production!** They allow any authenticated user to upload.

✅ Always revert to the secure rules from `storage.rules` after testing.

