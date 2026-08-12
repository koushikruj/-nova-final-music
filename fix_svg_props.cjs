const fs = require('fs');
let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

// The error shows 'stroke-width', 'stroke-linecap', and 'stroke-linejoin' are being used instead of the React camelCase equivalents.
code = code.replace(/stroke-width/g, "strokeWidth");
code = code.replace(/stroke-linecap/g, "strokeLinecap");
code = code.replace(/stroke-linejoin/g, "strokeLinejoin");

fs.writeFileSync('src/context/PlayerContext.tsx', code);
