const fs = require('fs');

let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

const target = `    setFavorites(prev => {
      if (!Array.isArray(prev)) {
        console.error("prev is not an array in toggleFavorite, resetting to []");
        return [trackId];
      }
      const exists = prev.includes(trackId);
      let updated: string[];
      if (exists) {`;

const replacement = `    setFavorites(prev => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const exists = safePrev.includes(trackId);
      let updated: string[];
      if (exists) {`;

code = code.replace(target, replacement);

fs.writeFileSync('src/context/PlayerContext.tsx', code);
