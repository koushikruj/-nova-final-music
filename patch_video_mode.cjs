const fs = require('fs');

let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

code = code.replace(
  "  isBuffering: boolean;",
  "  isBuffering: boolean;\n  isVideoMode: boolean;\n  setIsVideoMode: React.Dispatch<React.SetStateAction<boolean>>;"
);

code = code.replace(
  "  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);",
  "  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);\n  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);"
);

code = code.replace(
  "        isBuffering,",
  "        isBuffering,\n        isVideoMode,\n        setIsVideoMode,"
);

const oldYoutube = `{youtubeId && (
        <div className="fixed top-0 -left-[9999px] w-[300px] h-[300px] opacity-0 pointer-events-none z-[-100]">
          <YouTube
            videoId={youtubeId}
            opts={{
              height: '300',
              width: '300',`;

const newYoutube = `{youtubeId && (
        <div 
          className={
            isVideoMode 
              ? "fixed bottom-24 right-4 w-72 sm:w-80 md:w-96 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-[9999] transition-all duration-300" 
              : "fixed top-0 -left-[9999px] w-[300px] h-[300px] opacity-0 pointer-events-none z-[-100]"
          }
        >
          {isVideoMode && (
             <div className="absolute top-2 right-2 z-10 flex gap-2">
               <button onClick={() => setIsVideoMode(false)} className="p-1.5 bg-black/60 hover:bg-rose-500 rounded-full text-white backdrop-blur-md transition-colors shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </button>
             </div>
          )}
          <YouTube
            videoId={youtubeId}
            className="w-full h-full pointer-events-auto"
            opts={{
              height: '100%',
              width: '100%',`;

code = code.replace(oldYoutube, newYoutube);

fs.writeFileSync('src/context/PlayerContext.tsx', code);
