const fs = require('fs');

let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

const oldFunc = `  const toggleFavorite = (trackId: string) => {
    const trackObj = tracks.find(t => t.id === trackId);
        
    if (trackObj && !recentlyPlayed.find(t => t.id === trackId)) {
      setRecentlyPlayed(prev => {
        const unique = prev.filter(t => t.id !== trackId);
        return [trackObj, ...unique].slice(0, 20);
      });
    }
    setFavorites(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.includes(trackId);
      let updated: string[];
      if (exists) {
        updated = safePrev.filter(id => id !== trackId);
        showToast('Removed from Favorites');
        if (userProfile?.uid) {
          removeFavoriteFromFirestore(userProfile.uid, trackId).catch(console.error);
        }
      } else {
        updated = [trackId, ...safePrev];
        const title = trackObj ? \`"\${trackObj.title}"\` : 'Song';
        showToast(\`Added \${title} to Favorites\`);
        if (userProfile?.uid) {
          saveFavoriteToFirestore(userProfile.uid, trackId).catch(console.error);
        }
      }
      return updated;
    });
  };`;

const newFunc = `  const toggleFavorite = (trackOrId: string | Track) => {
    const trackId = typeof trackOrId === 'string' ? trackOrId : trackOrId.id;
    const trackObj = typeof trackOrId === 'object' ? trackOrId : tracks.find(t => t.id === trackId);
        
    if (trackObj && !recentlyPlayed.find(t => t.id === trackId)) {
      setRecentlyPlayed(prev => {
        const unique = prev.filter(t => t.id !== trackId);
        return [trackObj, ...unique].slice(0, 20);
      });
    }
    setFavorites(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.includes(trackId);
      let updated: string[];
      if (exists) {
        updated = safePrev.filter(id => id !== trackId);
        showToast('Removed from Favorites');
        if (userProfile?.uid) {
          removeFavoriteFromFirestore(userProfile.uid, trackId).catch(console.error);
        }
      } else {
        updated = [trackId, ...safePrev];
        const title = trackObj ? \`"\${trackObj.title}"\` : 'Song';
        showToast(\`Added \${title} to Favorites\`);
        if (userProfile?.uid) {
          saveFavoriteToFirestore(userProfile.uid, trackId).catch(console.error);
        }
      }
      return updated;
    });
  };`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('src/context/PlayerContext.tsx', code);
