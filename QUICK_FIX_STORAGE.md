# Quick Fix for Storage 403 Error

## Immediate Steps to Fix

### 1. Deploy Updated Rules to Firebase Console

**Firestore Rules:**

1. Copy ALL content from `firestore.rules`
2. Go to Firebase Console → Firestore Database → Rules tab
3. Delete old rules, paste new rules, click "Publish"

**Storage Rules:**

1. Copy ALL content from `storage.rules`
2. Go to Firebase Console → Storage → Rules tab
3. Delete old rules, paste new rules, click "Publish"

### 2. Verify Your User Document in Firestore

1. Go to Firebase Console → Firestore Database
2. Open the `users` collection
3. Find your user document (search by your email or UID)
4. **CRITICAL:** Check that the `role` field exists and is set to:
   - `"admin"` OR
   - `"super admin"`

**If the role is missing or wrong:**

- Click on your user document
- Add/edit the `role` field
- Set it to `"admin"` (or `"super admin"` if you used the super admin passkey)
- Save the document

### 3. Verify Authentication

1. Make sure you're logged in as an admin
2. Check your browser console - you should see your user ID
3. The user ID should match the document ID in the `users` collection

### 4. Test Upload Again

After completing steps 1-3:

1. Refresh your browser
2. Try uploading a poster
3. It should work!

## Common Issues

### Issue: "User document doesn't exist"

**Solution:** Sign up again via `/admin` with the passkey, or manually create the user document in Firestore with `role: "admin"`

### Issue: "Role is set to 'user' instead of 'admin'"

**Solution:** Manually update the `role` field in Firestore to `"admin"` or `"super admin"`

### Issue: "Rules deployed but still getting 403"

**Solution:**

- Wait 1-2 minutes for rules to propagate
- Clear browser cache
- Log out and log back in
- Check that your user document has the correct role

## Testing Your Setup

To verify everything is working:

1. **Check Firestore:**

   - Your user document exists
   - Has `role: "admin"` or `role: "super admin"`

2. **Check Storage Rules:**

   - Rules are deployed in Firebase Console
   - Rules match the content in `storage.rules` file

3. **Check Authentication:**
   - You're logged in
   - Your user ID matches the document ID in Firestore

If all three are correct, uploads should work!
