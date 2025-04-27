import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LiveBackground from "../components/LiveBackground";

export default function Intro() {
  const navigate = useNavigate();
  const [terminalLines, setTerminalLines] = useState([]);
  const commands = [
    "Booting system...",
    "Initializing modules...",
    "Scanning for connected devices...",
    "Establishing secure connection...",
    "Starting services...",
    "Making you sudo...",
    "System ready. Welcome!",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Auto move to login after 10 seconds
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < commands.length) {
        setTerminalLines((prev) => [...prev, commands[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 1000); // Add a new command every second

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LiveBackground mode="matrix" />
      <div className="flex flex-col items-center justify-center min-h-screen text-green-400 overflow-hidden relative p-4">
        {/* Pulsating background effect */}
        <div className="absolute top-0 left-0 w-full h-full animate-pulse bg-gradient-to-br from-green-500/10 to-transparent" />

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold glitch text-center">
          DOCK THE FLAG
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl lg:text-2xl mt-6 animate-fadein text-center">
          Prepare to Hack the Impossible...
        </p>

        {/* Mini Terminal */}
        <div className="w-full max-w-lg bg-black/80 border border-green-400 rounded-md p-4 mt-6 text-left font-mono text-sm sm:text-base lg:text-lg overflow-hidden">
          <div className="h-40 overflow-y-auto">
            {terminalLines.map((line, index) => (
              <p key={index} className="text-green-400">
                {line}
              </p>
            ))}
            <span className="animate-blink">...</span>
            <div className="mt-8 text-green-400 text-lg sm:text-xl lg:text-2xl font-mono"></div>
          </div>
        </div>

        {/* Terminal-style blinking cursor */}
      </div>
    </>
  );
}
