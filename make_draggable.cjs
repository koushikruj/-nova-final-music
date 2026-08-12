const fs = require('fs');

let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

// 1. Inject drag state
const stateInjection = `  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);

  // Video Dragging State
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: dragOffset.x,
      offsetY: dragOffset.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setDragOffset({
      x: dragStartRef.current.offsetX + dx,
      y: dragStartRef.current.offsetY + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
`;
code = code.replace("  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);", stateInjection);

// 2. Replace the JSX
const oldYoutube = `{youtubeId && (
        <div 
          className={
            isVideoMode 
              ? "fixed bottom-24 right-4 w-72 sm:w-80 md:w-96 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-[9999] transition-all duration-300" 
              : "fixed top-0 -left-[9999px] w-[300px] h-[300px] opacity-0 pointer-events-none z-[-100]"
          }
        >
          {isVideoMode && (
             <div className="absolute top-2 right-2 z-10 flex gap-2">
               <button onClick={() => setIsVideoMode(false)} className="p-1.5 bg-black/60 hover:bg-rose-500 rounded-full text-white backdrop-blur-md transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
               </button>
             </div>
          )}
          <YouTube
            videoId={youtubeId}
            className="w-full h-full"
            opts={{
              height: '100%',
              width: '100%',
              playerVars: {
                autoplay: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                iv_load_policy: 3,
                enablejsapi: 1,
                origin: typeof window !== 'undefined' ? window.location.origin : undefined
              },
            }}
            onReady={onYtReady}
            onStateChange={onYtStateChange}
            onError={onYtError}
          />
        </div>
      )}`;

const newYoutube = `{youtubeId && (
        <div 
          className={
            isVideoMode 
              ? "fixed bottom-24 right-4 w-72 sm:w-80 md:w-96 aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/20 z-[9999]" 
              : "fixed top-0 -left-[9999px] w-[300px] h-[300px] opacity-0 pointer-events-none z-[-100]"
          }
          style={
            isVideoMode 
              ? {
                  transform: \`translate(\${dragOffset.x}px, \${dragOffset.y}px)\`,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  touchAction: 'none'
                }
              : {}
          }
        >
          {isVideoMode && (
             <>
               <div
                 className="absolute inset-0 z-20"
                 onPointerDown={handlePointerDown}
                 onPointerMove={handlePointerMove}
                 onPointerUp={handlePointerUp}
                 onPointerCancel={handlePointerUp}
               />
               <div className="absolute top-2 right-2 z-30 flex gap-2">
                 <button onClick={(e) => { e.stopPropagation(); setIsVideoMode(false); }} className="p-1.5 bg-black/60 hover:bg-rose-500 rounded-full text-white backdrop-blur-md transition-colors shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                 </button>
               </div>
             </>
          )}
          <div className="w-full h-full pointer-events-none">
            <YouTube
              videoId={youtubeId}
              className="w-full h-full"
              opts={{
                height: '100%',
                width: '100%',
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  disablekb: 1,
                  fs: 0,
                  modestbranding: 1,
                  rel: 0,
                  showinfo: 0,
                  iv_load_policy: 3,
                  enablejsapi: 1,
                  origin: typeof window !== 'undefined' ? window.location.origin : undefined
                },
              }}
              onReady={onYtReady}
              onStateChange={onYtStateChange}
              onError={onYtError}
            />
          </div>
        </div>
      )}`;

code = code.replace(oldYoutube, newYoutube);
fs.writeFileSync('src/context/PlayerContext.tsx', code);
