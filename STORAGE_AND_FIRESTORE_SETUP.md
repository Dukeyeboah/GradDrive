# Storage and Firestore Setup Summary

## Firebase Storage Folders

All storage folders are configured in `storage.rules.secure`:

1. **`posters/`** - For poster images
   - Used by: Admin posters page
   - Upload function: `uploadImage(file, "posters")`

2. **`ebooks/`** - For e-book files and thumbnails
   - Used by: Admin ebooks page
   - Upload functions:
     - E-book files: `uploadFile(file, "ebooks/${timestamp}_${filename}")`
     - Thumbnails: `uploadImage(file, "ebooks")`

3. **`cap-designs/`** - For cap design images
   - Used by: Admin cap designs page
   - Upload function: `uploadImage(file, "cap-designs")`

4. **`photographers/`** - For photographer profile images
   - Used by: Admin photographers page
   - Upload function: `uploadImage(file, "photographers")`

5. **`users/{userId}/`** - For user-uploaded files
   - Used by: User uploads
   - Upload function: `uploadFile(file, "users/${userId}/${path}")`

## Firestore Collections

All collections are defined in `lib/firebase/firestore.ts`:

1. **`photographers`** - Photographer profiles
   - Functions: `getPhotographers()`, `getPhotographer(id)`, `addPhotographer(data)`, `updatePhotographer(id, data)`, `deletePhotographer(id)`
   - Fields: name, location, description, style, tags, price, rating, reviews, verified, email, phone, imageUrl, createdAt, updatedAt

2. **`posters`** - Digital posters and artwork
   - Functions: `getPosters()`, `getPoster(id)`, `addPoster(data)`, `updatePoster(id, data)`, `deletePoster(id)`
   - Fields: name, description, category, tags, imageUrl, shopifyLink, downloads, uploadedBy, uploadedByName, createdAt, updatedAt

3. **`capDesigns`** - Graduation cap designs
   - Functions: `getCapDesigns()`, `getCapDesign(id)`, `addCapDesign(data)`, `updateCapDesign(id, data)`, `deleteCapDesign(id)`
   - Fields: name, description, tags, imageUrl, shopifyLink, downloads, uploadedBy, uploadedByName, createdAt, updatedAt

4. **`ebooks`** - E-book library
   - Functions: `getEbooks()`, `getEbook(id)`, `addEbook(data)`, `updateEbook(id, data)`, `deleteEbook(id)`
   - Fields: title, author, description, pages, available, category, isbn, thumbnailUrl, fileUrl, downloads, uploadedBy, uploadedByName, createdAt, updatedAt

5. **`systemLogs`** - System activity logs
   - Functions: `getSystemLogs(limit)`, `addSystemLog(action, type, userId, userName, userEmail, details)`
   - Fields: action, type, userId, userName, userEmail, details, timestamp

6. **`users`** - User accounts and roles
   - Functions: `getUserRole(uid)`, `setUserRole(uid, role)`
   - Fields: role (user/admin/super admin), displayName, email, photoURL, createdAt, updatedAt

## Storage Rules

All storage folders allow:
- **Read**: Public (anyone can view)
- **Write**: Authenticated users only (client-side validation ensures only admins can access upload UI)

## Firestore Rules

- **photographers**: Read public, write admin only
- **posters**: Read public, write admin only
- **capDesigns**: Read public, write admin only
- **ebooks**: Read public, write admin only
- **systemLogs**: Read/write admin only
- **users**: Read own document, write own document (role changes require admin)

## Notes

- Cap designs now have their own collection (`capDesigns`) separate from posters
- All uploads track `uploadedBy` (user ID) and `uploadedByName` (display name)
- All collections include `createdAt` and `updatedAt` timestamps
- Undefined values are filtered out before saving to Firestore

