const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// Remove the startServer wrapper at the top
code = code.replace("async function startServer() {\n  const PORT = 3000;\n\n", "");

// Find where to insert startServer
const target = "  // Vite middleware for dev or static serving for prod";
const replacement = `async function startServer() {
  const PORT = 3000;
  // Vite middleware for dev or static serving for prod`;

code = code.replace(target, replacement);

fs.writeFileSync('server.ts', code);
console.log("Refactored routes out of startServer");
