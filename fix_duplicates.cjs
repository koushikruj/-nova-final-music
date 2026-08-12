const fs = require('fs');

let code = fs.readFileSync('src/context/PlayerContext.tsx', 'utf-8');

// Interface
code = code.replace("  isVideoMode: boolean;\n  setIsVideoMode: React.Dispatch<React.SetStateAction<boolean>>;\n  isVideoMode: boolean;\n  setIsVideoMode: React.Dispatch<React.SetStateAction<boolean>>;", "  isVideoMode: boolean;\n  setIsVideoMode: React.Dispatch<React.SetStateAction<boolean>>;");

// State
code = code.replace("  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);\n  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);", "  const [isVideoMode, setIsVideoMode] = useState<boolean>(false);");

// Object literal
code = code.replace("        isVideoMode,\n        setIsVideoMode,\n        isVideoMode,\n        setIsVideoMode,", "        isVideoMode,\n        setIsVideoMode,");

fs.writeFileSync('src/context/PlayerContext.tsx', code);
