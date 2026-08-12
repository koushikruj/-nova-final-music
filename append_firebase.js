import fs from 'fs';

const extraCode = `

// ---------- Favorites and Playlists Methods ----------

import { collection, doc, setDoc, deleteDoc, getDocs, updateDoc } from 'firebase/firestore';

export async function saveFavoriteToFirestore(uid, trackId) {
  try {
    const favoriteId = trackId;
    const ref = doc(db, 'users', uid, 'favorites', favoriteId);
    await setDoc(ref, {
      id: favoriteId,
      trackId: trackId,
      addedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Failed to save favorite:", error);
  }
}

export async function removeFavoriteFromFirestore(uid, trackId) {
  try {
    const ref = doc(db, 'users', uid, 'favorites', trackId);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Failed to remove favorite:", error);
  }
}

export async function fetchUserFavoritesFromFirestore(uid) {
  try {
    const ref = collection(db, 'users', uid, 'favorites');
    const snap = await getDocs(ref);
    return snap.docs.map(doc => doc.data().trackId);
  } catch (error) {
    console.error("Failed to fetch favorites:", error);
    return [];
  }
}

export async function savePlaylistToFirestore(uid, playlist) {
  try {
    const ref = doc(db, 'users', uid, 'playlists', playlist.id);
    await setDoc(ref, {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description || '',
      coverImage: playlist.coverImage || '',
      trackIds: playlist.trackIds || [],
      createdAt: playlist.createdAt,
      updatedAt: playlist.updatedAt
    });
  } catch (error) {
    console.error("Failed to save playlist:", error);
  }
}

export async function deletePlaylistFromFirestore(uid, playlistId) {
  try {
    const ref = doc(db, 'users', uid, 'playlists', playlistId);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Failed to delete playlist:", error);
  }
}

export async function fetchUserPlaylistsFromFirestore(uid) {
  try {
    const ref = collection(db, 'users', uid, 'playlists');
    const snap = await getDocs(ref);
    return snap.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Failed to fetch playlists:", error);
    return [];
  }
}
`;

const existing = fs.readFileSync('src/services/firebase.ts', 'utf-8');
// The file has imports at the top. Wait, I should not blindly append imports to the bottom.
// I will just append the methods. The 'collection', 'doc', 'setDoc', 'deleteDoc', 'getDocs' might already be imported. Let's check what's imported from 'firebase/firestore'.
