const fs = require('fs');
let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

const target1 = `  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
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
  };
        }
        return pl;
      })
    );
    showToast('Added song to playlist');
  };`;

const repl1 = `  const addTrackToPlaylist = (playlistId: string, trackId: string) => {
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
  };`;

const target2 = `  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
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
  };
        }
        return pl;
      })
    );
    showToast('Removed song from playlist');
  };`;

const repl2 = `  const removeTrackFromPlaylist = (playlistId: string, trackId: string) => {
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
  };`;

const target3 = `  const reorderPlaylistTracks = (playlistId: string, fromIndex: number, toIndex: number) => {
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
  };
      })
    );
  };`;

const repl3 = `  const reorderPlaylistTracks = (playlistId: string, fromIndex: number, toIndex: number) => {
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
  };`;

code = code.replace(target1, repl1);
code = code.replace(target2, repl2);
code = code.replace(target3, repl3);

fs.writeFileSync('src/context/PlayerContext.tsx', code);
