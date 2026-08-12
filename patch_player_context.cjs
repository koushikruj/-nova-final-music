const fs = require('fs');

let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

// 1. Add imports
code = code.replace(
  "updateUserProfileNameAndPhoto",
  "updateUserProfileNameAndPhoto,\n  saveFavoriteToFirestore,\n  removeFavoriteFromFirestore,\n  fetchUserFavoritesFromFirestore,\n  savePlaylistToFirestore,\n  deletePlaylistFromFirestore,\n  fetchUserPlaylistsFromFirestore"
);

// 2. Add useEffect to load data
const effectHook = `
  // Sync User Profile to localStorage
`;
const newEffect = `
  // Fetch User Favorites & Playlists from Firestore on Login
  useEffect(() => {
    if (!userProfile?.uid) return;
    
    let isMounted = true;
    const loadUserData = async () => {
      try {
        const [favs, plsts] = await Promise.all([
          fetchUserFavoritesFromFirestore(userProfile.uid),
          fetchUserPlaylistsFromFirestore(userProfile.uid)
        ]);
        if (!isMounted) return;
        
        if (favs.length > 0) {
          setFavorites(favs);
        }
        if (plsts.length > 0) {
          setPlaylists(plsts);
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };
    loadUserData();
    
    return () => { isMounted = false; };
  }, [userProfile?.uid]);

  // Sync User Profile to localStorage
`;
code = code.replace(effectHook, newEffect);

// 3. Update toggleFavorite
const toggleFavoriteRegex = /const toggleFavorite = [\s\S]*?showToast\(\`Added \$\{title\} to Favorites\`\);\s*\}\s*return updated;\s*\}\);\s*\};/m;
const matchToggle = code.match(toggleFavoriteRegex);
if (matchToggle) {
  const newToggle = `const toggleFavorite = (trackId: string) => {
    const trackObj = tracks.find(t => t.id === trackId);
    
    if (trackObj && !recentlyPlayed.find(t => t.id === trackId)) {
      setRecentlyPlayed(prev => {
        const unique = prev.filter(t => t.id !== trackId);
        return [trackObj, ...unique].slice(0, 20);
      });
    }

    setFavorites(prev => {
      const exists = prev.includes(trackId);
      let updated: string[];
      if (exists) {
        updated = prev.filter(id => id !== trackId);
        showToast('Removed from Favorites');
        if (userProfile?.uid) {
          removeFavoriteFromFirestore(userProfile.uid, trackId).catch(console.error);
        }
      } else {
        updated = [trackId, ...prev];
        const title = trackObj ? \`"\${trackObj.title}"\` : 'Song';
        showToast(\`Added \${title} to Favorites\`);
        if (userProfile?.uid) {
          saveFavoriteToFirestore(userProfile.uid, trackId).catch(console.error);
        }
      }
      return updated;
    });
  };`;
  code = code.replace(matchToggle[0], newToggle);
} else {
  console.error("toggleFavorite not found");
}

// 4. Update createPlaylist
code = code.replace(
  "setPlaylists(prev => [newPl, ...prev]);",
  "setPlaylists(prev => [newPl, ...prev]);\n    if (userProfile?.uid) { savePlaylistToFirestore(userProfile.uid, newPl).catch(console.error); }"
);

// 5. Update addTrackToPlaylist
code = code.replace(
  /const addTrackToPlaylist = \(playlistId: string, trackId: string\) => \{([\s\S]*?)\};/m,
  `const addTrackToPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev =>
      prev.map(pl => {
        if (pl.id === playlistId) {
          if (pl.trackIds.includes(trackId)) return pl;
          const updatedPl = {
            ...pl,
            trackIds: [...pl.trackIds, trackId],
            updatedAt: new Date().toISOString()
          };
          if (userProfile?.uid) { savePlaylistToFirestore(userProfile.uid, updatedPl).catch(console.error); }
          return updatedPl;
        }
        return pl;
      })
    );
    showToast('Added to playlist');
  };`
);

// 6. Update removeTrackFromPlaylist
code = code.replace(
  /const removeTrackFromPlaylist = \(playlistId: string, trackId: string\) => \{([\s\S]*?)\};/m,
  `const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
    setPlaylists(prev =>
      prev.map(pl => {
        if (pl.id === playlistId) {
          const updatedPl = {
            ...pl,
            trackIds: pl.trackIds.filter(id => id !== trackId),
            updatedAt: new Date().toISOString()
          };
          if (userProfile?.uid) { savePlaylistToFirestore(userProfile.uid, updatedPl).catch(console.error); }
          return updatedPl;
        }
        return pl;
      })
    );
    showToast('Removed from playlist');
  };`
);

// 7. Update reorderPlaylistTracks
code = code.replace(
  /const reorderPlaylistTracks = \(playlistId: string, fromIndex: number, toIndex: number\) => \{([\s\S]*?)\};/m,
  `const reorderPlaylistTracks = (playlistId: string, fromIndex: number, toIndex: number) => {
    setPlaylists(prev =>
      prev.map(pl => {
        if (pl.id !== playlistId) return pl;
        const nextTrackIds = [...pl.trackIds];
        if (fromIndex < 0 || fromIndex >= nextTrackIds.length || toIndex < 0 || toIndex >= nextTrackIds.length) return pl;
        const [moved] = nextTrackIds.splice(fromIndex, 1);
        nextTrackIds.splice(toIndex, 0, moved);
        const updatedPl = {
          ...pl,
          trackIds: nextTrackIds,
          updatedAt: new Date().toISOString()
        };
        if (userProfile?.uid) { savePlaylistToFirestore(userProfile.uid, updatedPl).catch(console.error); }
        return updatedPl;
      })
    );
  };`
);

// 8. Update deletePlaylist
code = code.replace(
  /const deletePlaylist = \(playlistId: string\) => \{([\s\S]*?)\};/m,
  `const deletePlaylist = (playlistId: string) => {
    setPlaylists(prev => prev.filter(pl => pl.id !== playlistId));
    if (userProfile?.uid) { deletePlaylistFromFirestore(userProfile.uid, playlistId).catch(console.error); }
    showToast('Deleted playlist');
  };`
);

// 9. Update updatePlaylist
code = code.replace(
  /const updatePlaylist = \(playlistId: string, updates: Partial<Playlist>\) => \{([\s\S]*?)\};/m,
  `const updatePlaylist = (playlistId: string, updates: Partial<Playlist>) => {
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId) {
        const updatedPl = { ...pl, ...updates, updatedAt: new Date().toISOString() };
        if (userProfile?.uid) { savePlaylistToFirestore(userProfile.uid, updatedPl).catch(console.error); }
        return updatedPl;
      }
      return pl;
    }));
    if (updates.name) {
      showToast(\`Updated playlist "\${updates.name}"\`);
    } else {
      showToast('Updated playlist');
    }
  };`
);

// 10. Update importSpotifyPlaylist (there are two places it does setPlaylists)
code = code.replace(
  /setPlaylists\(prev => \[importedPlaylist, \.\.\.prev\]\);/g,
  "setPlaylists(prev => [importedPlaylist, ...prev]);\n          if (userProfile?.uid) { savePlaylistToFirestore(userProfile.uid, importedPlaylist).catch(console.error); }"
);

code = code.replace(
  /setPlaylists\(prev => \[clientPlaylist, \.\.\.prev\]\);/g,
  "setPlaylists(prev => [clientPlaylist, ...prev]);\n      if (userProfile?.uid) { savePlaylistToFirestore(userProfile.uid, clientPlaylist).catch(console.error); }"
);

fs.writeFileSync('src/context/PlayerContext.tsx', code);
