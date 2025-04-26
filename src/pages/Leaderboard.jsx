import { useState, useEffect } from "react";
import LiveBackground from "../components/LiveBackground";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          "https://dock-the-quiz-backend-production.up.railway.app/api/leaderboard"
        );
        const data = await res.json();
        setPlayers(data.leaderboard);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000); // refresh every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LiveBackground mode="grid" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 z-10 relative">
        <h1 className="text-4xl text-green-400 font-bold mb-6 glitch">
          LIVE LEADERBOARD
        </h1>
        <div className="w-full max-w-2xl bg-black/60 border-2 border-green-400 rounded-lg overflow-hidden shadow-lg backdrop-blur-md">
          {players.map((player, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border-b border-green-800 text-green-400 animate-fadein"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl font-bold">
                #{index + 1} {player.username} ({player.name})
              </div>
              <div className="text-xl">{player.score} pts</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
