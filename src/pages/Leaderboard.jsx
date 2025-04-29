import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LiveBackground from "../components/LiveBackground";
import "../pages/global.css"; // Import global CSS for glitch effect
import { FaCrown, FaMedal, FaTrophy } from "react-icons/fa";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);
  const [prevPlayers, setPrevPlayers] = useState([]);
  const [rankChanges, setRankChanges] = useState({});
  const [top3Changed, setTop3Changed] = useState(false);

  const cyberAvatars = [
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber1",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber2",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber3",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber4",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber5",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber6",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber7",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber8",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber9",
    "https://api.dicebear.com/6.x/bottts/svg?seed=Cyber10",
  ];

  const avatars = cyberAvatars;

  useEffect(() => {
    const fetchWithRetry = async (url, retries = 3, delay = 1000) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return await res.json();
        } catch (err) {
          console.error(`Attempt ${i + 1} failed:`, err);
          if (i < retries - 1)
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
      throw new Error("All fetch attempts failed");
    };

    const fetchLeaderboard = async () => {
      try {
        const data = await fetchWithRetry(
          "https://dock-the-quiz-backend-production.up.railway.app/api/leaderboard"
        );
        if (data && data.leaderboard) {
          const sortedPlayers = data.leaderboard.sort(
            (a, b) => b.score - a.score
          );
          setPlayers((prev) => {
            const newRankChanges = {};
            sortedPlayers.forEach((player, index) => {
              const prevIndex = prev.findIndex(
                (p) => p.username === player.username
              );
              if (prevIndex !== -1) {
                if (prevIndex > index) newRankChanges[player.username] = "up";
                else if (prevIndex < index)
                  newRankChanges[player.username] = "down";
              }
            });
            setRankChanges(newRankChanges);
            const top3Changed =
              prev
                .slice(0, 3)
                .map((p) => p.username)
                .join() !==
              sortedPlayers
                .slice(0, 3)
                .map((p) => p.username)
                .join();
            setTop3Changed(top3Changed);
            setPrevPlayers(prev);
            return sortedPlayers;
          });
        }
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <LiveBackground mode="grid" />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 z-10 relative overflow-hidden">
        {/* Title */}
        <h1 className="text-5xl sm:text-7xl text-green-400 font-extrabold mb-10 glitch">
          LIVE LEADERBOARD
        </h1>

        {/* Top 3 Players */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12 w-full max-w-6xl mt-10">
          {players.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.id || index}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              layout
              whileHover={{ scale: 1.1, rotate: 2 }}
              className={`relative rounded-3xl p-8 text-center shadow-2xl backdrop-blur-md bg-gradient-to-br from-black via-gray-800 to-black transition-all duration-300 ${
                index === 0
                  ? "border-8 border-yellow-400 shadow-yellow-500/50"
                  : index === 1
                  ? "border-8 border-gray-400 shadow-gray-400/50"
                  : "border-8 border-orange-400 shadow-orange-400/50"
              } ${top3Changed ? "animate-glow" : ""}`}
            >
              {/* Floating Icon */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                {index === 0 && (
                  <FaCrown className="text-yellow-400 text-6xl animate-bounce" />
                )}
                {index === 1 && (
                  <FaMedal className="text-gray-400 text-5xl animate-pulse" />
                )}
                {index === 2 && (
                  <FaTrophy className="text-orange-400 text-5xl animate-pulse" />
                )}
              </div>

              {/* Avatar with Neon Glow */}
              <div className="relative flex justify-center items-center">
                <div className="absolute w-28 h-28 rounded-full bg-green-400 blur-xl opacity-50"></div>
                <img
                  src={avatars[index % avatars.length]}
                  alt="Player Avatar"
                  className="w-28 h-28 rounded-full border-4 border-green-400 relative z-10"
                />
              </div>

              {/* Player Info */}
              <h2 className="text-3xl sm:text-4xl font-extrabold mt-6 mb-2 text-green-400">
                #{index + 1} {player.username}
              </h2>
              <p className="text-lg sm:text-xl text-green-300">{player.name}</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-400 mt-4">
                {player.score} pts
              </p>
            </motion.div>
          ))}
        </div>

        {/* Remaining Players */}
        <div className="w-full max-w-5xl bg-black/70 border-2 border-green-400 rounded-lg overflow-hidden shadow-lg backdrop-blur-md">
          <table className="w-full text-left text-green-400">
            <thead className="bg-green-800/50">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Player</th>
                <th className="p-4">Score</th>
                <th className="p-4">Change</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {players.slice(3).map((player, index) => (
                  <motion.tr
                    key={player.id || `${player.username}-${index}`}
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
                    <td className="p-4">
                      {rankChanges[player.username] === "up" && (
                        <span className="text-green-400">▲</span>
                      )}
                      {rankChanges[player.username] === "down" && (
                        <span className="text-red-400">▼</span>
                      )}
                    </td>
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
