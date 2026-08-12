const fs = require('fs');

let code = fs.readFileSync('src/components/MainPlayer.tsx', 'utf-8');

// Add MonitorPlay to imports
code = code.replace(
  "Mic2,",
  "Mic2,\n  MonitorPlay,"
);

// Add isVideoMode and setIsVideoMode to usePlayer
code = code.replace(
  "    activeDrawer,",
  "    activeDrawer,\n    isVideoMode,\n    setIsVideoMode,"
);

// Add the button
const lyricsBtn = `{hasPermission('canAccessLyrics') && (
                <button`;

const videoBtn = `
              {/* Video Mode Button */}
              <button
                onClick={() => setIsVideoMode(!isVideoMode)}
                className={\`p-2 rounded-full transition-colors \${
                  isVideoMode ? 'text-blue-400 bg-blue-400/10' : 'hover:text-white'
                }\`}
                title="Toggle Video Player"
              >
                <MonitorPlay className="w-5 h-5" />
              </button>

              ${lyricsBtn}`;

code = code.replace(lyricsBtn, videoBtn);

fs.writeFileSync('src/components/MainPlayer.tsx', code);
