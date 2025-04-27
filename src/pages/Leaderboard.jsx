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

  // Randomly assign avatars to players
  const avatars = [
    "https://i.pravatar.cc/150?img=1",
    "https://i.pravatar.cc/150?img=2",
    "https://i.pravatar.cc/150?img=3",
    "https://i.pravatar.cc/150?img=4",
    "https://i.pravatar.cc/150?img=5",
  ];

  return (
    <>
      <LiveBackground mode="grid" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 z-10 relative">
        {/* Title */}
        <h1 className="text-4xl sm:text-6xl text-green-400 font-bold mb-10 glitch">
          LIVE LEADERBOARD
        </h1>

        {/* Top 3 Players */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 w-full max-w-5xl">
          {players.slice(0, 3).map((player, index) => (
            <div
              key={index}
              className={`relative bg-black/80 border-4 rounded-lg p-6 text-center shadow-lg ${
                index === 0
                  ? "border-yellow-400"
                  : index === 1
                  ? "border-gray-400"
                  : "border-orange-400"
              }`}
            >
              <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                <img
                  src={avatars[index % avatars.length]}
                  alt="Player Avatar"
                  className="w-20 h-20 rounded-full border-4 border-green-400"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mt-10 text-green-400">
                #{index + 1} {player.username}
              </h2>
              <p className="text-lg sm:text-xl text-green-300">{player.name}</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-400 mt-4">
                {player.score} pts
              </p>
            </div>
          ))}
        </div>

        {/* Remaining Players in Table Format */}
        <div className="w-full max-w-4xl bg-black/60 border-2 border-green-400 rounded-lg overflow-hidden shadow-lg backdrop-blur-md">
          <table className="w-full text-left text-green-400">
            <thead className="bg-green-800/50">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Player</th>
                <th className="p-4">Score</th>
              </tr>
            </thead>
            <tbody>
              {players.slice(3).map((player, index) => (
                <tr
                  key={index}
                  className="border-b border-green-800 hover:bg-green-800/20 transition-all"
                >
                  <td className="p-4">#{index + 4}</td>
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={avatars[(index + 3) % avatars.length]}
                      alt="Player Avatar"
                      className="w-8 h-8 rounded-full border-2 border-green-400"
                    />
                    {player.username} ({player.name})
                  </td>
                  <td className="p-4">{player.score} pts</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
