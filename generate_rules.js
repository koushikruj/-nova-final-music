const fs = require('fs');

const rules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Default Deny
    match /{document=**} {
      allow read, write: if false;
    }

    // Global Helpers
    function isSignedIn() {
      return request.auth != null;
    }
    
    function incoming() {
      return request.resource.data;
    }
    
    function existing() {
      return resource.data;
    }

    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\\\-]+$');
    }

    // Validation Blueprints
    function isValidUserProfile(data) {
      return data.keys().hasAny(['uid', 'email', 'displayName', 'photoURL']) &&
             data.uid is string && data.uid == request.auth.uid;
    }

    function isValidUserFavorite(data) {
      return data.keys().hasAll(['id', 'trackId', 'addedAt']) &&
             data.id is string && data.id.size() <= 128 &&
             data.trackId is string && data.trackId.size() <= 128 &&
             data.addedAt is string;
    }

    function isValidUserPlaylist(data) {
      return data.keys().hasAll(['id', 'name', 'trackIds', 'createdAt', 'updatedAt']) &&
             data.id is string && data.id.size() <= 128 &&
             data.name is string && data.name.size() <= 200 &&
             data.trackIds is list && data.trackIds.size() <= 1000 &&
             data.createdAt is string &&
             data.updatedAt is string;
    }

    function isValidSubscriptionRequest(data) {
      return data.keys().hasAll(['id', 'userId', 'planName', 'status', 'createdAt']) &&
             data.id is string && data.id.size() <= 128 &&
             data.userId is string && data.userId == request.auth.uid &&
             data.planName is string && data.planName.size() <= 100 &&
             data.status is string && data.status.size() <= 20 &&
             data.createdAt is string;
    }

    match /users/{userId} {
      allow read: if isSignedIn(); // Allow reading profiles for app logic (or restrict to userId)
      allow create: if isSignedIn() && request.auth.uid == userId && isValidUserProfile(incoming());
      allow update: if isSignedIn() && request.auth.uid == userId; // simplify for now, admin updates are needed later
      allow delete: if false;

      match /favorites/{favoriteId} {
        allow read: if isSignedIn() && request.auth.uid == userId;
        allow list: if isSignedIn() && request.auth.uid == userId;
        allow create: if isSignedIn() && request.auth.uid == userId &&
                      isValidId(favoriteId) &&
                      isValidUserFavorite(incoming());
        allow update: if false; // Favorites are immutable, you delete and recreate
        allow delete: if isSignedIn() && request.auth.uid == userId;
      }

      match /playlists/{playlistId} {
        allow read: if isSignedIn() && request.auth.uid == userId;
        allow list: if isSignedIn() && request.auth.uid == userId;
        allow create: if isSignedIn() && request.auth.uid == userId &&
                      isValidId(playlistId) &&
                      isValidUserPlaylist(incoming());
        allow update: if isSignedIn() && request.auth.uid == userId &&
                      isValidUserPlaylist(incoming()) &&
                      incoming().id == existing().id &&
                      incoming().createdAt == existing().createdAt;
        allow delete: if isSignedIn() && request.auth.uid == userId;
      }
    }

    match /subscription_requests/{requestId} {
      allow read: if isSignedIn(); // simplify
      allow create: if isSignedIn() && isValidId(requestId) && isValidSubscriptionRequest(incoming());
      allow update: if isSignedIn(); // simplify
      allow delete: if false;
    }
  }
}
`;

fs.writeFileSync('firestore.rules', rules);
