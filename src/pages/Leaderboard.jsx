import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LiveBackground from "../components/LiveBackground";
import "../pages/global.css"; // Import global CSS for glitch effect

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(
          "https://dock-the-quiz-backend-production.up.railway.app/api/leaderboard"
        );
        const data = await res.json();
        if (data && data.leaderboard) {
          setPlayers(data.leaderboard.sort((a, b) => b.score - a.score));
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);

    return () => clearInterval(interval);
  }, []);

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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 z-10 relative overflow-hidden">
        {/* Title */}
        <h1 className="text-4xl sm:text-6xl text-green-400 font-bold mb-10 glitch">
          LIVE LEADERBOARD
        </h1>

        {/* Top 3 Cards */}
        {/* Top 3 Players */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 w-full max-w-5xl">
          {players.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              layout
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`relative rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md bg-black/70 transition-all duration-300
        ${
          index === 0
            ? "border-4 border-yellow-400 shadow-yellow-500/50"
            : index === 1
            ? "border-4 border-gray-400 shadow-gray-400/50"
            : "border-4 border-orange-400 shadow-orange-400/50"
        }`}
            >
              {/* Floating Crown */}
              <div className="absolute -top-14 left-1/2 transform -translate-x-1/2">
                {index === 0 && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2583/2583347.png"
                    alt="Crown"
                    className="w-16 animate-bounce"
                  />
                )}
                {index === 1 && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2583/2583391.png"
                    alt="Silver Crown"
                    className="w-14 animate-pulse"
                  />
                )}
                {index === 2 && (
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2583/2583408.png"
                    alt="Bronze Crown"
                    className="w-14 animate-pulse"
                  />
                )}
              </div>

              {/* Avatar with Neon Glow */}
              <div className="relative flex justify-center items-center">
                <div className="absolute w-24 h-24 rounded-full bg-green-400 blur-xl opacity-40"></div>
                <img
                  src={avatars[index % avatars.length]}
                  alt="Player Avatar"
                  className="w-24 h-24 rounded-full border-4 border-green-400 relative z-10"
                />
              </div>

              {/* Player Info */}
              <h2 className="text-2xl sm:text-3xl font-bold mt-6 mb-2 text-green-400">
                #{index + 1} {player.username}
              </h2>
              <p className="text-lg sm:text-xl text-green-300">{player.name}</p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-400 mt-4">
                {player.score} pts
              </p>
            </motion.div>
          ))}
        </div>

        {/* Remaining Players */}
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
              <AnimatePresence>
                {players.slice(3).map((player, index) => (
                  <motion.tr
                    key={player.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    layout
                    className="border-b border-green-800 hover:bg-green-800/20 transition-all duration-300"
                  >
                    <td className="p-4 font-bold">#{index + 4}</td>
                    <td className="p-4 flex items-center gap-4">
                      <img
                        src={avatars[(index + 3) % avatars.length]}
                        alt="Player Avatar"
                        className="w-8 h-8 rounded-full border-2 border-green-400"
                      />
                      {player.username} ({player.name})
                    </td>
                    <td className="p-4 font-bold">{player.score} pts</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
