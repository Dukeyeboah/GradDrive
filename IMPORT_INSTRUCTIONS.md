# Importing Photographers Data - Solutions

## The Problem
Server-side API routes don't have user authentication context, so they can't write to Firestore when rules require `isAdmin()`.

## Solution 1: Temporarily Update Firestore Rules (Quickest)

1. **Go to Firebase Console:**
   - Navigate to: https://console.firebase.google.com/
   - Select your project: `graddrive-e3695`
   - Go to Firestore Database > Rules

2. **Temporarily allow writes:**
   - Find the photographers collection rule (around line 36-39)
   - Change from:
     ```
     allow write: if isAdmin();
     ```
   - To:
     ```
     allow write: if true;
     ```
   - Click "Publish"

3. **Import the data:**
   - Run `npx tsx scripts/import-photographers.ts` from the repo root (or use your own Admin SDK import flow).
   - Wait for success message in the terminal.

4. **Restore security (IMPORTANT!):**
   - Go back to Firestore Rules
   - Change back to:
     ```
     allow write: if isAdmin();
     ```
   - Click "Publish"

## Solution 2: Use Firebase Admin SDK (More Secure)

The code is already set up for Admin SDK. You just need to:

1. **Install the package:**
   ```bash
   pnpm add firebase-admin
   ```

2. **Get Service Account Key:**
   - Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

3. **Set up environment variable:**
   - Create/update `.env.local`:
     ```
     FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"graddrive-e3695",...}'
     ```
   - Paste the entire JSON content as a single-line string

4. **Import will work automatically!** The code in `lib/firebase/admin.ts` will use the service account.

## Solution 3: Manual Upload via Firebase Console

1. Go to Firebase Console > Firestore Database
2. Click "Start collection" → Name it `photographers`
3. For each photographer, click "Add document" and add these fields:

   **Required:**
   - `firstName` (string) - e.g., "Lia"
   - `status` (string) - "interested-follow-up"
   - `instagramContact` (boolean) - false
   - `emailContact` (boolean) - false
   - `phoneContact` (boolean) - false

   **Optional:**
   - `lastName` (string)
   - `email` (string)
   - `website` (string)
   - `instagram` (string)
   - `phone` (string)
   - `address` (string)
   - `state` (string)
   - `createdAt` (timestamp) - Click "timestamp" button
   - `updatedAt` (timestamp) - Click "timestamp" button

4. Repeat for all 25 photographers

## Recommended: Solution 1 (Temporary Rules)

This is the quickest way to get your data imported. Just remember to change the rules back after importing!
