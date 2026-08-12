const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const { title, artist, album, albumArt, audioUrl, duration, genre, year } = req.body;",
  "const { title, artist, album, albumArt, audioUrl, duration, genre, year } = req.body || {};"
);

code = code.replace(
  "const { name, description, coverImage, trackIds } = req.body;",
  "const { name, description, coverImage, trackIds } = req.body || {};"
);

fs.writeFileSync('server.ts', code);
