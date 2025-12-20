# Firebase Setup Guide

This guide will help you set up Firebase Authentication, Storage, and Firestore for the GradDrive application.

## Prerequisites

1. Firebase project created at [Firebase Console](https://console.firebase.google.com/)
2. Firebase configuration values (already included in the code with defaults)

## Installation

Install Firebase dependencies:

```bash
pnpm add firebase
```

## Environment Variables

Create a `.env.local` file in the root directory (optional - defaults are already set):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Firebase Console Setup

### 1. Authentication Setup

1. Go to Firebase Console > Authentication
2. Enable the following sign-in methods:
   - **Email/Password**: Enable
   - **Google**: Enable (add OAuth consent screen in Google Cloud Console)

### 2. Firestore Database Setup

1. Go to Firebase Console > Firestore Database
2. Create a database in **Production mode**
3. Deploy the security rules from `firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```

   Or manually copy the rules from `firestore.rules` to Firebase Console > Firestore > Rules

### 3. Storage Setup

1. Go to Firebase Console > Storage
2. Create a storage bucket
3. Deploy the security rules from `storage.rules`:
   ```bash
   firebase deploy --only storage
   ```

   Or manually copy the rules from `storage.rules` to Firebase Console > Storage > Rules

## Security Rules

### Firestore Rules

The rules are located in `firestore.rules`. Key features:
- Users can read their own data
- Only admins can write to photographers, posters, ebooks collections
- Everyone can read photographers, posters, and ebooks
- Only admins can access system logs

### Storage Rules

The rules are located in `storage.rules`. Key features:
- Everyone can read images (posters, photographers, ebooks)
- Only admins can upload/delete files
- Users can manage files in their own folder

## Creating Admin Users

To create an admin user:

1. Sign up through the admin signup page at `/admin/signup`
2. The user will automatically be assigned the "admin" role
3. Alternatively, manually set the role in Firestore:
   - Go to Firestore Database
   - Find the user document in the `users` collection
   - Update the `role` field to `"admin"`

## Testing

1. Test user authentication:
   - Sign up as a regular user at the home page
   - Sign in with email/password or Google

2. Test admin authentication:
   - Sign up as admin at `/admin/signup`
   - Sign in at `/admin/login`
   - Verify access to admin dashboard

3. Test file uploads:
   - As admin, try uploading a poster image
   - Verify the image appears in the posters list

## Production Deployment

Before deploying to production:

1. ✅ Set up environment variables in your hosting platform (Vercel, etc.)
2. ✅ Deploy Firestore security rules
3. ✅ Deploy Storage security rules
4. ✅ Verify admin user creation process
5. ✅ Test authentication flows
6. ✅ Test file uploads and downloads

## Troubleshooting

### Authentication Errors
- Verify Firebase Authentication is enabled
- Check that sign-in methods are enabled in Firebase Console
- Ensure environment variables are set correctly

### Storage Upload Errors
- Verify Storage rules are deployed
- Check that the user has admin role
- Verify file size limits (default: 5MB for images)

### Firestore Permission Errors
- Verify Firestore rules are deployed
- Check user role in Firestore `users` collection
- Ensure user is authenticated before accessing protected data

