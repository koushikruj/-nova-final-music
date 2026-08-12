const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
code = code.replace(
  "if (!process.env.VERCEL) {\n    app.use(express.json());\n  }", 
  "app.use(express.json());"
);
// Also just in case, let's fix any optional chaining
code = code.replace("const { spotifyUrl } = req.body;", "const spotifyUrl = req.body?.spotifyUrl;");
code = code.replace("const { title, artist } = req.body;", "const title = req.body?.title; const artist = req.body?.artist;");

fs.writeFileSync('server.ts', code);
