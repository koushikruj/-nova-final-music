const fs = require('fs');
let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

const target = `  const updatePlaylist = (playlistId: string, updates: Partial<Playlist>) => {
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
  };
      }
      return pl;
    }));
    if (updates.name) {
      showToast(\`Updated playlist "\${updates.name}"\`);
    } else {
      showToast('Updated playlist');
    }
  };`;

const repl = `  const updatePlaylist = (playlistId: string, updates: Partial<Playlist>) => {
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
  };`;

code = code.replace(target, repl);
fs.writeFileSync('src/context/PlayerContext.tsx', code);
