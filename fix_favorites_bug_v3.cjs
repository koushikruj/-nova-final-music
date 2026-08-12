const fs = require('fs');

let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

const target = `      if (exists) {
        updated = prev.filter(id => id !== trackId);`;

const replacement = `      if (exists) {
        updated = safePrev.filter(id => id !== trackId);`;

code = code.replace(target, replacement);

fs.writeFileSync('src/context/PlayerContext.tsx', code);
